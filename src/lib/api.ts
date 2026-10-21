import { AuditLogEntry, CatalogItem, User } from '../types';

const API_BASE = (import.meta.env.VITE_EDUNOBRE_API_URL || 'https://edu-nobre-api.tnconsultoria19.workers.dev').replace(/\/$/, '');
const TOKEN_KEY = 'edunombre_api_token_v1';

export function getSessionToken(): string | null {
  try { return window.sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function setSessionToken(token: string | null): void {
  try {
    if (token) window.sessionStorage.setItem(TOKEN_KEY, token);
    else window.sessionStorage.removeItem(TOKEN_KEY);
  } catch { /* Private browsing can disable session storage. */ }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const token = getSessionToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: 'no-store' });
  const payload = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) throw new Error(payload.error || `A API respondeu com erro (${response.status}).`);
  return payload as T;
}

interface AuthResponse { user: User; token: string; }
export async function apiRegister(input: { name: string; email: string; password: string; role: User['role'] }) {
  const result = await request<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(input) });
  setSessionToken(result.token);
  return result;
}
export async function apiLogin(input: { email: string; password: string }) {
  const result = await request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) });
  setSessionToken(result.token);
  return result;
}
export async function apiMe() { return request<{ user: User }>('/api/auth/me'); }
export async function apiLogout() {
  try { if (getSessionToken()) await request<{ok:boolean}>('/api/auth/logout', { method: 'POST', body: '{}' }); }
  finally { setSessionToken(null); }
}
export async function apiListProducts() { return request<{items: CatalogItem[]}>('/api/products'); }
export async function apiCreateProduct(item: CatalogItem) {
  return (await request<{item: CatalogItem}>('/api/products', { method: 'POST', body: JSON.stringify(item) })).item;
}
export async function apiUpdateProduct(item: CatalogItem) {
  return (await request<{item: CatalogItem}>(`/api/products/${encodeURIComponent(item.id)}`, { method: 'PATCH', body: JSON.stringify(item) })).item;
}
export async function apiArchiveProduct(id: string) {
  return request<{ok:boolean}>(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
export async function apiReviewProduct(id: string, decision: 'approve' | 'reject', reason?: string) {
  return request<{ok:boolean}>(`/api/admin/products/${encodeURIComponent(id)}/review`, { method: 'POST', body: JSON.stringify({ decision, reason }) });
}
export async function apiListUsers() { return request<{users: User[]}>('/api/admin/users'); }
export async function apiUpdateUser(id: string, changes: {role?: User['role']; status?: NonNullable<User['status']>}) {
  return (await request<{user: User}>(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(changes) })).user;
}
export async function apiRemoveUser(id: string) {
  return request<{ok:boolean}>(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
export async function apiListLibrary() { return request<{items: CatalogItem[]}>('/api/library'); }
export async function apiCreateOrder(items: Array<{productId: string; quantity: number}>, contactChannel: 'whatsapp' | 'platform' = 'whatsapp') {
  return request<{orderId:string; status:string; totalAmountAOA:number; message:string}>('/api/orders', {
    method: 'POST', body: JSON.stringify({items, contactChannel})
  });
}

const auditAction = (action: string): AuditLogEntry['action'] => {
  if (action === 'product_created' || action === 'order_requested' || action === 'admin_bootstrap') return 'Criado';
  if (action === 'product_updated') return 'Editado';
  if (action === 'product_archived' || action === 'user_blocked') return 'Eliminado';
  if (action === 'product_approve' || action === 'product_approved') return 'Aprovado';
  if (action === 'product_reject' || action === 'product_rejected') return 'Rejeitado';
  if (action === 'user_registered') return 'Registado';
  if (action === 'login') return 'Sessão iniciada';
  if (action === 'logout') return 'Sessão terminada';
  if (action === 'user_updated' || action === 'user_role_updated') return 'Papel alterado';
  return 'Estado alterado';
};
const auditEntity = (value: string): AuditLogEntry['entityType'] =>
  value === 'product' ? 'Conteúdo' : value === 'user' ? 'Utilizador' : 'Sessão';

export async function apiListAudit(query = '') {
  const suffix = query ? `?q=${encodeURIComponent(query)}` : '';
  const result = await request<{logs:Array<{id:string;actorName:string;actorEmail?:string;action:string;entityType:string;entityId?:string;description:string;createdAt:string}>}>(`/api/admin/audit${suffix}`);
  return result.logs.map((entry): AuditLogEntry => ({
    ...entry, action: auditAction(entry.action), entityType: auditEntity(entry.entityType)
  }));
}
