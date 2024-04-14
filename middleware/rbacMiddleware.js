import { Role } from "../models/role.js"
import {Permissions} from '../models/permissions.js';

// Check if the user has the required permission for a route
export function checkPermission(permission) {
  return (req, res, next) => {
    const userRole = req.user.userRoleID;
    console.log(userRole);
    console.log(permission);
    const userPermissions = new Permissions().getPermissionsByRoleName(userRole);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
}