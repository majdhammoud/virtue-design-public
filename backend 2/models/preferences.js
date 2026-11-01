const mongoose = require('mongoose');

const PreferencesSchema = new mongoose.Schema({
    UserID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        onDelete: 'CASCADE'
    },
    VibePreference: { 
        type: String, 
        enum: ['Minimalist', 'Rustic', 'Modern', 'Bohemian', 'Industrial', 'Traditional'], 
        default: null//add none as default
        //Minimalist 
    },
    ColorPreferences: { 
        type: String, 
        enum: ['Neutral', 'Bold', 'Pastel', 'Monochromatic', 'Earthy', 'Vibrant'], 
        required: true
        //neatral
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Preferences', PreferencesSchema);
