import { Schema, model, Document } from "mongoose";
import { IUserActivity } from "./activity.types";

class ActivitySchema extends Schema {
    constructor() {
        super({
            name: {
                type: String,
                required: true
            },
            isOptional: {
                type: Boolean,
                default: false
            },
            cycleNumber: {
                type: Number,
                required: true
            },
            category: {
                type: Schema.Types.ObjectId,
                ref: 'Category',
                required: true
            }
        }, { timestamps: true })
    }
}

type activityDocument = Document & IUserActivity;
const ActivityDB = model<activityDocument>("Activity", new ActivitySchema());
export default ActivityDB;