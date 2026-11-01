const express = require("express");
const { 
    sendVerificationCodeController, 
    verifyUserController, 
    loginUserController,
    completeRegistrationController,
    forgotPasswordController,
    resetPasswordController,
    checkUsernameController,
    checkEmailController,
    registerUserController
} = require("../controllers/loginController");

const router = express.Router();

// Route for sending the verification code to the email
router.post("/send-verification-code", sendVerificationCodeController);

// Route for verifying the user's email with the verification code
router.post("/verify-user", verifyUserController);

// Route for logging in the user
router.post("/login", loginUserController);

// Route to complete registration
router.post("/complete-registration", completeRegistrationController);

// Route to initiate forgot password (sends reset email)
router.post("/forgot-password", forgotPasswordController);

// Route to reset password using token
router.post("/reset-password", resetPasswordController);

// Route to check if email exists
router.post("/check-email", checkEmailController);

// Route to check if username exists
router.post("/check-username", checkUsernameController);
router.post("/register", registerUserController);



module.exports = router;
