import { createClient } from "@libsql/client";

export function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("Turso database credentials are missing.");
  }

  return createClient({
    url,
    authToken,
  });
}
