import StatusDB from "../app/modules/status/status.schema";


export const verifyStatus = async () => {
    try {
        const result = await StatusDB.count();
        if (result === 0) {
            const pending = {
                name: "PENDING"
            }
            const completed = {
                name: "COMPLETED"
            }
            const locked = {
                name: "LOCKED"
            }
            await StatusDB.create(pending);
            await StatusDB.create(completed);
            await StatusDB.create(locked);
            console.log("Status Created");
        }
        else {
            console.log("Status Already Present");
        }
    }
    catch (e) {
        throw e;
    }
}