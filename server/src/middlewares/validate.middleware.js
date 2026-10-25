import { HTTP_STATUS } from "../constants/statusCode.constants.js";

export const validate = (schema) => (req, res, next) => {
    try {
        req.body = req.body || {};

        // Validate request against the schema
        const parsed = schema.parse({
            body: req.body,
            query: req.query || {},
            params: req.params || {},
        });

        if (parsed.body !== undefined) req.body = parsed.body;
        if (parsed.params !== undefined) req.params = parsed.params;
        // In Express 5, req.query is a getter-only property. Mutate it via Object.assign if needed.
        if (parsed.query && typeof req.query === "object") {
            Object.assign(req.query, parsed.query);
        }

        // If validation passes, proceed to the next middleware/controller
        next();
    } catch (error) {
        // If validation fails, extract and format error messages
        const errors = error.errors?.map((err) => ({
            path: err.path.join("."),
            message: err.message,
            er: err,
        })) || [{ message: error.message }];

        console.error("Validation error:", errors);
        // Send validation error response
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }
};
