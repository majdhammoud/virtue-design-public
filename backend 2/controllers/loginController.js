const { 
    sendVerificationCode, 
    verifyUser, 
    loginUser, 
    completeRegistration, 
    checkEmailExists, 
    checkUsernameExists, 
    forgotPassword, 
    resetPassword, 
    addUser 
} = require('../services/loginService');

const { 
    emailSchema, 
    verificationSchema, 
    loginSchema 
} = require('../validators/loginValidator');

const { handleServiceCall } = require('../utils/handleServiceCall');

//  Send Verification Code
const sendVerificationCodeController = async (req, res) => {
    try {
        const { email } = req.body;
        // Validate email
        await emailSchema.validateAsync(email.trim());

        // Use handleServiceCall to manage service call and error handling
        await handleServiceCall(sendVerificationCode, res, email.trim());
    } catch (error) {
        // Send detailed error if validation fails
        res.status(400).json({ error: error.details ? error.details[0].message : error.message });
    }
};

//  Verify User
const verifyUserController = async (req, res) => {
    try {
        const { email, verificationCode } = await verificationSchema.validateAsync(req.body);

        // Handle service call to verify the user
        await handleServiceCall(verifyUser, res, email, verificationCode);
    } catch (error) {
        res.status(400).json({ error: error.details ? error.details[0].message : error.message });
    }
};

//  Login User
const loginUserController = async (req, res) => {
    try {
        const { username, password } = await loginSchema.validateAsync(req.body);

        // Handle service call to login the user
        await handleServiceCall(loginUser, res, username, password);
    } catch (error) {
        res.status(400).json({ error: "Username or password is incorrect" });
    }
};

//  Complete Registration
const completeRegistrationController = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Handle service call to complete registration
        await handleServiceCall(completeRegistration, res, email, username, password);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//  Forgot Password
const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        // Validate email
        await emailSchema.validateAsync(email.trim());

        // Handle service call to handle forgot password request
        await handleServiceCall(forgotPassword, res, email.trim());
    } catch (error) {
        res.status(400).json({ error: error.details ? error.details[0].message : error.message });
    }
};

//  Reset Password
const resetPasswordController = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Handle service call to reset the password
        await handleServiceCall(resetPassword, res, resetToken, newPassword);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//  Check if Email Exists
const checkEmailController = async (req, res) => {
    try {
        const { email } = req.body;

        // Handle service call to check if email exists
        await handleServiceCall(checkEmailExists, res, email);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Check if Email Exists
const registerUserController = async (req, res) => {
    try {
        const { email, password, username, confirmPassword, UserLocationX, UserLocationY } = req.body;

        // Handle service call to check if email exists
        await handleServiceCall(addUser, res, { email, password, username, confirmPassword, UserLocationX, UserLocationY });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  Check if Username Exists
const checkUsernameController = async (req, res) => {
    try {
        const { username } = req.body;

        // Handle service call to check if username exists
        await handleServiceCall(checkUsernameExists, res, username);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    sendVerificationCodeController,
    verifyUserController,
    loginUserController,
    completeRegistrationController,
    forgotPasswordController,
    resetPasswordController,
    checkEmailController,
    checkUsernameController,
    registerUserController
};
