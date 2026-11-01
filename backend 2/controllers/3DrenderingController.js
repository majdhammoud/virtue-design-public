const threeDRenderingService = require('../services/3DrenderingService');
// const { validateGenerate3DModel, validateDesignId } = require('../validators/3DValidator');
const logger = require('../utils/logger');
const multer = require('multer');
const fs = require('fs');
const { OpenAI } = require('openai');
const upload = multer({ dest: 'uploads/' });
// Generate 3D Model
const generate3DModel = async (req, res) => {
    // const { error } = validateGenerate3DModel(req.body);
    // if (error) return res.status(400).json({ message: error.details[0].message });

    const prompt = req.body.prompt;
    console.log('File:', req.file);
    try {
        const imageStream = fs.createReadStream(req.file.path);
        const result = await openai.images.edit({
        image: imageStream,
        prompt,
        n: 1,
        size: '1024x1024'
        });

        fs.unlinkSync(req.file.path); // cleanup temp file

        res.json({ imageUrl: result.data[0].url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to edit image' });
    }

    // try {
    //     const model = await threeDRenderingService.generate3DModel(req.body);
    //     res.status(201).json(model);
    // } catch (error) {
    //     logger.error(`Error generating 3D model: ${error.message}`);
    //     res.status(500).json({ message: 'Internal Server Error' });
    // }
};

// Apply AR Visualization
const applyARVisualization = async (req, res) => {
    // const { error } = validateDesignId(req.params.designId);
    // if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const result = await threeDRenderingService.applyARVisualization(req.params.designId);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`Error applying AR visualization: ${error.message}`);
        res.status(404).json({ message: error.message });
    }
};

// Preview Design in 3D
const previewDesignIn3D = async (req, res) => {
    // const { error } = validateDesignId(req.params.designId);
    // if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const preview = await threeDRenderingService.previewDesignIn3D(req.params.designId);
        res.status(200).json(preview);
    } catch (error) {
        logger.error(`Error previewing design in 3D: ${error.message}`);
        res.status(404).json({ message: error.message });
    }
};

// Update AR Model
const updateARModel = async (req, res) => {
    // const { error } = validateDesignId(req.params.designId);
    // if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const updatedModel = await threeDRenderingService.updateARModel(req.params.designId, req.body);
        res.status(200).json(updatedModel);
    } catch (error) {
        logger.error(`Error updating AR model: ${error.message}`);
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    generate3DModel,
    applyARVisualization,
    previewDesignIn3D,
    updateARModel,
};
