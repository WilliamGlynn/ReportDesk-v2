import roles  from '../config/roles.json'assert { type: 'json' }
export class Permissions {
    constructor() {
      this.permissions = [];
    }
  
  getPermissionsByRoleName(roleName) {
    console.log(roleName)
    console.log(roles)
      const role = roles.roles.find((r) => r.name === roleName);
      return role ? role.permissions : [];
    }
  }