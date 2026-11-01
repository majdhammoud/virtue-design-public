const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
    FurnitureUsedID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture',
        required: true
    },

    MaterialsUsedID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },

    RecommendationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendations',
        required: true
    },

    // RoomType: {
    //     type: String,
    //     enum: ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Bathroom', 'Dining Room'],
    //     required: true
    // },

    RoomTypeID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomType', 
        required: true 
    },

    Budget: {
        type: Number,
        required: true,
        min: [0, 'Budget cannot be negative.']
    },

    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    ModelURL: {
        type: String,
        required: true
    },
}, { timestamps: true }); 

module.exports = mongoose.model('Design', DesignSchema);
