/**
 * Role-to-Dashboard route resolver and permission checks
 */
export const ROLE_DASHBOARDS = {
  citizen: "/dashboard",
  manager: "/department-dashboard",
  staff: "/my-tasks",
  admin: "/admin-dashboard",
};

/**
 * Returns the target dashboard URL for a user's role
 * Defaults to '/dashboard' for citizen
 */
export function getDashboardPath(role) {
  if (!role) return "/dashboard";
  return ROLE_DASHBOARDS[role.toLowerCase()] || "/dashboard";
}

/**
 * Role permissions mapping by route prefix
 */
export const ROLE_PERMISSIONS = {
  "/admin-dashboard": ["admin"],
  "/department-dashboard": ["manager", "admin"],
  "/my-tasks": ["staff", "admin"],
  "/dashboard": ["citizen", "manager", "staff", "admin"],
  "/issues/new": ["citizen", "manager", "staff", "admin"],
  "/profile": ["citizen", "manager", "staff", "admin"],
};

/**
 * Check whether a user role is permitted to access a path
 */
export function isRouteAllowed(pathname, role) {
  const normalizedRole = (role || "citizen").toLowerCase();

  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
    if (pathname === routePrefix || pathname.startsWith(`${routePrefix}/`)) {
      return allowedRoles.includes(normalizedRole);
    }
  }

  return true;
}
