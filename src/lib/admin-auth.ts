import { cookies } from "next/headers";

export const ADMIN_COOKIE = "harlen_admin_token";

// Shared check used by the admin API route handlers. The proxy guards page
// navigations, but every data route re-verifies independently (defense in
// depth — never trust the proxy alone for data access).
export async function isAdminAuthed(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const secret = process.env.ADMIN_SECRET_TOKEN;
  return Boolean(token && secret && token === secret);
}
