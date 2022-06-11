import ActivityDB from "../app/modules/activity/activity.schema";
import { CATEGORIES } from "./DB_Constant";

export const verifyActivity = async () => {
    try {
        const result = await ActivityDB.count();
        if (result === 0) {
            const data = [
                // procudural cycle1
                {
                    name: "ACTIVITY1",
                    isOptional: true,
                    cycleNumber: 1,
                    category: CATEGORIES.PROCDURAL
                },
                {
                    name: "ACTIVITY2",
                    isOptional: false,
                    cycleNumber: 1,
                    category: CATEGORIES.PROCDURAL
                },

                {
                    name: "ACTIVITY3",
                    isOptional: false,
                    cycleNumber: 1,
                    category: CATEGORIES.PROCDURAL
                },

                //documental cycle1
                {
                    name: "ACTIVITY4",
                    isOptional: false,
                    cycleNumber: 1,
                    category: CATEGORIES.DOCUMENTAL
                },
                {
                    name: "ACTIVITY5",
                    isOptional: false,
                    cycleNumber: 1,
                    category: CATEGORIES.DOCUMENTAL
                },
                {
                    name: "ACTIVITY6",
                    isOptional: false,
                    cycleNumber: 1,
                    category: CATEGORIES.DOCUMENTAL
                },

                // clinical cycle1
                {
                    name: "ACTIVITY7",
                    isOptional: false,
                    cycleNumber: 1,
                    category: CATEGORIES.CLINICAL
                },
                {
                    name: "ACTIVITY8",
                    isOptional: false,
                    cycleNumber: 1,
                    category: CATEGORIES.CLINICAL
                },
                {
                    name: "ACTIVITY9",
                    isOptional: false,
                    cycleNumber: 1,
                    category: CATEGORIES.CLINICAL
                },


                // procudural cycle2
                {
                    name: "ACTIVITY10",
                    isOptional: false,
                    cycleNumber: 2,
                    category: CATEGORIES.PROCDURAL
                },
                {
                    name: "ACTIVITY11",
                    isOptional: false,
                    cycleNumber: 2,
                    category: CATEGORIES.PROCDURAL
                },
                {
                    name: "ACTIVITY12",
                    isOptional: false,
                    cycleNumber: 2,
                    category: CATEGORIES.PROCDURAL
                },

                //documental cycle2
                {
                    name: "ACTIVITY13",
                    isOptional: false,
                    cycleNumber: 2,
                    category: CATEGORIES.DOCUMENTAL
                },
                {
                    name: "ACTIVITY14",
                    isOptional: false,
                    cycleNumber: 2,
                    category: CATEGORIES.DOCUMENTAL
                },
                {
                    name: "ACTIVITY15",
                    isOptional: false,
                    cycleNumber: 2,
                    category: CATEGORIES.DOCUMENTAL
                },

                // clinical cycle2
                {
                    name: "ACTIVITY16",
                    isOptional: false,
                    cycleNumber: 2,
                    category: CATEGORIES.CLINICAL
                },
                {
                    name: "ACTIVITY17",
                    isOptional: false,
                    cycleNumber: 2,
                    category: CATEGORIES.CLINICAL
                },
                {
                    name: "ACTIVITY18",
                    isOptional: false,
                    cycleNumber: 2,
                    category: CATEGORIES.CLINICAL
                },

                // procedural cycle3
                {
                    name: "ACTIVITY19",
                    isOptional: false,
                    cycleNumber: 3,
                    category: CATEGORIES.PROCDURAL
                },
                {
                    name: "ACTIVITY20",
                    isOptional: false,
                    cycleNumber: 3,
                    category: CATEGORIES.PROCDURAL
                },
                {
                    name: "ACTIVITY21",
                    isOptional: false,
                    cycleNumber: 3,
                    category: CATEGORIES.PROCDURAL
                },

                //documental cycle3
                {
                    name: "ACTIVITY22",
                    isOptional: false,
                    cycleNumber: 3,
                    category: CATEGORIES.DOCUMENTAL
                },
                {
                    name: "ACTIVITY23",
                    isOptional: false,
                    cycleNumber: 3,
                    category: CATEGORIES.DOCUMENTAL
                },
                {
                    name: "ACTIVITY24",
                    isOptional: false,
                    cycleNumber: 3,
                    category: CATEGORIES.DOCUMENTAL
                },

                // clinical cycle3
                {
                    name: "ACTIVITY25",
                    isOptional: false,
                    cycleNumber: 3,
                    category: CATEGORIES.CLINICAL
                },
                {
                    name: "ACTIVITY26",
                    isOptional: false,
                    cycleNumber: 3,
                    category: CATEGORIES.CLINICAL
                },
                {
                    name: "ACTIVITY27",
                    isOptional: true,
                    cycleNumber: 3,
                    category: CATEGORIES.CLINICAL
                }
            ]
            await ActivityDB.insertMany(data);
            console.log("Activities Created");
        }
        else {
            console.log("Activities Already Present")
        }
    }
    catch (e) {
        throw e;
    }
}