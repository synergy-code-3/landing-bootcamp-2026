## Resumen

<!-- ¿Qué cambia y por qué? 1-3 líneas. -->

## Tipo de cambio

- [ ] Feature (nueva funcionalidad)
- [ ] Fix (corrección de bug)
- [ ] Refactor (sin cambio de comportamiento)
- [ ] Docs / chore / config
- [ ] Breaking change

## Áreas afectadas

- [ ] Landing pública
- [ ] `/dashboard`
- [ ] `/ops` (Synergy Ops)
- [ ] API routes
- [ ] Schema / migraciones (Supabase)
- [ ] Infra (Vercel, env vars, GitHub Actions)

## Checklist

- [ ] `npx tsc --noEmit` pasa
- [ ] `npm run build` pasa
- [ ] Probado en `npm run dev` (golden path + edge cases)
- [ ] Si toca DB: incluye migración SQL y se corrió en Supabase
- [ ] Si toca env vars: actualizadas en Vercel (todos los environments)
- [ ] No hay secretos commiteados

## Cómo probar

<!-- Pasos para que el reviewer reproduzca el cambio. -->

## Screenshots / video

<!-- Si toca UI. -->

## Notas para el reviewer

<!-- Decisiones, trade-offs, follow-ups. -->
