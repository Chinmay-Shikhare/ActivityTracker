import { Schema, model, Document } from "mongoose";
import { ICategory } from "./category.types";

class CategorySchema extends Schema {
    constructor() {
        super({
            name: {
                type: String,
                required: true
            }
        }, { timestamps: true })
    }
}

type categoryDocument = ICategory & Document;
const CategoryDB = model<categoryDocument>("Category", new CategorySchema());
export default CategoryDB;