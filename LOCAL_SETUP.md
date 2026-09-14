# Local Development and Database Setup

This guide explains how to run Dhule Drive locally with your own MySQL-compatible database. It intentionally uses a safe environment template rather than publishing any managed-environment or production credentials.

> **Security rule:** Create `.env` from the template below, but never commit it. The local environment file may contain your database password and session secret.

## 1. Prerequisites

Install Node.js, `pnpm`, and a MySQL-compatible server. The project uses Drizzle’s MySQL dialect and the `mysql2` driver, so MySQL 8 or a compatible TiDB/MySQL service is appropriate.

| Requirement | Why it is needed |
|---|---|
| Node.js 20 or newer | Runs the Expo client tooling and Express/tRPC API server. |
| pnpm | Installs and runs the repository dependencies. |
| MySQL 8 or compatible database | Stores users, vehicles, and booking requests. |
| Expo Go, optional | Lets you open the project on an Android or iOS device during development. |

## 2. Clone and install dependencies

```bash
git clone https://github.com/siddique-ansari3/dhule-drive.git
cd dhule-drive
pnpm install
```

## 3. Create the local database and least-privilege user

Log in to your local MySQL server as an administrator, then run the following SQL. Change `change_this_local_password` before running it.

```sql
CREATE DATABASE dhule_drive
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'dhule_drive'@'localhost'
  IDENTIFIED BY 'change_this_local_password';

GRANT ALL PRIVILEGES ON dhule_drive.*
  TO 'dhule_drive'@'localhost';

FLUSH PRIVILEGES;
```

The project needs this account to create and migrate its own tables during local development. For a shared or production database, replace `ALL PRIVILEGES` with the minimal permissions your deployment process requires and use a unique, strong password.

## 4. Create the local environment file

Create a file named `.env` in the repository root. Copy the following template into it, then replace the placeholder database password and session secret.

```dotenv
# Required for the API server and Drizzle migrations.
DATABASE_URL=mysql://dhule_drive:change_this_local_password@127.0.0.1:3306/dhule_drive

# Local API address. This is public client configuration, not a secret.
PORT=3000
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000

# Long, random local-only value used to sign owner-session cookies.
JWT_SECRET=replace_with_a_long_random_local_secret

# Optional: needed only to use the protected owner sign-in flow locally.
VITE_APP_ID=
VITE_OAUTH_PORTAL_URL=
OAUTH_SERVER_URL=
OWNER_OPEN_ID=
OWNER_NAME=
```

If the password contains characters such as `@`, `:`, `/`, `?`, `#`, or `%`, URL-encode it before placing it in `DATABASE_URL`. For example, `Car@2026!` becomes `Car%402026!`.

The `EXPO_PUBLIC_API_BASE_URL` value is required for local web development because Expo runs on a different port from the API server. Keep it as `http://localhost:3000` when testing in a desktop browser on the same machine.

## 5. Apply the database migrations

The repository already contains its database migrations under `drizzle/`. Run the migration command from the project root after `.env` is in place:

```bash
pnpm exec drizzle-kit migrate
```

This creates the application tables, including `users`, `vehicles`, and `bookingRequests`. The starter fleet is inserted automatically the first time the catalogue is requested and the fleet table is empty.

If you later edit `drizzle/schema.ts`, create and apply a new migration:

```bash
pnpm exec drizzle-kit generate
pnpm exec drizzle-kit migrate
```

The repository also provides a convenience command that generates and applies migrations together:

```bash
pnpm db:push
```

Use the explicit `generate` and `migrate` commands when you want to inspect the generated SQL before applying it.

## 6. Run the project

```bash
pnpm dev
```

This starts the API server on port `3000` by default and the Expo web bundler on port `8081` by default. Open the Expo web address shown in the terminal. The API health endpoint is available at:

```text
http://localhost:3000/api/health
```

Run the project checks in a separate terminal when needed:

```bash
pnpm check
pnpm test
```

## Testing on a Physical Phone

`localhost` on a phone refers to the phone itself, not your development computer. Before opening the app in Expo Go, change the public API address in `.env` to your computer’s private-LAN address, for example:

```dotenv
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.25:3000
```

Ensure the phone and computer use the same Wi-Fi network, allow port `3000` through the computer’s firewall, and restart `pnpm dev` after editing `.env` so Expo receives the updated public variable.

## Owner Console Authentication

The public customer catalogue and booking flow can be developed with only `DATABASE_URL`, `JWT_SECRET`, and `EXPO_PUBLIC_API_BASE_URL` configured. However, the `/admin` owner dashboard uses the project OAuth service and needs these additional values:

| Variable | Purpose |
|---|---|
| `VITE_APP_ID` | Identifies the OAuth application. |
| `VITE_OAUTH_PORTAL_URL` | Base address for the sign-in portal used by the client. |
| `OAUTH_SERVER_URL` | Backend OAuth service used to exchange a sign-in code and retrieve user identity. |
| `OWNER_OPEN_ID` | OAuth identity that is assigned the `admin` role. |
| `OWNER_NAME` | Optional owner display name sent to the client. |

These values depend on the OAuth provider/account configuration and must be obtained from the environment where that provider is registered. Do not substitute a production OAuth secret into a local file shared with others. If they are left blank, the customer application can still be developed, but owner sign-in will not work locally.

## Troubleshooting

| Symptom | Likely cause | Resolution |
|---|---|---|
| `DATABASE_URL is required` | `.env` is missing or the variable is blank. | Copy `.env.example` to `.env`, set `DATABASE_URL`, then retry. |
| Database connection failure | Incorrect password, user host, port, or URL encoding. | Confirm the MySQL user can log in and check the connection string. |
| Catalogue is empty | Migrations were not applied or the API cannot reach MySQL. | Run `pnpm exec drizzle-kit migrate`, then check the API terminal output. |
| Web app cannot load cars | `EXPO_PUBLIC_API_BASE_URL` is missing or wrong. | Set it to `http://localhost:3000` and restart the development process. |
| Phone cannot load cars | The app uses `localhost` instead of the computer’s LAN IP. | Use the computer’s Wi-Fi IP address and open firewall port `3000`. |
| Owner sign-in fails | OAuth variables are not configured for local use. | Configure the optional OAuth variables with values from the registered provider. |

## Included Files

| File | Purpose |
|---|---|
| Inline `.env` template above | Safe copy-and-edit configuration containing placeholders only. |
| `drizzle.config.ts` | Reads `DATABASE_URL` and points Drizzle to the MySQL schema and migration directory. |
| `drizzle/` | Existing SQL migration files and migration metadata. |
| `server/db.ts` | Shared database access and starter-fleet seed logic. |
| `LOCAL_SETUP.md` | This local environment and database setup guide. |
