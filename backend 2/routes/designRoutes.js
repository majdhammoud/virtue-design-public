const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const path = require("path");
const { OpenAI } = require("openai");
const jwt = require("jsonwebtoken");
const upload = multer({ dest: "./uploads/" });
const Furniture = require("../models/furniture");
const UserPreferences = require("../models/preferences");
const FurnitureColors = require("../models/furnitureColors");
const Design = require("../models/designs"); // Ensure you have the Design model
const Recommendations = require("../models/recommendations"); // Ensure you have the Recommendations model
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", upload.array("images", 1), async (req, res) => {
  const images = req.files;
  try {
    console.log(req.body.roomType);
    if (images.length === 0) {
      return res.status(400).json({ error: "At least one image is required." });
    }
    if (!req.body.roomType || req.body.roomType.trim() === "") {
      return res
        .status(400)
        .json({ error: "Room type is required and cannot be empty." });
    }

    const RoomTypeID = req.body.roomType;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.decode(token);
    const UserID = decodedToken?.userId;
    if (!UserID) {
      return res.status(401).json({ error: "Invalid token: UserID not found" });
    }

    // Fetch user preferences based on userId
    const userPreferences = await UserPreferences.findOne({ UserID }).exec();
    let userColorPreference = null;
    let vibePreference = null;
    if (userPreferences) {
      userColorPreference = userPreferences.ColorPreferences;
      if (userColorPreference) {
        const color = await FurnitureColors.findOne({
          ColorTone: userColorPreference,
        }).exec();
        userColorPreference = color ? color._id : null;
      }
      vibePreference = userPreferences.VibePreference;
    }

    const FurniturePrice = req.body.price || 10000000000000000000;

    const FutureColorID = userColorPreference || null;
    const query = { RoomTypeID, FurniturePrice: { $lt: FurniturePrice } };
    if (FutureColorID) {
      query.FurnitureColorID = FutureColorID;
    }
    const furnitureItems = await Furniture.find(query).exec();
    if (!furnitureItems || furnitureItems.length === 0) {
      return res
        .status(404)
        .json({
          error:
            "No furniture items found for the specified room and furniture type.",
          FutureColorID: FutureColorID,
        });
    }

    const randomFurnitureItem =
      furnitureItems[Math.floor(Math.random() * furnitureItems.length)];
    const prompt =
      "Merge room with " +
      randomFurnitureItem.FurnitureName +
      " with schema " +
      (vibePreference ? vibePreference : "");

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required." });
    }

    userId = decodedToken?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Invalid token: userId not found" });
    }

    console.log("User ID:", userId);
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("n", 1);
    form.append("size", "1024x1024");
    form.append("model", "gpt-image-1");

    images.forEach((image, index) => {
      form.append(`image[${index}]`, fs.createReadStream(image.path), {
        filename: path.basename(image.path),
        contentType: "image/png",
      });
    });

    const imageUrl = randomFurnitureItem.FurniturePicture;

    for (let i = 0; i < furnitureItems.length; i++) {
      const furnitureImageUrl = furnitureItems[i].FurniturePicture;
      if (furnitureImageUrl) {
        try {
          const furnitureImageResponse = await axios.get(furnitureImageUrl, { responseType: "stream" });
          form.append(`image[${images.length + i}]`, furnitureImageResponse.data, {
            filename: `furniture-image-${i}.jpeg`,
            contentType: "image/jpeg",
          });
        } catch (error) {
          console.warn(`Failed to load furniture image at index ${i}:`, error.message);
        }
      }
    }
    const onlineImageIndex = images.length;

    // const responseimage = await axios.get(imageUrl, { responseType: "stream" });
    // form.append(`image[${onlineImageIndex}]`, responseimage.data, {
    //   filename: "online-image.jpeg",
    //   contentType: "image/jpeg",
    // });
    const response = await axios.post(
      "https://api.openai.com/v1/images/edits",
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );
    console.log("Response:", response.data);
    const generatedImageBase64 = response?.data?.data?.[0]?.b64_json;

    if (!generatedImageBase64) {
      return res.status(500).json({ error: "Failed to generate image" });
    }

    const outputDir = path.join(
      __dirname,
      "../generated_images",
      userId.toString()
    );
    const outputFilePath = path.join(
      outputDir,
      `generated_image_${Date.now()}.png`
    );

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      outputFilePath,
      Buffer.from(generatedImageBase64, "base64")
    );

    const newRecommendation = new Recommendations({
      UserID: userId,
      FurnitureRecommendations: randomFurnitureItem._id,
      MaterialRecommendations: randomFurnitureItem.FurnitureMaterialID,
    });

    const newDesign = new Design({
      UserID: userId,
      RoomTypeID: RoomTypeID,
      DesignImage: `/generated_images/${userId}/${path.basename(
        outputFilePath
      )}`,
      FurnitureID: randomFurnitureItem._id,
      VibePreference: vibePreference || null,
      ColorPreferences: userColorPreference || null,
      FurnitureUsedID: randomFurnitureItem._id,
      MaterialsUsedID: randomFurnitureItem.FurnitureMaterialID,
      RecommendationID: newRecommendation._id,
      RoomType: req.body.roomType || "Living Room",
      Budget: FurniturePrice,
      CreatedBy: userId,
      ModelURL: `/generated_images/${userId}/${path.basename(outputFilePath)}`,
    });

    await newRecommendation.save();

    await newDesign.save();
    res.json({
      imageUrl: `/generated_images/${userId}/${path.basename(outputFilePath)}`,
    });
  } catch (err) {
    console.error(err?.response?.data || err);
    res.status(500).json({ error: "Image generation failed" });
  } finally {
    // Clean up uploaded files
    images.forEach((image) => fs.unlinkSync(image.path));
  }
});

router.get("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.decode(token);
  const UserID = decodedToken?.userId;
  if (!UserID) {
    return res.status(401).json({ error: "Invalid token: UserID not found" });
  }

  try {
    const designs = await Design.find({ CreatedBy: UserID })
      .populate("FurnitureUsedID")
      .populate("MaterialsUsedID")
      .populate("RecommendationID")
      .exec();
    res.json(designs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch designs" });
  }
});

router.get("/search", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  try {
    const designs = await Design.find()
      .populate("FurnitureUsedID")
      .populate("MaterialsUsedID")
      .populate("RecommendationID")
      .exec();

      ;
    res.json(await Design.populate(designs, {
        path: "FurnitureUsedID.StoreID",
      }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch designs" });
  }
});
module.exports = router;
