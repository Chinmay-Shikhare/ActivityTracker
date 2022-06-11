import CategoryDB from "../app/modules/category/category.schema";


export const verifyCategory = async () => {
    try {
        const result = await CategoryDB.count();
        if (result === 0) {
            const procedural = {
                name: "PROCDURAL"
            }
            const documental = {
                name: "DOCUMENTAL"
            }
            const clinical = {
                name: "CLINICAL"
            }
            await CategoryDB.create(procedural);
            await CategoryDB.create(documental);
            await CategoryDB.create(clinical);
            console.log("Catergories Created")
        }
        else {
            console.log("Catergories Already Present")
        }
    }
    catch (e) {
        throw e;
    }
}
