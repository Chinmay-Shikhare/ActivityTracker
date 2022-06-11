import jwt from "jsonwebtoken";
import userRepo from "./user.repo";
import { IActivity, ICycle, IFilter, IPass, IUser } from "./user.types";
import { randomBytes } from "crypto";
import { sendMail } from "../../../utility/sendMail";
import path from "path";
import fs from "fs-extra";
import { ACTIVITY, STATUS } from "../../../utility/DB_Constant";


const { sign } = jwt;

const register = async (user: IUser) => {
    try {
        const userData = await userRepo.register(user);
        if (userData) {
            const _id = userData._id.toString();
            let uploadFolder = path.join("storage", _id);
            fs.ensureDir(uploadFolder);

            // create Cycle
            // var year = userData.joiningDate.getFullYear();
            // var month = userData.joiningDate.getMonth();
            // var day = userData.joiningDate.getDate();
            // var endYear = new Date(year + 2, month, day);

            await createCycle(_id, userData.joiningDate);

            // setTimeout(async () => {
            //     const getUser = await userRepo.getUserById(userData._id);
            //     if (!getUser) return;
            //     getUser.cycle.forEach((cycle) => {
            //         cycle.activity.forEach((activity) => {
            //             if (activity.status?.toString() !== STATUS.COMPLETED) {
            //                 getUser.isBlocked = true
            //             }
            //         })
            //     })
            //     await getUser.save();
            // }, 1000 * 60 * 60 * 24 * 365 * 9); // 9 year   
            // const startDate = new Date();
            // var year = startDate.getFullYear();
            // var month = startDate.getMonth();
            // var day = startDate.getDate();

            // //console.log(new Date(year + 8, month, day));
            // // 10 * * * * * - (10 seconds)
            // const job = schedule.scheduleJob('2 * * * * *', async () => {
            //     const getUser = await userRepo.getUserById(userData._id);
            //     if (!getUser) return "user not found";
            //     getUser.cycle.forEach((cycle) => {
            //         cycle.activity.forEach((activity) => {
            //             if (activity.status?.toString() !== STATUS.COMPLETED) {
            //                 getUser.isBlocked = true
            //             }
            //         })
            //     })
            //     await getUser.save();
            // })
        }
        // 1000 * 60 * 60 - 1 hour
        // 1000 * 60 * 60 * 24 - 1 day
        // 1000 * 60 * 60 * 24 * 365 - 1 year
        // 1000 * 60 * 60 * 24 * 365 * 9 - 9 year

        return userData;
    }
    catch (e) {
        throw e;
    }
}

const login = async (email: string, password: string) => {
    try {
        const user = await userRepo.login(email, password);
        if (user) {
            const { SECRET_KEY } = process.env;
            if (SECRET_KEY) {
                const { _id, name, email, role } = user.toObject();
                const userData = { _id, name, email, role };
                const token = sign(userData, SECRET_KEY, { expiresIn: '20d' });
                return { token, role };
            }
            else {
                throw "secret key not found";
            }
        }
        else {
            throw "User is blocked!";
        }
    }
    catch (e) {
        throw e
    }
}

const forgotPassword = async (email: string) => {
    const user = await userRepo.forgotPassword(email);
    if (user) {
        if (user.resetToken &&
            user.resetTokenExpiry &&
            Date.now() <= user.resetTokenExpiry) {
            throw { statusCode: 400, message: "Email for reset password already been sent" };
        }
        user.resetToken = randomBytes(6).toString('hex');
        user.resetTokenExpiry = Date.now() + (60000 * 3);
        const data = await user.save();
        if (data._id && data.resetToken) {
            await sendMail(data.email, data.resetToken);
            return "Email send";
        }
    } else {
        throw { statusCode: 400, message: "Email not found" };
    }
}

const resetPassword = async (data: IPass) => {
    try {
        if (data.password === data.confirmPassword) {
            const user = await userRepo.findByToken(data.resetToken);
            if (!user || user.resetToken && (data.resetToken !== user.resetToken) || user.resetTokenExpiry && (Date.now() >= user.resetTokenExpiry)) {
                throw { statusCode: 400, message: 'Token invalid for resetting your password' }
            }
            user.password = data.confirmPassword;
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();
        }
        else {
            throw { statusCode: 400, message: "confirm password doesn't match" }
        }
        return "password successfully changed";
    }
    catch (e) {
        throw e;
    }
}

const createCycle = async (userId: string, startDate: Date) => {
    try {
        const user = await getUserById(userId);
        // console.log(user?.cycle);
        if (user?.isBlocked === false) {
            // add validation of user completed all previous tasks 
            const length = user.cycle?.length || 0;
            const endYear = user.cycle?.[length - 1]?.endDate;
            user.cycle.forEach((cycle) => {
                // console.log(cycle);
                cycle.activity.forEach((activity: IActivity) => {
                    if (activity.status?._id.toString() as string !== STATUS.COMPLETED && activity.activityId.isOptional === false) {
                        throw { statusCode: 400, message: "Please Complete Your Pending Activities" }
                    }
                })
            })
            let year;

            if (!endYear) {
                year = startDate.getFullYear();
            }
            else {
                year = endYear + 1
            }

            var month = startDate.getMonth();
            var day = startDate.getDate();
            // var endYear = new Date(year + 2, month, day);
            // 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020
            const cycle1 = {
                userId: userId,
                startDate: year,
                endDate: year + 2,
                status: STATUS.PENDING,
                activity: [
                    {
                        activityId: ACTIVITY.ACTIVITY1
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY2
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY3
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY4
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY5
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY6
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY7
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY8
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY9
                    }
                ]
            }
            const cycle2 = {
                userId: userId,
                startDate: year + 3,
                endDate: year + 5,
                status: STATUS.PENDING,
                activity: [
                    {
                        activityId: ACTIVITY.ACTIVITY10
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY11
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY12
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY13
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY14
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY15
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY16
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY17
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY18
                    }
                ]
            }
            const cycle3 = {
                userId: userId,
                startDate: year + 6,
                endDate: year + 8,
                status: STATUS.PENDING,
                activity: [
                    {
                        activityId: ACTIVITY.ACTIVITY19
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY20
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY21
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY22
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY23
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY24
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY25
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY26
                    },
                    {
                        activityId: ACTIVITY.ACTIVITY27
                    }
                ]
            }
            await userRepo.createCycle(cycle1);
            await userRepo.createCycle(cycle2);
            await userRepo.createCycle(cycle3);
            return true;
        }
        else {
            throw { statusCode: 400, message: "User is Blocked" }
        }
    }
    catch (e) {
        throw e;
    }
}

const getUsers = () => userRepo.getUsers();

const getUserById = (id: string) => userRepo.getUserById(id);

const get3Users = async (id: string) => {
    const userData = await userRepo.getUserById(id);
    if (userData) {
        let length = userData.cycle.length;
        let user = [];
        user.push(userData.cycle[length - 3]);
        user.push(userData.cycle[length - 2]);
        user.push(userData.cycle[length - 1]);
        return user;
    }
}

const uploadCertificate = async (fileData: Express.Multer.File, activityId: string, userId: string) => {
    try {
        let fileURL = fileData.path.split('\\').join('/') || '';
        await userRepo.uploadFile(fileURL, activityId, userId);
        return "file uploaded";
    }
    catch (e) {
        throw e;
    }
};

// const uploadCertificate = async (fileData: Express.Multer.File, cycleId: string, activityId: string, userId: string) => {
//     try {
//         let fileURL = fileData.path.split('\\').join('/') || ''
//         const userData = await userRepo.uploadFile(fileURL, cycleId, activityId, userId);
//         // console.log(userData);
//         userData?.cycle.forEach((cycle) => {
//             cycle.activity.forEach((activity) => {
//                 console.log(activity._id);
//                 console.log(activityId);
//                 if (activity._id?.toString() === activityId) {
//                     activity.certificate = fileURL;
//                     activity.status = STATUS.COMPLETED;
//                     activity.certificateDate = new Date();
//                 }
//             })
//         })
//         await userData?.save();
//         return "file uploaded"
//     }
//     catch (e) {
//         throw e;
//     }
// }


const checkCycle = async (id: string) => {
    try {
        const userData = await userRepo.getUserById(id);
        let counter = 0;
        if (userData) {
            if (userData.isBlocked === false) {
                userData.cycle.forEach((cycle) => {
                    cycle.activity.forEach((activity) => {
                        if (activity.status?._id.toString() as string !== STATUS.COMPLETED && activity.activityId.isOptional === false) {
                            counter++;
                        }
                    })
                })
            } else {
                throw { message: "User is blocked" }
            }
        }
        if (counter >= 1) {
            return false
        }
        return true;
    }
    catch (e) {
        throw e;
    }
}


const filter = async (data: IFilter) => {
    try {
        let users = await userRepo.getUsers();

        let filteredUsers: any = [];

        users.forEach((i_user) => {
            let user = i_user.toObject();

            let cycles = [];
            const createdAt = user.createdAt?.getFullYear() || new Date().getFullYear();
            const noOfCycles = user.cycle.length / 3;
            let isPresent = false;
            for (let i = 0; i < noOfCycles; i++) {
                const startYear = createdAt + (9 * i);
                const endYear = startYear + 8;

                // console.log("Start Year: " + startYear);
                // console.log("End Year: " + endYear);

                // data.year -> 
                if (data.year && data.year >= startYear && data.year <= endYear) {
                    isPresent = true;
                    // get array with 3 cycles
                    const startIndex = i * 3;

                    let cycles = [];
                    cycles.push(user.cycle[startIndex]);
                    cycles.push(user.cycle[startIndex + 1]);
                    cycles.push(user.cycle[startIndex + 2]);

                    user.cycle = cycles;
                }

                if (i === noOfCycles - 1) {
                    if (!isPresent) {
                        const startIndex = i * 3;

                        let cycles = [];
                        cycles.push(user.cycle[startIndex]);
                        cycles.push(user.cycle[startIndex + 1]);
                        cycles.push(user.cycle[startIndex + 2]);

                        user.cycle = cycles;
                    }
                }
            }

            filteredUsers.push(user);

        });

        // console.log(filteredUsers);
        let obj :any = [];

        filteredUsers.forEach((user: any) => {
            let counter = 0;
            // const cycles = user.cycle?.filter((cycle: ICycle) => cycle.startDate <= year && cycle.endDate >= year || cycle.endDate <= year)
            user.cycle?.forEach((cycle: ICycle) => {
                cycle.activity.forEach((activity: IActivity) => {
                    if (data.year && activity?.uploadedDate && activity?.uploadedDate <= data.year && !activity.activityId.isOptional) {
                        console.log(activity?.uploadedDate, data.year);

                        counter++;
                    }
                })
            })
            // console.log(counter);
            // console.log(user.name, counter)
            if (counter >= 25) {
                obj.push({ _id: user._id, name: user.name, status: "COMPLETED", isBlocked: user.isBlocked })
            }
            else {
                obj.push({ _id: user._id, name: user.name, status: "PENDING", isBlocked: user.isBlocked })
            }
        })


        return obj;

        /* const year = data.year ? +data.year as number : new Date().getFullYear();
        const filteredData: any = await userRepo.filter(data);
        let obj: { _id: string; name: any; status: string; isBlocked: boolean; }[] = [];
        filteredData.forEach((filteredData: any) => {
            let counter = 0;
            // const cycles = filteredData.cycle?.filter((cycle: ICycle) => cycle.startDate <= year && cycle.endDate >= year || cycle.endDate <= year)
            filteredData.cycle?.forEach((cycle: ICycle) => {
                cycle.activity.forEach((activity: IActivity) => {
                    if (year && activity?.uploadedDate && activity?.uploadedDate <= year && !activity.activityId.isOptional) {
                        console.log(activity?.uploadedDate, year);

                        counter++;
                    }
                })
            })
            // console.log(counter);
            console.log(filteredData.name, counter)
            if (counter % 25 === 0 && counter != 0) {
                obj.push({ _id: filteredData._id, name: filteredData.name, status: "COMPLETED", isBlocked: filteredData.isBlocked })
            }
            else {
                obj.push({ _id: filteredData._id, name: filteredData.name, status: "PENDING", isBlocked: filteredData.isBlocked })
            }
        })
        return obj; */
    }
    catch (e) {
        throw e;
    }
}



const changeStatus = async (id: string) => {
    try {
        const userData = await userRepo.getUserById(id);

        if (userData) {
            if (userData.isBlocked === true) {
                userData.isBlocked = false
                userData.save();
                return "Status Updated";
            }
            userData.isBlocked = true
            userData.save();
            return "Status Updated";
        }
    }
    catch (e) {
        throw e;
    }
}


export default {
    register,
    login,
    forgotPassword,
    resetPassword,
    createCycle,
    getUsers,
    getUserById,
    uploadCertificate,
    filter,
    changeStatus,
    get3Users,
    checkCycle
}