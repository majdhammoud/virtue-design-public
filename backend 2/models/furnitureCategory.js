const mongoose = require('mongoose');

const FurnitureCategorySchema = new mongoose.Schema({
    CategoryName: { 
        type: String, 
        required: true, 
        unique: true 
    },

    RoomType: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomTypes',  
        required: true
    }

}, { timestamps: true }); 

module.exports = mongoose.model('FurnitureCategory', FurnitureCategorySchema);
