import mongoose from "mongoose";
import { ROLES, STATUS } from "../../../utility/DB_Constant";
import userDB from "./user.schema";
import { ICycle, IFilter, IUser } from "./user.types";

const register = (user: IUser) => userDB.create(user);

const login = (email: string, password: string) => userDB.findOne({ email: email, password: password, isBlocked: false });

const createCycle = (cycle: ICycle) => userDB.updateOne({ _id: cycle.userId },
    {
        $push: { cycle: cycle }
    });

const getUsers = () => userDB.find({ role: ROLES.USER }).populate('cycle.activity.activityId').populate('cycle.activity.status').populate('cycle.status').exec();

const getUserById = (id: string) => userDB.findOne({ _id: id }).populate('cycle.activity.activityId').
    populate('cycle.activity.status').
    populate('cycle.activity.activityId.category').
    exec();

const forgotPassword = (email: string) => userDB.findOne({ email: email });

const findByToken = (token: string) => userDB.findOne({ resetToken: token });

const uploadFile = (fileURL: string, activityId: string, userId: string) => userDB.updateOne(
    {
        _id: userId,
        'cycle.activity._id': activityId
    },
    {
        $set: {
            'cycle.$[].activity.$[j].certificate': fileURL,
            'cycle.$[].activity.$[j].certificateDate': new Date(),
            'cycle.$[].activity.$[j].status': STATUS.COMPLETED,
            'cycle.$[].activity.$[j].uploadedDate': new Date().getFullYear()
        }
    },
    {
        arrayFilters: [
            {
                "j._id": activityId
            }
        ]
    }
);

const filter = (data: IFilter) => {
    const { email, year = data.year || new Date().getFullYear(), page, itemsPerPage } = data;
    // console.log(year);
    let filters: any[] = [];
    let filteredQuery: any[] = [];
    // console.log(year);

    if (email) {
        filteredQuery.push({ email: email });
    }

    // 2024
    if (year) {
        filteredQuery.push({
            $and: [
                { 'cycle.startDate': { $lte: +year } },
                { 'cycle.endDate': { $gte: +year } }]
        });
        filteredQuery.push({ 'cycle.endDate': { $lte: +year } });
    }

    const match = {
        $match: {
            $or: filteredQuery
        }
    }


    if (filteredQuery.length) {
        filters.push(match);
    }
    if (page && itemsPerPage) {
        filters.push({ $skip: (+page - 1) * +itemsPerPage });
        filters.push({ $limit: +itemsPerPage });
    }

    return userDB.aggregate([
        {
            $match: {
                role: new mongoose.Types.ObjectId(ROLES.USER)
            }
        },
        {
            $project: {
                name: 1,
                email: 1,
                cycle: 1,
                isBlocked: 1
            }
        },
        ...filters
        // {
        //     $lookup: {
        //         from: 'Status',
        //         localField: 'name',
        //         foreignField: '_id',
        //         as: 'name'
        //     }
        // }
    ]);
}

const changeStatus = async (id: string, status: boolean) => userDB.findByIdAndUpdate(id, { isBlocked: status })

export default {
    register,
    login,
    forgotPassword,
    getUserById,
    findByToken,
    createCycle,
    getUsers,
    uploadFile,
    filter,
    changeStatus
}