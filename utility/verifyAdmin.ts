import { generate } from "generate-password";
import userDB from "../app/modules/user/user.schema"
import { ROLES } from "./DB_Constant";

export const verifyAdmin = async () => {
    try {
        const result = await userDB.findOne({ role: ROLES.ADMIN });
        if (!result) {
            const userData = {
                password: generate(),
                role: ROLES.ADMIN,
                name: 'chinmay',
                email: 'chinmay.shikhare73@gmail.com'
            }
            await userDB.create(userData);
            console.log(`created First Admin ${userData.name}.`);
        }
        else {
            console.log(`Admin Already Present`);
        }
    }
    catch (e) {
        throw e
    }
};