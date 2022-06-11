import { IAuth, Route } from "./routes.types";
import userRouter from "../modules/user/user.routes";
import roleRouter from "../modules/role/role.routes";

export const routes: Route[] = [
    new Route("/user", userRouter),
    new Route("/role", roleRouter)
]

export const excludedPaths: IAuth[] = [
    { method: "POST", path: "/user/login" },
    { method: "POST", path: "/user/register" },
    { method: "POST", path: "/user/forgot-password" },
    { method: "POST", path: "/user/reset-password" }
]