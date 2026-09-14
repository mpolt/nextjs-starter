# Starter

Next.js-Template mit Authentifizierung, Dashboard und Einstellungen. Ideal als Ausgangspunkt für neue Apps.

## Was mitkommt

- **Auth** (Better Auth): Registrierung, Login, E-Mail-Verifikation, Passwort-Reset, Sessions, optionales Google-Login, Admin-Plugin
- **Dashboard** mit Sidebar und geschützten Routen
- **Einstellungen**: Profil, Passwort ändern, aktive Sitzungen
- **Theme**: Hell/Dunkel/System + hoher Kontrast
- **UI**: shadcn (Base Nova), TanStack Form, Zod

## Stack

- Next.js 16 (App Router)
- Better Auth + Prisma 7 (MariaDB/MySQL)
- shadcn/ui + Base UI, Tailwind CSS 4
- TanStack Form, Zod
- Vitest (Unit-Tests)
- pnpm

## Setup

### 1. Abhängigkeiten

```bash
pnpm install
```

### 2. Datenbank

Lokale MariaDB mit Docker:

```bash
docker compose up -d
```

Oder eine bestehende MySQL/MariaDB-Instanz nutzen.

### 3. Umgebungsvariablen

```bash
cp .env.example .env
```

In `.env` anpassen:

- `DATABASE_URL` — Verbindungsstring zur DB
- `BETTER_AUTH_SECRET` — Secret erzeugen: `openssl rand -base64 32`
- `BETTER_AUTH_URL` — z. B. `http://localhost:3000`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, Google-Login
- `ADMIN_EMAIL` — optional, diese Adresse wird beim Signup zum Admin

### 4. Migrationen

```bash
pnpm db:migrate
```

### 5. Entwicklungsserver

```bash
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## E-Mails

Solange kein Mail-Provider angebunden ist, schreibt [`src/lib/email.ts`](src/lib/email.ts) alle Mails in die **Server-Konsole** (Verifikation, Passwort-Reset). Das ist Absicht für die lokale Entwicklung.

## Google-Login

Google ist **optional**. Der Button erscheint auf Login und Registrierung nur, wenn **beide** Variablen in `.env` gesetzt sind:

```env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

In der Google Cloud Console als Redirect-URI eintragen:

`http://localhost:3000/api/auth/callback/google`

Ohne Keys bleibt nur E-Mail/Passwort — der Rest der App ist unverändert.

## Admin

Das Better-Auth-Admin-Plugin bringt Rollen (`user` / `admin`), Sperren und Impersonation mit. Die Benutzerverwaltung liegt unter `/dashboard/users` und ist nur für Admins sichtbar.

Den ersten Admin anlegen:

1. `ADMIN_EMAIL="du@example.com"` in `.env` setzen und mit genau dieser Adresse registrieren (E-Mail oder Google), **oder**
2. CLI: `pnpm dlx auth@latest create-admin --email du@example.com --name "Admin"`

Danach im Dashboard unter **Benutzer** Rollen setzen, Konten sperren oder als anderer User impersonieren.

## Projektnamen ändern

Name, Beschreibung und Logo-Buchstabe stehen zentral in [`src/lib/site.ts`](src/lib/site.ts):

```ts
export const site = {
  name: "Starter",
  description: "Next.js Starter mit Auth und Dashboard",
  logoLetter: "S",
} as const;
```

Zusätzlich den `name` in `package.json` und ggf. den Contrast-Storage-Key in `src/components/contrast-provider.tsx` anpassen.

## Ordnerstruktur

```
src/
  app/
    (frontend)/     # öffentliche Seiten (Landing)
    (auth)/         # Login, Register, Reset, Verify
    (backend)/      # Dashboard, Settings, Benutzerverwaltung (App-Shell, nicht die API)
    api/auth/       # Better Auth Catch-all
  components/
    auth/           # Auth- und Settings-Formulare
    backend/        # Sidebar, Settings-Nav
    forms/          # wiederverwendbare Form-Felder
    ui/             # shadcn-Komponenten
  lib/
    auth.ts         # Better Auth Server
    site.ts         # Branding
    email.ts        # Dev-Mailer (Konsole)
    redirect.ts     # Open-Redirect-Schutz (+ Tests)
    validations/    # Zod-Schemas (+ Tests)
prisma/
  schema/           # Prisma-Schema (Auth-Modelle)
```

Die Route Groups `(frontend)` und `(backend)` erscheinen nicht in der URL. `(backend)` meint die eingeloggte App-Shell, nicht ein separates Backend.

## Scripts

| Script | Beschreibung |
|--------|--------------|
| `pnpm dev` | Entwicklungsserver |
| `pnpm build` | Prisma generate + Production-Build |
| `pnpm start` | Production-Server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript-Check |
| `pnpm test` | Unit-Tests (Vitest) |
| `pnpm test:watch` | Unit-Tests im Watch-Modus |
| `pnpm db:migrate` | Prisma Migrate (dev) |
| `pnpm db:studio` | Prisma Studio |

## Weiterführend

- [Better Auth](https://www.better-auth.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [Next.js](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
