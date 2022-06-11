import RoleDB from "../app/modules/role/role.schema";

export const verifyRoles = async () => {
    try {
        const result = await RoleDB.count();
        if (result === 0) {
            const adminRole = {
                name: "ADMIN"
            }
            const userRole = {
                name: "USER"
            }
            await RoleDB.create(adminRole);
            await RoleDB.create(userRole);
            console.log(`created Roles`);
        }
        else {
            console.log(`Roles Already Present`);
        }
    }
    catch (e) {
        throw e;
    }
}