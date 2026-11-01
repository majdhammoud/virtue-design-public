const mongoose = require('mongoose');

const FurnitureSchema = new mongoose.Schema({
    FurnitureName: { 
        type: String, 
        required: true, 
        unique: true 
    },

    FurnitureCategoryID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FurnitureCategory', 
        required: true 
    },

    FurnitureColorID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FurnitureColors', 
        required: true 
    },

    FurnitureWidth: { 
        type: Number, 
        required: true, 
        min: [0, 'Furniture width cannot be negative.'] 
    },

    FurnitureHeight: { 
        type: Number, 
        required: true, 
        min: [0, 'Furniture height cannot be negative.'] 
    },

    FurnitureDepth: { 
        type: Number, 
        required: true, 
        min: [0, 'Furniture depth cannot be negative.'] 
    },

    FurniturePicture: { 
        type: String, 
        validate: { 
            validator: function (v) { 
                return /^https?:\/\//.test(v); 
            }, 
            message: 'Furniture picture must be a valid URL.' 
        }, 
        default: null 
    },

    FurniturePrice: { 
        type: Number, 
        required: true, 
        min: [0, 'Furniture price cannot be negative.'] 
    },

    FurnitureMaterialID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Material', 
        required: true 
    },

    StoreID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Store', 
        required: true 
    },

    RoomTypeID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomType', 
        required: true 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Furniture', FurnitureSchema);
