
import { UserService } from "../services/user.service.js";
import { sendCookie } from "../utils/sendCookie.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { RESPONSE_MESSAGES } from "../constants/responseMessages.js";
import { sendResponse } from "../utils/response.handler.js";

export const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    sendCookie(user, res, "User created successfully", HTTP_STATUS.OK);
  } catch (error) {
    console.error(error);
    sendResponse(res, { 
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR, 
      success: false, 
      message: RESPONSE_MESSAGES.INTERNAL_ERROR, 
      error 
    });
  }
};

export const sendOtpForVerifyAccount = async (req, res) => {
  try {
    await UserService.sendOtpForVerification(req.body.email);
    sendResponse(res, { status: HTTP_STATUS.OK, success: true, message: "OTP sent successfully." });
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.BAD_REQUEST, success: false, message: error.message });
  }
};

export const VerifyOtpWithExpiry = async (req, res) => {
  try {
    const user = await UserService.verifyOtp(req.body.otp);
    sendCookie(user, res, "OTP verified successfully!", HTTP_STATUS.OK);
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.BAD_REQUEST, success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await UserService.getUserById(id);
    sendResponse(res, { status: HTTP_STATUS.OK, success: true, message: "User fetched successfully.", data: user });
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, success: false, message: error.message , error });
  }
};

export const getAllUsersWithPost = async (req, res) => {
  try {
    const usersWithPosts = await UserService.getAllUsersWithPosts();
    sendResponse(res, { status: HTTP_STATUS.OK, success: true, message: "All users fetched", data: usersWithPosts });
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, success: false, message: RESPONSE_MESSAGES.INTERNAL_ERROR, error });
  }
};

export const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.loginUser(email, password);
    if (result.requiresTwoStep) {
      return sendResponse(res, { status: HTTP_STATUS.OK, success: true, message: "Verification code sent to your email" });
    }
    sendCookie(result, res, "User login successful", HTTP_STATUS.OK);
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.BAD_REQUEST, success: false, message: error.message });
  }
};

export const logOutUser = (req, res) => {
  try {
    res.status(HTTP_STATUS.OK).cookie("token", "", { expires: new Date(), httpOnly: true });
    sendResponse(res, { status: HTTP_STATUS.OK, success: true, message: "Logout successful" });
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, success: false, message: RESPONSE_MESSAGES.INTERNAL_ERROR, error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);
    res.cookie("token", "", { expires: new Date(), httpOnly: true });
    sendResponse(res, { status: HTTP_STATUS.OK, success: true, message: "User deleted successfully." });
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, success: false, message: "Failed to delete user.", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.updateUser(id, req.body);
    sendResponse(res, { status: HTTP_STATUS.OK, success: true, message: "User updated successfully.", data: user });
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, success: false, message: "Failed to update user.", error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await UserService.forgotPassword(email);
    sendResponse(res, { status: HTTP_STATUS.OK, success: true, message: "OTP sent successfully." });
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.BAD_REQUEST, success: false, message: error.message });
  }
};

export const changePassWithOtp = async (req, res) => {
  try {
    const { otp, password } = req.body;
    await UserService.resetPasswordWithOtp(otp, password);
    sendResponse(res, { status: HTTP_STATUS.OK, success: true, message: "Password reset successful." });
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.BAD_REQUEST, success: false, message: error.message });
  }
};

export const ChangePasswordWithOldPassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    const user = await UserService.changePasswordWithOldPassword(id, oldPassword, newPassword);
    sendCookie(user, res, "Password changed successfully", HTTP_STATUS.OK);
  } catch (error) {
    sendResponse(res, { status: HTTP_STATUS.BAD_REQUEST, success: false, message: error.message });
  } 
};


export const getAllUser =  async(req , res) => {
  try {
    const { id } = req.user 
    const users = await UserService.getAllUser(id)
    sendResponse(res , {status: HTTP_STATUS.OK , success:true , message: RESPONSE_MESSAGES.GET_ALL_USER_SUCSESS , data:users })
  } catch (error) {
    sendResponse(res , {status: HTTP_STATUS.BAD_REQUEST , success:false , message: RESPONSE_MESSAGES.GET_ALL_USER_FAILD , error : error})
    
  }
  
}

// friend req manager 


export const sendFriendRequest = async(req , res ) =>{
   try {
    console.log("this is friend request API");
    
      const { id } = req.user 
      
      const data =  await UserService.sendFriendRequest(id , req.body )
      sendResponse(res , { status: HTTP_STATUS.OK , data:data , success:true , message: RESPONSE_MESSAGES.SEND_FRIND_REQUST_SUCCESS})
    } catch (error) {
      console.error("error in send friend req==>" , error);
      
     sendResponse(res , { status: HTTP_STATUS.BAD_REQUEST , success:false , message: error.message || RESPONSE_MESSAGES.SEND_FRIND_REQUST_FAILD})
    
   }
}

export const manageFriendRequest = async(req , res ) =>{
   try {
      const { id } = req.user 
      
      const data =  await UserService.manageFriendRequest(id , req.body )
      sendResponse(res , { status: HTTP_STATUS.OK , success:true , data:data , message: `friend request ${req.body.action}` })
    } catch (error) {
      console.error("error in send friend req==>" , error);
      
     sendResponse(res , { status: HTTP_STATUS.BAD_REQUEST , success:false , message: error.message || RESPONSE_MESSAGES.INTERNAL_ERROR })
    
   }
}

