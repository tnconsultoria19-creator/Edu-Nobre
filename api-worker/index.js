const PASSWORD_ITERATIONS = 310000;
const SESSION_DAYS = 7;
const MAX_BODY_BYTES = 100000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization,Content-Type,X-Bootstrap-Token",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin"
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function respond(data, status) {
  const headers = new Headers(corsHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return new Response(JSON.stringify(data), { status: status || 200, headers: headers });
}

function fail(message, status) {
  return respond({ error: message }, status || 400);
}

function randomHex(byteLength) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes, function (b) { return b.toString(16).padStart(2, "0"); }).join("");
}

function newId(prefix) {
  return prefix + "-" + randomHex(16);
}

async function sha256(value) {
  const out = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(out), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
}

function bytesFromHex(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hashPassword(password, saltHex) {
  const salt = saltHex || randomHex(16);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: bytesFromHex(salt), iterations: PASSWORD_ITERATIONS, hash: "SHA-256" }, key, 256);
  const hash = Array.from(new Uint8Array(bits), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  return "pbkdf2-sha256$" + PASSWORD_ITERATIONS + "$" + salt + "$" + hash;
}

async function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256" || Number(parts[1]) < 100000) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: bytesFromHex(parts[2]), iterations: Number(parts[1]), hash: "SHA-256" }, key, 256);
  const hash = Array.from(new Uint8Array(bits), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  return safeEqual(hash, parts[3]);
}

async function readBody(request) {
  const declared = Number(request.headers.get("content-length") || "0");
  if (declared > MAX_BODY_BYTES) throw new HttpError(413, "Pedido demasiado grande.");
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) throw new HttpError(413, "Pedido demasiado grande.");
  try { return raw ? JSON.parse(raw) : {}; }
  catch (_) { throw new HttpError(400, "JSON inválido."); }
}

function apiRole(role) {
  return role === "admin" ? "Administrador" : role === "creator" ? "Formador" : role === "affiliate" ? "Afiliado" : "Aluno";
}
function dbRole(role) {
  return role === "Administrador" || role === "admin" ? "admin"
    : role === "Formador" || role === "creator" ? "creator"
    : role === "Afiliado" || role === "affiliate" ? "affiliate" : "consumer";
}
function apiStatus(status) { return status === "blocked" ? "Bloqueado" : status === "pending" ? "Pendente" : "Ativo"; }
function dbStatus(status) { return status === "Bloqueado" || status === "blocked" ? "blocked" : status === "Pendente" || status === "pending" ? "pending" : "active"; }
function publicUser(row) {
  return { id: row.id, name: row.full_name, email: row.email, role: apiRole(row.role), status: apiStatus(row.status), avatar: row.avatar_url || undefined, createdAt: row.created_at };
}
function contentType(type) { return type === "ebook" ? "E-books" : type === "arquivo" ? "Arquivos" : type === "evento" ? "Masterclass" : "Cursos Online"; }
function productType(type) { return type === "E-books" ? "ebook" : type === "Arquivos" ? "arquivo" : type === "Masterclass" || type === "Mentores" ? "evento" : "curso"; }
function publicProduct(row) {
  return {
    id: row.id, title: row.title, subtitle: (row.description || "").slice(0, 120), category: row.category || "Outros",
    contentType: contentType(row.product_type), price: Number(row.price_aoa || 0),
    originalPrice: row.original_price_aoa == null ? undefined : Number(row.original_price_aoa),
    author: { name: row.creator_name || "Edu-Nobre", avatar: row.creator_avatar || "", role: row.creator_specialisation || (row.creator_role === "creator" ? "Formador" : "Edu-Nobre") },
    rating: 0, ratingCount: 0, image: row.cover_image_url || "https://placehold.co/600x400?text=Edu-Nobre",
    description: row.description || "",
    approvalStatus: row.moderation_status === "published" && Number(row.is_published) === 1 ? "Publicado" : row.moderation_status === "rejected" ? "Rejeitado" : "Pendente",
    rejectionReason: row.rejection_reason || undefined, creatorEmail: row.creator_email || undefined, createdAt: row.created_at
  };
}

async function logAudit(env, actor, action, entityType, entityId, description) {
  await env.DB.prepare("INSERT INTO audit_logs (id, actor_id, actor_name, actor_email, action, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(newId("audit"), actor ? actor.id : null, actor ? actor.full_name : "Sistema", actor ? actor.email : null, action, entityType, entityId || null, description).run();
}

async function getSessionUser(request, env) {
  const auth = request.headers.get("authorization") || "";
  if (auth.slice(0, 7).toLowerCase() !== "bearer ") return null;
  const token = auth.slice(7).trim();
  if (!token || token.length > 200) return null;
  const tokenHash = await sha256(token);
  return await env.DB.prepare("SELECT u.*, s.id AS session_id FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND datetime(s.expires_at) > CURRENT_TIMESTAMP LIMIT 1")
    .bind(tokenHash).first();
}

function requireUser(user) {
  if (!user) throw new HttpError(401, "Inicie sessão para continuar.");
  if (user.status === "blocked") throw new HttpError(403, "Esta conta está bloqueada.");
  return user;
}
function requireAdmin(user) {
  requireUser(user);
  if (user.role !== "admin") throw new HttpError(403, "Apenas o administrador pode executar esta acção.");
  return user;
}

async function createSession(env, user) {
  const token = randomHex(32);
  const tokenHash = await sha256(token);
  const sessionId = newId("sess");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE datetime(expires_at) <= CURRENT_TIMESTAMP"),
    env.DB.prepare("INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)").bind(sessionId, user.id, tokenHash, expiresAt)
  ]);
  return token;
}

async function createAccount(env, name, email, password, role, status) {
  const id = newId("usr");
  const passwordHash = await hashPassword(password);
  await env.DB.prepare("INSERT INTO users (id, email, password_hash, full_name, role, status) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, email, passwordHash, name, role, status).run();
  if (role === "creator") {
    await env.DB.prepare("INSERT INTO creator_profiles (user_id, public_name, application_status) VALUES (?, ?, 'pending')").bind(id, name).run();
  }
  return await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
}

function validateCredentials(name, email, password, adminMode) {
  if (typeof email !== "string" || email.length > 254 || email.indexOf("@") < 1 || email.indexOf(".", email.indexOf("@")) < email.indexOf("@") + 2) throw new HttpError(400, "Introduza um endereço de e-mail válido.");
  if (typeof password !== "string" || password.length < (adminMode ? 12 : 8) || password.length > 200) throw new HttpError(400, "A palavra-passe deve ter pelo menos " + (adminMode ? "12" : "8") + " caracteres.");
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) throw new HttpError(400, "Introduza o nome completo.");
}

const PRODUCT_SELECT = "SELECT p.*, u.full_name AS creator_name, u.email AS creator_email, u.avatar_url AS creator_avatar, u.role AS creator_role, cp.specialisation AS creator_specialisation FROM products p JOIN users u ON u.id = p.creator_id LEFT JOIN creator_profiles cp ON cp.user_id = u.id";

async function listProducts(env, user) {
  let result;
  if (user && user.status !== "blocked" && user.role === "admin") {
    result = await env.DB.prepare(PRODUCT_SELECT + " WHERE p.moderation_status != 'archived' ORDER BY p.created_at DESC").all();
  } else if (user && user.status !== "blocked" && user.role === "creator") {
    result = await env.DB.prepare(PRODUCT_SELECT + " WHERE ((p.moderation_status = 'published' AND p.is_published = 1) OR (p.creator_id = ? AND p.moderation_status != 'archived')) ORDER BY p.created_at DESC").bind(user.id).all();
  } else {
    result = await env.DB.prepare(PRODUCT_SELECT + " WHERE p.moderation_status = 'published' AND p.is_published = 1 ORDER BY p.created_at DESC").all();
  }
  return (result.results || []).map(publicProduct);
}

async function handle(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/api" || path === "/api/health") {
    const db = await env.DB.prepare("SELECT 1 AS ok").first();
    return respond({ service: "Edu-Nobre API", status: db && db.ok === 1 ? "ok" : "degraded", database: db && db.ok === 1 ? "connected" : "unavailable" }, db && db.ok === 1 ? 200 : 503);
  }
  if (path === "/setup" && request.method === "GET") {
    const setupHtml = `<!doctype html>
<html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Configuração inicial | Edu-Nobre</title>
<style>
:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#faf7f4;color:#1a1a1a;font:16px Arial,sans-serif;min-height:100vh;display:grid;place-items:center;padding:20px}.card{width:min(100%,480px);background:white;border:1px solid #e2d5c8;border-radius:24px;padding:28px;box-shadow:0 20px 60px #1a1a1a12}h1{font-size:25px;margin:0 0 8px;color:#0c2340}p{color:#655b54;line-height:1.5;font-size:14px}label{display:block;font-size:13px;font-weight:700;margin:15px 0 6px}input{width:100%;padding:12px;border:1px solid #e2d5c8;border-radius:12px;font:inherit}button{width:100%;margin-top:20px;padding:14px;border:0;border-radius:999px;color:white;background:#be462a;font-weight:700;cursor:pointer}button:disabled{opacity:.5;cursor:not-allowed}.status{padding:12px;border-radius:12px;background:#f7f3ee;font-size:14px;line-height:1.5;margin-top:14px;white-space:pre-wrap}.hidden{display:none!important}.brand{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#be462a;margin-bottom:16px}
</style></head><body><main class="card"><div class="brand">Edu-Nobre · configuração protegida</div><h1>Criar administrador principal</h1>
<p>Utilize esta página uma única vez para criar a primeira conta administrativa. A palavra-passe é enviada directamente à API por HTTPS e não é guardada no navegador.</p>
<div id="status" class="status" role="status">A verificar se a configuração inicial ainda está disponível…</div>
<form id="form" class="hidden">
<label for="name">Nome completo</label><input id="name" autocomplete="name" minlength="2" maxlength="100" required>
<label for="email">E-mail administrativo</label><input id="email" type="email" autocomplete="email" maxlength="254" required>
<label for="password">Palavra-passe (mínimo 12 caracteres)</label><input id="password" type="password" autocomplete="new-password" minlength="12" maxlength="200" required>
<label for="token">Token de configuração de utilização única</label><input id="token" type="password" autocomplete="off" required>
<button id="submit" type="submit">Criar administrador</button>
</form>
</main><script>
const statusBox=document.getElementById('status'),form=document.getElementById('form'),button=document.getElementById('submit');
fetch('/api/auth/bootstrap-status',{cache:'no-store'}).then(r=>r.json()).then(s=>{
 if(s.bootstrapRequired&&s.bootstrapEnabled){form.classList.remove('hidden');statusBox.textContent='Configuração disponível. Crie a conta do administrador principal.';}
 else{form.classList.add('hidden');statusBox.textContent=s.bootstrapRequired?'A configuração não está habilitada. Contacte o responsável técnico.':'A conta administrativa inicial já existe. A criação inicial está encerrada; inicie sessão no Edu-Nobre.';}
}).catch(()=>{statusBox.textContent='Não foi possível verificar a API. Confirme se o serviço está activo.';});
form.addEventListener('submit',async(e)=>{
 e.preventDefault();button.disabled=true;statusBox.textContent='A criar a conta administrativa…';
 try{
  const r=await fetch('/api/auth/bootstrap',{method:'POST',headers:{'Content-Type':'application/json','X-Bootstrap-Token':document.getElementById('token').value},body:JSON.stringify({name:document.getElementById('name').value,email:document.getElementById('email').value,password:document.getElementById('password').value})});
  const data=await r.json();
  if(!r.ok)throw new Error(data.error||'Não foi possível criar a conta.');
  form.reset();form.classList.add('hidden');
  statusBox.textContent='Administrador criado com sucesso. Abra o site Edu-Nobre e inicie sessão com o e-mail e a palavra-passe que acabou de definir. A configuração inicial está agora encerrada.';
 }catch(err){statusBox.textContent=err instanceof Error?err.message:'Ocorreu um erro.';button.disabled=false;}
});
</script></body></html>`;
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "text/html; charset=utf-8");
    headers.set("Cache-Control", "no-store");
    headers.set("X-Content-Type-Options", "nosniff");
    return new Response(setupHtml, { status: 200, headers: headers });
  }

  if (!path.startsWith("/api/")) return fail("Rota não encontrada.", 404);
  const currentUser = await getSessionUser(request, env);
  const parts = path.split("/").filter(Boolean);
  const method = request.method.toUpperCase();

  if (path === "/api/auth/bootstrap-status" && method === "GET") {
    const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").first();
    return respond({ bootstrapRequired: Number(row.count) === 0, bootstrapEnabled: Boolean(env.BOOTSTRAP_TOKEN) });
  }

  if (path === "/api/auth/bootstrap" && method === "POST") {
    if (!env.BOOTSTRAP_TOKEN || !safeEqual(request.headers.get("x-bootstrap-token") || "", env.BOOTSTRAP_TOKEN)) throw new HttpError(403, "Token de configuração inválido.");
    const existingAdmin = await env.DB.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").first();
    if (existingAdmin) throw new HttpError(409, "O administrador inicial já foi criado.");
    const body = await readBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const password = body.password;
    validateCredentials(name, email, password, true);
    const user = await createAccount(env, name, email, password, "admin", "active");
    await logAudit(env, user, "admin_bootstrap", "user", user.id, "Conta de administrador inicial criada.");
    const token = await createSession(env, user);
    return respond({ user: publicUser(user), token }, 201);
  }

  if (path === "/api/auth/register" && method === "POST") {
    const body = await readBody(request);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = String(body.email || "").trim().toLowerCase();
    const password = body.password;
    const role = dbRole(String(body.role || "Aluno"));
    if (role === "admin") throw new HttpError(403, "Não é possível criar uma conta de administrador por esta via.");
    validateCredentials(name, email, password, false);
    const status = role === "creator" ? "pending" : "active";
    let user;
    try { user = await createAccount(env, name, email, password, role, status); }
    catch (error) {
      if (String(error && error.message || error).toLowerCase().includes("unique")) throw new HttpError(409, "Já existe uma conta com este e-mail. Inicie sessão.");
      throw error;
    }
    await logAudit(env, user, "user_registered", "user", user.id, "Conta registada com o papel " + role + ".");
    const token = await createSession(env, user);
    return respond({ user: publicUser(user), token }, 201);
  }

  if (path === "/api/auth/login" && method === "POST") {
    const body = await readBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || email.length > 254 || !password || password.length > 200) throw new HttpError(400, "E-mail ou palavra-passe incorrectos.");
    const attempt = await env.DB.prepare("SELECT attempts, locked_until FROM auth_attempts WHERE email = ?").bind(email).first();
    if (attempt && attempt.locked_until && new Date(attempt.locked_until).getTime() > Date.now()) throw new HttpError(429, "Demasiadas tentativas. Aguarde 15 minutos.");
    const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").bind(email).first();
    const valid = user ? await verifyPassword(password, user.password_hash) : false;
    if (!valid || user.status === "blocked") {
      await env.DB.prepare("INSERT INTO auth_attempts (email, attempts, window_started_at, locked_until) VALUES (?, 1, CURRENT_TIMESTAMP, NULL) ON CONFLICT(email) DO UPDATE SET attempts = CASE WHEN datetime(window_started_at, '+15 minutes') < CURRENT_TIMESTAMP THEN 1 ELSE attempts + 1 END, window_started_at = CASE WHEN datetime(window_started_at, '+15 minutes') < CURRENT_TIMESTAMP THEN CURRENT_TIMESTAMP ELSE window_started_at END, locked_until = CASE WHEN (CASE WHEN datetime(window_started_at, '+15 minutes') < CURRENT_TIMESTAMP THEN 1 ELSE attempts + 1 END) >= 8 THEN datetime('now', '+15 minutes') ELSE locked_until END").bind(email).run();
      throw new HttpError(401, "E-mail ou palavra-passe incorrectos.");
    }
    await env.DB.prepare("DELETE FROM auth_attempts WHERE email = ?").bind(email).run();
    await env.DB.prepare("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(user.id).run();
    await logAudit(env, user, "login", "session", user.id, "Sessão iniciada.");
    const token = await createSession(env, user);
    return respond({ user: publicUser(user), token }, 200);
  }

  if (path === "/api/auth/me" && method === "GET") {
    requireUser(currentUser);
    return respond({ user: publicUser(currentUser) });
  }

  if (path === "/api/auth/logout" && method === "POST") {
    requireUser(currentUser);
    await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(currentUser.session_id).run();
    await logAudit(env, currentUser, "logout", "session", currentUser.id, "Sessão terminada.");
    return respond({ ok: true });
  }

  if (path === "/api/products" && method === "GET") return respond({ items: await listProducts(env, currentUser) });

  if (path === "/api/products" && method === "POST") {
    const user = requireUser(currentUser);
    if (user.role !== "admin" && user.role !== "creator") throw new HttpError(403, "Apenas formadores podem submeter conteúdos.");
    if (user.role === "creator" && user.status !== "active") throw new HttpError(403, "A sua candidatura ainda aguarda aprovação.");
    const body = await readBody(request);
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const price = Number(body.price);
    const originalPrice = body.originalPrice == null || body.originalPrice === "" ? null : Number(body.originalPrice);
    if (title.length < 3 || title.length > 180) throw new HttpError(400, "O título deve conter entre 3 e 180 caracteres.");
    if (!category || category.length > 100) throw new HttpError(400, "Indique uma categoria válida.");
    if (!Number.isSafeInteger(price) || price < 0 || price > 1000000000) throw new HttpError(400, "O preço deve ser um valor inteiro em Kz.");
    if (originalPrice !== null && (!Number.isSafeInteger(originalPrice) || originalPrice < price || originalPrice > 1000000000)) throw new HttpError(400, "O preço anterior deve ser igual ou superior ao preço actual.");
    const id = newId("prd");
    const type = productType(String(body.contentType || "Cursos Online"));
    const status = user.role === "admin" && body.approvalStatus === "Publicado" ? "published" : "pending";
    await env.DB.prepare("INSERT INTO products (id, creator_id, title, description, product_type, category, price_aoa, original_price_aoa, cover_image_url, is_published, moderation_status, rejection_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)")
      .bind(id, user.id, title, description, type, category, price, originalPrice, typeof body.image === "string" ? body.image.slice(0, 2000) : null, status === "published" ? 1 : 0, status).run();
    const saved = await env.DB.prepare(PRODUCT_SELECT + " WHERE p.id = ?").bind(id).first();
    await logAudit(env, user, "product_created", "product", id, "Conteúdo criado: " + title + " (" + status + ").");
    return respond({ item: publicProduct(saved) }, 201);
  }

  if (parts[0] === "api" && parts[1] === "products" && parts.length === 3 && method === "PATCH") {
    const user = requireUser(currentUser);
    const id = parts[2];
    const body = await readBody(request);
    const existing = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    if (!existing) throw new HttpError(404, "Conteúdo não encontrado.");
    if (user.role !== "admin" && (user.role !== "creator" || existing.creator_id !== user.id)) throw new HttpError(403, "Não tem permissão para editar este conteúdo.");
    if (user.role === "creator" && user.status !== "active") throw new HttpError(403, "A sua candidatura ainda aguarda aprovação.");
    const title = typeof body.title === "string" ? body.title.trim() : existing.title;
    const description = typeof body.description === "string" ? body.description.trim() : (existing.description || "");
    const category = typeof body.category === "string" ? body.category.trim() : existing.category;
    const price = body.price === undefined ? existing.price_aoa : Number(body.price);
    const originalPrice = body.originalPrice === undefined ? existing.original_price_aoa : (body.originalPrice == null || body.originalPrice === "" ? null : Number(body.originalPrice));
    const type = body.contentType === undefined ? existing.product_type : productType(String(body.contentType));
    if (title.length < 3 || title.length > 180 || !category || category.length > 100) throw new HttpError(400, "Título ou categoria inválidos.");
    if (!Number.isSafeInteger(price) || price < 0 || price > 1000000000) throw new HttpError(400, "Preço inválido.");
    if (originalPrice !== null && (!Number.isSafeInteger(Number(originalPrice)) || Number(originalPrice) < price || Number(originalPrice) > 1000000000)) throw new HttpError(400, "Preço anterior inválido.");
    const nextStatus = user.role === "admin" ? (body.approvalStatus === "Publicado" ? "published" : body.approvalStatus === "Rejeitado" ? "rejected" : existing.moderation_status) : "pending";
    const nextReason = user.role === "admin" && body.rejectionReason !== undefined ? String(body.rejectionReason).slice(0, 1000) : (user.role === "creator" ? null : existing.rejection_reason);
    const image = body.image === undefined ? existing.cover_image_url : (typeof body.image === "string" ? body.image.slice(0, 2000) : null);
    await env.DB.prepare("UPDATE products SET title = ?, description = ?, product_type = ?, category = ?, price_aoa = ?, original_price_aoa = ?, cover_image_url = ?, moderation_status = ?, is_published = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(title, description, type, category, price, originalPrice, image, nextStatus, nextStatus === "published" ? 1 : 0, nextReason, id).run();
    const saved = await env.DB.prepare(PRODUCT_SELECT + " WHERE p.id = ?").bind(id).first();
    await logAudit(env, user, "product_updated", "product", id, "Conteúdo actualizado: " + title + "; estado " + nextStatus + ".");
    return respond({ item: publicProduct(saved) });
  }

  if (parts[0] === "api" && parts[1] === "products" && parts.length === 3 && method === "DELETE") {
    const user = requireUser(currentUser);
    const id = parts[2];
    const existing = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    if (!existing) throw new HttpError(404, "Conteúdo não encontrado.");
    if (user.role !== "admin" && (user.role !== "creator" || existing.creator_id !== user.id)) throw new HttpError(403, "Não tem permissão para eliminar este conteúdo.");
    await env.DB.prepare("UPDATE products SET moderation_status = 'archived', is_published = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
    await logAudit(env, user, "product_archived", "product", id, "Conteúdo arquivado: " + existing.title + ".");
    return respond({ ok: true });
  }

  if (parts[0] === "api" && parts[1] === "admin" && parts[2] === "products" && parts[4] === "review" && method === "POST") {
    const user = requireAdmin(currentUser);
    const id = parts[3];
    const body = await readBody(request);
    const decision = body.decision;
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 1000) : "";
    if (decision !== "approve" && decision !== "reject") throw new HttpError(400, "Decisão de moderação inválida.");
    if (decision === "reject" && !reason) throw new HttpError(400, "Indique o motivo da rejeição.");
    const item = await env.DB.prepare("SELECT id, title FROM products WHERE id = ?").bind(id).first();
    if (!item) throw new HttpError(404, "Conteúdo não encontrado.");
    const status = decision === "approve" ? "published" : "rejected";
    await env.DB.prepare("UPDATE products SET moderation_status = ?, is_published = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(status, status === "published" ? 1 : 0, decision === "reject" ? reason : null, id).run();
    await logAudit(env, user, "product_" + decision, "product", id, (decision === "approve" ? "Conteúdo aprovado: " : "Conteúdo rejeitado: ") + item.title + (reason ? "; motivo: " + reason : "") + ".");
    return respond({ ok: true });
  }

  if (path === "/api/admin/users" && method === "GET") {
    requireAdmin(currentUser);
    const result = await env.DB.prepare("SELECT id, email, full_name, role, status, avatar_url, created_at FROM users ORDER BY created_at DESC LIMIT 1000").all();
    return respond({ users: (result.results || []).map(publicUser) });
  }

  if (parts[0] === "api" && parts[1] === "admin" && parts[2] === "users" && parts.length === 4 && method === "PATCH") {
    const admin = requireAdmin(currentUser);
    const id = parts[3];
    const body = await readBody(request);
    const target = await env.DB.prepare("SELECT id, role, status, full_name FROM users WHERE id = ?").bind(id).first();
    if (!target) throw new HttpError(404, "Utilizador não encontrado.");
    if (target.role === "admin") throw new HttpError(403, "O papel do administrador não pode ser alterado por esta via.");
    let role = target.role;
    let status = target.status;
    if (body.role !== undefined) {
      role = dbRole(String(body.role));
      if (role === "admin") throw new HttpError(403, "Não é possível promover uma conta para administrador por esta via.");
      if (role === "creator" && role !== target.role) status = "pending";
    }
    if (body.status !== undefined) status = dbStatus(String(body.status));
    await env.DB.prepare("UPDATE users SET role = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(role, status, id).run();
    if (role === "creator") {
      await env.DB.prepare("INSERT INTO creator_profiles (user_id, public_name, application_status) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET application_status = ?, updated_at = CURRENT_TIMESTAMP")
        .bind(id, target.full_name, status === "active" ? "approved" : "pending", status === "active" ? "approved" : "pending").run();
    }
    await logAudit(env, admin, "user_updated", "user", id, "Utilizador actualizado: papel " + role + "; estado " + status + ".");
    const saved = await env.DB.prepare("SELECT id, email, full_name, role, status, avatar_url, created_at FROM users WHERE id = ?").bind(id).first();
    return respond({ user: publicUser(saved) });
  }

  if (parts[0] === "api" && parts[1] === "admin" && parts[2] === "users" && parts.length === 4 && method === "DELETE") {
    const admin = requireAdmin(currentUser);
    const id = parts[3];
    const target = await env.DB.prepare("SELECT id, role, full_name FROM users WHERE id = ?").bind(id).first();
    if (!target) throw new HttpError(404, "Utilizador não encontrado.");
    if (target.role === "admin" || id === admin.id) throw new HttpError(403, "Não pode remover uma conta de administrador.");
    await env.DB.prepare("UPDATE users SET status = 'blocked', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
    await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id).run();
    await logAudit(env, admin, "user_blocked", "user", id, "Conta bloqueada/removida da gestão: " + target.full_name + ".");
    return respond({ ok: true });
  }

  if (path === "/api/admin/audit" && method === "GET") {
    requireAdmin(currentUser);
    const search = String(url.searchParams.get("q") || "").trim().slice(0, 120);
    const pattern = "%" + search + "%";
    const result = search
      ? await env.DB.prepare("SELECT id, actor_name, actor_email, action, entity_type, entity_id, description, created_at FROM audit_logs WHERE actor_name LIKE ? OR actor_email LIKE ? OR action LIKE ? OR entity_type LIKE ? OR description LIKE ? ORDER BY created_at DESC LIMIT 500").bind(pattern, pattern, pattern, pattern, pattern).all()
      : await env.DB.prepare("SELECT id, actor_name, actor_email, action, entity_type, entity_id, description, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 500").all();
    return respond({ logs: (result.results || []).map(function (row) {
      return { id: row.id, actorName: row.actor_name, actorEmail: row.actor_email || undefined, action: row.action, entityType: row.entity_type, entityId: row.entity_id || undefined, description: row.description, createdAt: row.created_at };
    }) });
  }

  if (path === "/api/orders" && method === "POST") {
    const user = requireUser(currentUser);
    if (user.status !== "active") throw new HttpError(403, "A conta precisa de estar activa para efectuar um pedido.");
    const body = await readBody(request);
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 50) throw new HttpError(400, "O pedido deve conter entre 1 e 50 produtos.");
    const quantities = new Map();
    for (const row of body.items) {
      const id = typeof row.productId === "string" ? row.productId : "";
      const qty = Number(row.quantity);
      if (!id || !Number.isInteger(qty) || qty < 1 || qty > 20) throw new HttpError(400, "Produto ou quantidade inválidos.");
      quantities.set(id, (quantities.get(id) || 0) + qty);
    }
    const ids = Array.from(quantities.keys());
    if (ids.length > 50 || Array.from(quantities.values()).some(function (qty) { return qty > 20; })) throw new HttpError(400, "Quantidade de produtos inválida.");
    const placeholders = ids.map(function () { return "?"; }).join(",");
    const productQuery = env.DB.prepare("SELECT id, title, creator_id, price_aoa FROM products WHERE id IN (" + placeholders + ") AND moderation_status = 'published' AND is_published = 1");
    const productRows = (await productQuery.bind(...ids).all()).results || [];
    if (productRows.length !== ids.length) throw new HttpError(400, "Um ou mais produtos já não estão disponíveis.");
    const productMap = new Map(productRows.map(function (p) { return [p.id, p]; }));
    const orderId = newId("ord");
    const orderItems = [];
    let total = 0;
    ids.forEach(function (id) {
      const product = productMap.get(id);
      const quantity = quantities.get(id);
      const unit = Number(product.price_aoa);
      const line = unit * quantity;
      if (!Number.isSafeInteger(line) || !Number.isSafeInteger(total + line)) throw new HttpError(400, "Valor total inválido.");
      total += line;
      orderItems.push(env.DB.prepare("INSERT INTO order_items (id, order_id, product_id, creator_id, quantity, unit_price_aoa, line_total_aoa) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(newId("orditem"), orderId, id, product.creator_id, quantity, unit, line));
    });
    const channel = body.contactChannel === "whatsapp" ? "whatsapp" : "platform";
    await env.DB.batch([
      env.DB.prepare("INSERT INTO orders (id, buyer_id, total_amount_aoa, status, contact_channel) VALUES (?, ?, ?, 'requested', ?)").bind(orderId, user.id, total, channel),
      ...orderItems,
      env.DB.prepare("INSERT INTO audit_logs (id, actor_id, actor_name, actor_email, action, entity_type, entity_id, description) VALUES (?, ?, ?, ?, 'order_requested', 'order', ?, ?)")
        .bind(newId("audit"), user.id, user.full_name, user.email, orderId, "Pedido de compra criado; total " + total + " Kz.")
    ]);
    return respond({ orderId: orderId, status: "requested", totalAmountAOA: total, message: "Pedido registado. O pagamento ainda não foi processado." }, 201);
  }

  if ((path === "/api/orders" || path === "/api/admin/orders") && method === "GET") {
    const user = requireUser(currentUser);
    const adminView = path === "/api/admin/orders";
    if (adminView) requireAdmin(user);
    const result = adminView
      ? await env.DB.prepare("SELECT o.*, u.full_name AS buyer_name, u.email AS buyer_email FROM orders o JOIN users u ON u.id = o.buyer_id ORDER BY o.created_at DESC LIMIT 500").all()
      : await env.DB.prepare("SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC LIMIT 200").bind(user.id).all();
    return respond({ orders: result.results || [] });
  }

  if (path === "/api/library" && method === "GET") {
    const user = requireUser(currentUser);
    const result = await env.DB.prepare(PRODUCT_SELECT + " JOIN enrollments e ON e.product_id = p.id WHERE e.user_id = ? AND e.status IN ('active', 'completed') ORDER BY e.granted_at DESC").bind(user.id).all();
    return respond({ items: (result.results || []).map(publicProduct) });
  }

  throw new HttpError(404, "Rota não encontrada.");
}

export default {
  async fetch(request, env) {
    try { return await handle(request, env); }
    catch (error) {
      if (error instanceof HttpError) return fail(error.message, error.status);
      console.error("Edu-Nobre API error", error && error.message ? error.message : error);
      return fail("Erro interno do servidor.", 500);
    }
  }
};
