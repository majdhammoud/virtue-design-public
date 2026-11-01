const mongoose = require('mongoose');

const RoomTypesSchema = new mongoose.Schema({
    RoomName: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('RoomTypes', RoomTypesSchema);
