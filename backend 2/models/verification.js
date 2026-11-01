const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            },
            message: 'Must be a valid email address.'
        }
    },
    VerificationCode: {
        type: String,
        required: true,
    },
    VerificationExpiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Verification', VerificationSchema);
