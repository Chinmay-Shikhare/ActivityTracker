import express from "express";
import { jobScheduler } from "../utility/jobScheduler";
import { verifyActivity } from "../utility/verifyActivity";
import { verifyAdmin } from "../utility/verifyAdmin";
import { verifyCategory } from "../utility/verifyCategory";
import { verifyRoles } from "../utility/verifyRoles";
import { verifyStatus } from "../utility/verifyStatus";
import { connectToMongo } from "./connections/mongo.connections";
import { registerRoutes } from "./routes";

export const startServer = async () => {
    try {
        const app = express();

        await connectToMongo();

        await verifyRoles();
        await verifyStatus();
        await verifyCategory();
        await verifyActivity();
        await verifyAdmin();
        await jobScheduler();

        registerRoutes(app);

        const { PORT } = process.env;
        app.listen(PORT, () => {
            console.log(`listening on PORT ${PORT}`);
        });
    }
    catch (e) {
        throw (e);
    }
}
