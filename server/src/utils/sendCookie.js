// import jwt from "jsonwebtoken";

// export const sendCookic = (user, res, message, statusCode = 200) => {

//   const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });

//   return res
//     .status(statusCode)
//     .json({
//       success: true,
//       message,
//       token: token,
//       user
//     });
// };

// // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// // res.cookie('jwt', token, {
// //   httpOnly: true, // Prevent JavaScript access for security
// //   secure: process.env.NODE_ENV === 'production', // Set to true in production
// //   sameSite: 'lax', // Mitigate CSRF attacks
// //   path: '/', // Accessible from all paths
// //   expires: new Date(Date.now() + 3600000), // Set expiration time
// // });

import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    // Set cookie options
    const cookieOptions = {
        httpOnly: true, // Prevent JavaScript access for security
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "lax", // Mitigate CSRF attacks
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expire in 30 days
        path: "/", // Accessible from all paths
    };

    // Set the cookie and send the response
    return res
        .status(statusCode)
        .cookie("token", token, cookieOptions) // Set the JWT in a cookie
        .json({
            success: true,
            message,
            data: user,
            token,
        });
};
