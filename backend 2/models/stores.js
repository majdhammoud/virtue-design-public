const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    StoreName: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    // Use a GeoJSON object to store coordinates in a single field.
    Location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        // Coordinates stored as [longitude, latitude]
    Coordinates: {
            type: [Number],
            required: true
        }
    },
    Address: { 
        type: String, 
        required: true, 
        trim: true 
    },
    Website: { 
        type: String, 
        validate: {
            validator: function(value) {
                return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value);
            },
            message: 'Website must be a valid URL.'
        },
        required: false
    },

    image: { 
        type: String, 
        required: true 
    },
}, { timestamps: true });

// Create a 2dsphere index for geospatial queries.
StoreSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Store', StoreSchema);
