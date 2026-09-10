import { validationResult } from "express-validator";
import  ApiError  from "../utils/ApiError.js";

export function validate(req, res, next) {
    const errors = validationResult(req);

        console.log("Validation errors:", errors.array());

       if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
            value: err.value,
        }));

        throw new ApiError(
            400,
            "Validation failed",
            formattedErrors
        );
    }
    next();
}
