const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    MaterialName: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    MaterialType: { 
        type: String, 
        enum: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Stone'], 
        required: true 
    },
    MaterialDescription: {
        type: String,
        required: true
    },
    MaterialHex: {
        type: String,
        required: true,
        validate: {
            validator: function(v) { 
                return /^#[0-9A-F]{6}$/i.test(v);
            },
            message: 'MaterialHex must be a valid hex color code.'
        }
    },
    //not required
    MaterialImage: { 
        type: String, 
        validate: { 
            validator: function (v) { 
                // Allow null or valid URL
                return !v || /^https?:\/\//.test(v); 
            }, 
            message: 'MaterialImage must be a valid URL.'
        }, 
        default: null 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Material', MaterialSchema);