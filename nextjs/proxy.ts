export default async function proxy(req: Request) {
  const { pathname } = new URL(req.url);

  // Redirect root "/" → "/dashboard"
  if (pathname === "/") {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // Do nothing = continue to next route
  // 👇 Just return undefined or nothing
}
