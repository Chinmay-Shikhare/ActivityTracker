import schedule from "node-schedule";
import userRepo from "../app/modules/user/user.repo";
import { STATUS } from "./DB_Constant";

const rule = new schedule.RecurrenceRule();
rule.year = 1;// run after 1 year 

export const jobScheduler = async () => {
    
    try {
        const users = await userRepo.getUsers();
        if (users) {
            const job = schedule.scheduleJob(rule, async () => {
                for (let user of users) {
                    const date = user.joiningDate;
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();
                    var endYear = new Date(year + 8, month, day);
                    if (user.joiningDate >= endYear) {
                        user.cycle.forEach((cycle) => {
                            cycle.activity.forEach((activity) => {
                                if (activity.status?.toString() !== STATUS.COMPLETED) {
                                    user.isBlocked = true
                                }
                            })
                        })
                        await user.save();
                    }
                }
            })
        }
        else {
            throw "User not found";
        }
    }
    catch (e) {
        throw e;
    }
}

