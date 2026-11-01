const User = require('../models/user');
const Verification = require('../models/verification');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment');
const { generateToken } = require('../middleware/jwt');
const nodemailer = require('nodemailer');

// ✅ Function to validate email format
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,           // your Gmail address
      pass: process.env.EMAIL_PASS,        // your Gmail App Password
    },
  });

const addUser = async ({ email, password, username, confirmPassword, UserLocationX, UserLocationY }) => {
    if (!email?.trim() || !isValidEmail(email)) throw new Error("A valid email address is required");
    if (!password?.trim() || password.length < 6) throw new Error("Password must be at least 6 characters");
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    if (!username?.trim()) throw new Error("Username is required");
    
    email = email.trim().toLowerCase(); // Normalize email
    username = username.trim();

    const emailExists = await User.findOne({ Email: email });
    if (emailExists) throw new Error("Email is already registered");

    const usernameExists = await User.findOne({ Username: username });
    if (usernameExists) throw new Error("Username is already taken");

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        Email: email,
        Username: username,
        Password: hashedPassword,
        IsVerified: false,
        UserLocationX,
        UserLocationY
    });

    await newUser.save();
    await sendVerificationCode(email); // Send verification code after user is created
    return { message: "User added successfully. Please verify your email." };
};

// Function to send verification code
const sendVerificationCode = async (email) => {
    if (!email?.trim() || !isValidEmail(email)) throw new Error("A valid email address is required");

    email = email.trim().toLowerCase(); // Convert email to lowercase

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpiresAt = moment().add(1, 'hour').toDate();

    const user = await User.findOne({ Email: email });
    if (!user) throw new Error("No user found with this email");

    const existingVerification = await Verification.findOne({ Email: email });
    if (existingVerification) {
        existingVerification.VerificationCode = verificationCode;
        existingVerification.VerificationExpiresAt = verificationExpiresAt;
        await existingVerification.save();
    } else {
        const verification = new Verification({
            Email: email,
            VerificationCode: verificationCode,
            VerificationExpiresAt: verificationExpiresAt,
        });
        await verification.save();
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${verificationCode}\nThis code will expire in 1 hour.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Error sending email:", err);
        throw new Error("Failed to send verification code via email.");
    }

    return { message: 'Please check your email for the verification code.' };
};

// Function to verify the user with the verification code
const verifyUser = async (email, verificationCode) => {
    if (!email?.trim()) throw new Error("Email is required");
    if (!verificationCode?.trim()) throw new Error("Verification code is required");

    email = email.trim().toLowerCase();
    const verification = await Verification.findOne({ Email: email, VerificationCode: verificationCode.trim() });

    if (!verification) {
        throw new Error("Invalid verification attempt");
    }

    if (moment().isAfter(verification.VerificationExpiresAt)) {
        throw new Error("Verification code has expired");
    }

    const user = await User.findOne({ Email: email });
    if (!user) throw new Error("User not found");
    
    if(user.isVerified) {
        user.Password = await bcrypt.hash(verificationCode, 12);
    }
    user.IsVerified = true;
    
    await user.save();

    return { message: 'Verification successful. You can now complete your registration.' };
};

// ✅ Complete registration after verification
const completeRegistration = async (email, username, password) => {
    const user = await User.findOne({ Email: email });

    if (!user) throw new Error("User not found");
    if (!user.IsVerified) throw new Error("User must verify their email first");

    const usernameExists = await User.findOne({ Username: username });
    if (usernameExists) throw new Error("Username is already taken");

    user.Username = username;
    user.Password = await bcrypt.hash(password, 12);
    user.JoinDate = moment().format('YYYY-MM-DD');

    await user.save();

    return { message: 'Registration completed successfully.' };
};

// Function to reset password
const resetPassword = async (resetToken, newPassword) => {
    try {
        const verification = await Verification.findOne({
            VerificationCode: resetToken,
            VerificationExpiresAt: { $gt: Date.now() }, // Ensure token is not expired
        });

        if (!verification) {
            throw new Error('Invalid or expired reset token.');
        }

        const user = await User.findOne({ Email: verification.Email });

        if (!user) {
            throw new Error('User not found.');
        }

        if (newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters.');
        }

        user.Password = await bcrypt.hash(newPassword, 12);
        await user.save();

        await Verification.deleteOne({ _id: verification._id }); // Remove the verification record

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification Code',
            text: `Your verification code is: ${verificationCode}\nThis code will expire in 1 hour.`,
        };

        try {
            await transporter.sendMail(mailOptions);

        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Failed to send verification code via email.");
        }

        return { message: 'Password has been reset successfully.' };
    } catch (error) {
        console.error('Error resetting password:', error);
        throw new Error('Failed to reset password.');
    }
};

// Forgot password: Generate reset token and send email
const forgotPassword = async (email) => {
    if (!email?.trim() || !isValidEmail(email)) throw new Error("A valid email address is required");

    email = email.trim().toLowerCase(); // Convert email to lowercase

    const user = await User.findOne({ Email: email });

    if (!user) {
        throw new Error('No account found with this email.');
    }

    const resetToken = crypto.randomInt(100000, 999999).toString();
    const resetPasswordExpire = moment().add(1, 'hour').toDate();

    const verification = new Verification({
        Email: email,
        VerificationCode: resetToken,
        VerificationExpiresAt: resetPasswordExpire,
    });

    await verification.save();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Use this token to reset your password: ${resetToken}\nThe token will expire in 1 hour.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Error sending reset email:", err);
        throw new Error('Failed to send reset email.');
    }

    return { message: 'A password reset link has been sent to your email.' };
};

const loginUser = async (username, password) => {
    if (!username?.trim()) throw new Error("Username is required");
    if (!password?.trim()) throw new Error("Password is required");

    // Find the user by username
    const user = await User.findOne({ Username: username.trim() });
    
    if (!user) {
        throw new Error("Username or password is incorrect");
    }

    // Compare passwords (plaintext for now)
    const isMatch = await bcrypt.compare(password, user.Password);
    
    if (!isMatch) {
        throw new Error("Username or password is incorrect");
    }

    // Generate the token with additional user info
    const token = generateToken({
        userId: user._id,
        username: user.Username,
        joinDate: user.JoinDate,
    });

    return {
        message: "Logged in successfully!",
        userId: user._id,
        token, // The token now includes the username and join date
    };
};

// Service to check if email already exists
const checkEmailExists = async (email) => {
    const user = await User.findOne({ Email: email });
    return { exists: !!user };
};

// Service to check if username already exists
const checkUsernameExists = async (username) => {
    const user = await User.findOne({ Username: username });
    return { exists: !!user };
};

module.exports = {
    sendVerificationCode,
    verifyUser,
    resetPassword, 
    loginUser,
    completeRegistration,
    forgotPassword,  
    checkEmailExists,
    checkUsernameExists,
    addUser
};
