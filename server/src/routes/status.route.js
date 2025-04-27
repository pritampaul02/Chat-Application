import express from "express";
import { isAuthenticate } from "../middlewares/authentication.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import statusValidation from "../validations/status.validation.js";
import statusController from "../controller/status.controller.js";

const router = express.Router();
//create a stuts
router.post(
    "/",
    isAuthenticate,
    validate(statusValidation.createStatus),
    statusController.createStatus
);
router.get("/", isAuthenticate, statusController.getStatuses);
// Like a status
router.post("/like/:statusId", isAuthenticate, statusController.likeStatus);

// View a status
router.get("/view/:statusId", isAuthenticate, statusController.viewStatus);
// Delete a status
router.delete(
    "/delete/:statusId",
    isAuthenticate,
    statusController.deleteStatus
);

export const statusRoute = router;
