import { HTTP_STATUS } from "../constants/statusCode.constants.js";

export const validate = (schema) => (req, res, next) => {
    try {
        if (!schema) return next();

        const reqBody = req.body ?? {};
        const reqQuery = req.query ?? {};
        const reqParams = req.params ?? {};

        // Check if schema expects { body, query, params }
        const hasShape = schema.shape && (schema.shape.body || schema.shape.query || schema.shape.params);

        if (hasShape) {
            const dataToValidate = {};
            if (schema.shape.body) dataToValidate.body = reqBody;
            if (schema.shape.query) dataToValidate.query = reqQuery;
            if (schema.shape.params) dataToValidate.params = reqParams;

            const parsed = schema.parse(dataToValidate);

            if (parsed.body !== undefined) {
                req.body = parsed.body;
            }
            if (parsed.params !== undefined) {
                try {
                    req.params = parsed.params;
                } catch {
                    Object.assign(req.params, parsed.params);
                }
            }
            if (parsed.query !== undefined) {
                try {
                    Object.defineProperty(req, "query", {
                        value: parsed.query,
                        writable: true,
                        configurable: true,
                        enumerable: true,
                    });
                } catch {
                    if (typeof req.query === "object" && req.query !== null) {
                        Object.assign(req.query, parsed.query);
                    }
                }
            }
        } else if (typeof schema.parse === "function") {
            // Direct schema for req.body
            const parsed = schema.parse(reqBody);
            if (parsed !== undefined) req.body = parsed;
        }

        // Proceed to next middleware
        next();
    } catch (error) {
        const errors = error.errors?.map((err) => ({
            path: err.path.join("."),
            message: err.message,
            er: err,
        })) || [{ message: error.message || "Validation failed" }];

        console.error("Validation error:", errors);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: errors[0]?.message || "Validation failed",
            errors,
        });
    }
};
