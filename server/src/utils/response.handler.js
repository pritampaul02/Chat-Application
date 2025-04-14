/**
 * Utility function to send consistent API responses
 */
export const sendResponse = (res, { status, success, message, data = null, error = null }) => {
    const response = {
        success,
        message,
    }

    if (data !== null ) {
        response.data = data
    }

    if (error !== null) {
        response.error = error
    }

    return res.status(status).json(response)
}
