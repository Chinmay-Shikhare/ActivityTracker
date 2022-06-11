import { body } from "express-validator";
import { validate } from "../../../utility/validations";

export const LoginUserValidator = [
    body('email').isEmail().withMessage("Email is Required"),
    body('password').isString().withMessage("Password is required"),
    validate
]

export const RegisterUserValidator = [
    body('name').matches(/^[A-Za-z\s]+$/).withMessage("name is required / must be alphabetic"),
    body('email').isEmail().withMessage("Email is Required"),
    body('password').isString().withMessage("Password is required"),
    validate
]

export const fogotPasswordValidator = [
    body('email').isEmail().withMessage("Email is Required"),
    validate
]