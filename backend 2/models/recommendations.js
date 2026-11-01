const mongoose = require('mongoose');

const RecommendationsSchema = new mongoose.Schema({
    UserID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    FurnitureRecommendations: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Furniture', 
        required: true 
    },
    MaterialRecommendations: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Material', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Recommendations', RecommendationsSchema);
