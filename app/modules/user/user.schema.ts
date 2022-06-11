import { Schema, model, Document } from "mongoose";
import { ROLES, STATUS } from "../../../utility/DB_Constant";
import { IUser } from "./user.types";

class userSchema extends Schema {
    constructor() {
        super({
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            role: {
                type: Schema.Types.ObjectId,
                ref: 'Role',
                required: false,
                default: ROLES.USER
            },
            joiningDate: {
                type: Date,
                required: false,
                default: new Date()
            },
            cycle: [
                {
                    startDate: {
                        type: Number,
                        required: false
                    },
                    endDate: {
                        type: Number,
                        required: false
                    },
                    status: {
                        type: Schema.Types.ObjectId,
                        ref: 'Status',
                        required: false,
                        default: STATUS.PENDING
                    },
                    activity: [
                        {
                            activityId: {
                                type: Schema.Types.ObjectId,
                                ref: 'Activity',
                                required: false
                            },
                            status: {
                                type: Schema.Types.ObjectId,
                                ref: 'Status',
                                required: false,
                                default: STATUS.PENDING
                            },
                            certificate: {
                                type: String,
                                required: false
                            },
                            certificateDate: {
                                type: Date,
                                required: false
                            },
                            uploadedDate: {
                                type: Number,
                                required: false,
                                default: null
                            }
                        }
                    ]
                }
            ],
            isBlocked: {
                type: Boolean,
                default: false
            },
            resetToken: {
                type: String,
                required: false
            },
            resetTokenExpiry: {
                type: Number,
                required: false
            },
        }, { timestamps: true })
    }
};

type userDocument = Document & IUser;
const userDB = model<userDocument>('User', new userSchema());
export default userDB;