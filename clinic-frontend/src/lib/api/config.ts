/** Express origin shared by API requests and uploaded image URLs.
 * NEXT_PUBLIC_API_URL should contain the origin only (without /api).
 */
export const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000"
).replace(/\/+$/, "");
