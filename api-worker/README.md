# Edu-Nobre API

Cloudflare Worker API backed by the `kwanzaa-nobre-db` D1 database.

## Deploy and migrate

From the repository root, install Wrangler in your environment and run:

```powershell
npx wrangler d1 execute kwanzaa-nobre-db --remote --file=api-worker/migrations/0001_initial.sql --config api-worker/wrangler.toml
npx wrangler deploy --config api-worker/wrangler.toml
```

Set `BOOTSTRAP_TOKEN` using a Cloudflare Worker secret. Do not put it in source control. Once the first administrator has been created, the bootstrap endpoint refuses further administrator creation.

## Security model

- Passwords are PBKDF2-SHA-256 hashes with random per-user salts.
- Session tokens are random bearer tokens; only SHA-256 token hashes are stored in D1.
- Public signup can create Aluno, Formador, or Afiliado accounts only. Formadores begin as pending.
- Admin-only moderation, user management, and audit reads are enforced by the API, not only the UI.
- Orders are purchase requests. No card payment is processed and no paid course access is granted until a payment-provider flow is configured.
