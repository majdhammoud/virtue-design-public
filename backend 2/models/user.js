const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    Username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    Password: { 
        type: String, 
        required: true, 
        minlength: [6, 'Password should be at least 6 characters long.']
    },
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
    JoinDate: { 
        type: Date, 
        default: Date.now, 
        required: true
    },
    UserLocationX: { 
        type: Number, 
        required: true
    },
    UserLocationY: { 
        type: Number, 
        required: true
    },
    // Changed to arrays to support multiple entries
    PreferencesIDs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Preferences'
    }],
    DesignsIDs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Design'
    }],

    IsVerified: { 
        type: Boolean, 
        default: false 
    },
    IsAdmin: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

/* Pre-save middleware to hash the password if it's modified
UserSchema.pre('save', async function(next) {
    if (this.isModified('Password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.Password = await bcrypt.hash(this.Password, salt);
        } catch (err) {
            return next(err);
        }
    }
    next();
});
*/

// Pre-remove middleware to cascade delete the associated Preferences documents
UserSchema.pre('remove', async function(next) {
    try {
        const Preferences = mongoose.model('Preferences');
        if (this.PreferencesIDs && this.PreferencesIDs.length > 0) {
            await Preferences.deleteMany({ _id: { $in: this.PreferencesIDs } });
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);
