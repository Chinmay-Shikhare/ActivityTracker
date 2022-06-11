import { Application, json, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { authorize } from "../../utility/authorize";
import { ResponseHandler } from "../../utility/response";
import { excludedPaths, routes } from "./routes.data";
import cors  from "cors";

export const registerRoutes = async (app: Application) => {
    try {
        app.use(cors());
        app.use(json());
        app.use(helmet());

        app.use(authorize(excludedPaths));

        for (let route of routes) {
            app.use(route.path, route.route);
        }

        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.log(err);
            res.status(err.statusCode || 500).send(new ResponseHandler(null,err));
        });
    }
    catch (e) {
        throw { message: "Unable to register Routes" }
    }
}