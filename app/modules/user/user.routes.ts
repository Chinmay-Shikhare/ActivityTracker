import { NextFunction, Router, Request, Response } from "express";
import { ROLES } from "../../../utility/DB_Constant";
import { multerMiddleware } from "../../../utility/fileStorage";
import { permit } from "../../../utility/permit";
import { ResponseHandler } from "../../../utility/response";
import userServices from "./user.services";
import { IFilter } from "./user.types";
import { fogotPasswordValidator, LoginUserValidator, RegisterUserValidator } from "./user.validations";

const router = Router();

// login 
router.post("/login",
    LoginUserValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await userServices.login(email, password);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// register 
router.post("/register",
    RegisterUserValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userServices.register(req.body);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// display all users
router.get("/display",
    permit([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userServices.getUsers();
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// get user data by id
router.get("/display-by-id",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const result = await userServices.getUserById(_id);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

router.get("/display-cycle",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const result = await userServices.get3Users(_id);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    })

// upload certificate
router.post("/upload-certificate",
    permit([ROLES.USER]),
    multerMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) return res.status(400).send({ error: "File not Found" });
            const _id = res.locals['userData']._id;
            const result = await userServices.uploadCertificate(req.file as Express.Multer.File, req.body.activityId, _id);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// create cycle
router.post("/create-cycle",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = res.locals['userData']._id.toString();
            const date = new Date();
            const result = await userServices.createCycle(_id, date);
            res.send(new ResponseHandler(result))
        }
        catch (e) {
            // console.log(`error - ${e}`);

            next(e);
        }
    });

// forgot password
router.post("/forgot-password",
    fogotPasswordValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userServices.forgotPassword(req.body.email);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// reset password
router.post("/reset-password",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userServices.resetPassword(req.body);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });


// ADMIN URL
// filter data
router.get("/filter",
    permit([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: IFilter = req.query;
            const result = await userServices.filter(data);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

// block / unblock user
router.put("/change-status",
    permit([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userServices.changeStatus(req.body.id);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    });

router.get("/check-cycle",
    permit([ROLES.USER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = res.locals['userData']._id.toString();
            console.log(id);
            const result = await userServices.checkCycle(id);
            console.log(result);
            res.send(new ResponseHandler(result));
        }
        catch (e) {
            next(e);
        }
    })

export default router;