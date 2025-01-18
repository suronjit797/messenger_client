const userRole = {
  user: "user",
  admin: "admin",
  superAdmin: "superAdmin",
};
export const authAccess = (...roles) => (roles.length > 0 ? [userRole.superAdmin, ...roles] : Object.keys(userRole));
export default userRole;
