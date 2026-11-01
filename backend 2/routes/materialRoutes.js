const express = require('express');
const router = express.Router();
const materialService = require('../services/materialService');
const { isValidObjectId } = require('../validators/objectIdValidator');
const { validateRequest } = require('../utils/validateRequest');
const { handleServiceCall } = require('../utils/handleServiceCall');
const { createMaterialSchema, updateMaterialSchema } = require('../validators/materialValidator');
const requireAdmin = require('../middleware/authAdminMiddleware');
// Controller function to add a material
router.post('/', requireAdmin, async (req, res) => {
    try {
        const validatedBody = validateRequest(req, res, () => {}, createMaterialSchema);
        // Map client-friendly fields to the model's fields
        const materialData = {
            MaterialName: req.body.name,
            MaterialType: req.body.type,
            MaterialDescription: req.body.description,
            MaterialHex: req.body.hex,
            MaterialImage: req.body.image || null
        };
        await handleServiceCall(materialService.addMaterial, res, materialData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Controller function to get a material by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid material ID' });
    }
    handleServiceCall(materialService.getMaterialById, res, id);
});

// Controller function to get all materials
router.get('/', (req, res) => {
    handleServiceCall(materialService.getAllMaterials, res);
});

// Controller function to update a material by ID
router.put('/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid material ID' });
    }
    try {
        const validatedBody = validateRequest(req, res, () => {}, createMaterialSchema);;
        // Build the update object with mapped fields
        const updateData = {};
        if (req.body.name) updateData.MaterialName = req.body.name;
        if (req.body.type) updateData.MaterialType = req.body.type;
        if (req.body.description) updateData.MaterialDescription = req.body.description;
        if (req.body.hex) updateData.MaterialHex = req.body.hex;
        if (req.body.image !== undefined) updateData.MaterialImage = req.body.image;
        await handleServiceCall(materialService.updateMaterial, res, id, updateData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Controller function to delete a material by ID
router.delete('/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid material ID' });
    }
    handleServiceCall(materialService.deleteMaterial, res, id);
});

// Controller function to get materials by type
router.get('/type/:type', requireAdmin, (req, res) => {
    const { type } = req.params;
    handleServiceCall(materialService.getMaterialsByType, res, type);
});

module.exports = router;