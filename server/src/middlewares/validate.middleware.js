import { HTTP_STATUS } from "../constants/statusCode.constants.js"


export const validate = (schema) => (req, res, next) => {
  try {
    // Validate request against the schema
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    
    // If validation passes, proceed to the next middleware/controller
    next()

  } catch (error) {
    // If validation fails, extract and format error messages
    const errors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }))

    // Send validation error response
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors,
    })
  }
}

