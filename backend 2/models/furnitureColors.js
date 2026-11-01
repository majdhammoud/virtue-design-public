const mongoose = require('mongoose');

const FurnitureColorsSchema = new mongoose.Schema({
    ColorName: { 
        type: String, 
        required: true, 
        unique: true 
    },

    ColorTone: { 
        type: String, 
        enum: ['Neutral', 'Bold', 'Pastel', 'Monochromatic', 'Earthy', 'Vibrant'], 
        required: true 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('FurnitureColors', FurnitureColorsSchema);
