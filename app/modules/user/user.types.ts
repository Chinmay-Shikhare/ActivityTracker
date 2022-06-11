import { IUserActivity } from "../activity/activity.types"
import { IStatus } from "../status/status.types"

export interface IActivity {
    _id?: string,
    activityId: any | IUserActivity,
    status?: any | IStatus,
    certificate?: string,
    certificateDate?: Date,
    uploadedDate?: number
}

export interface ICycle {
    _id?: string,
    userId: string,
    startDate: number,
    endDate: number,
    status: string,
    activity: IActivity[]
}

export interface IUser {
    _id?: string,
    name: string,
    email: string,
    password: string,
    role: string,
    joiningDate: Date,
    cycle: ICycle[],
    isBlocked: boolean,
    resetToken?: string | null,
    resetTokenExpiry?: number | null,
    createdAt?: Date
}

export interface IPass {
    _id?: string,
    resetToken: string,
    password: string,
    confirmPassword: string
}


export interface IFilter {
    email?: string,
    year?: number | null ,
    page?: number,
    itemsPerPage?: number
}