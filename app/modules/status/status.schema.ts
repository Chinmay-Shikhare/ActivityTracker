import { Schema, model, Document } from "mongoose";
import { IStatus } from "./status.types";

class StatusSchema extends Schema {
    constructor() {
        super({
            name: {
                type: String,
                required: true
            }
        }, { timestamps: true })
    }
}


type StatusDocument = IStatus & Document;
const StatusDB = model<StatusDocument>("Status", new StatusSchema());
export default StatusDB;