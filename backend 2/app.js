require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/DBConfig');
const loginRoutes = require('./routes/loginRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const roomTypesRoutes = require('./routes/roomTypesRoutes'); // Import room types routes
const storeRoutes = require('./routes/storeRoutes'); // Import store routes
const furnitureCategoryRoutes = require('./routes/furnitureCategoryRoutes'); // Import furniture category routes
const furnitureColorRoutes = require('./routes/furnitureColorRoutes'); // Import furniture color routes
const materialRoutes = require('./routes/materialRoutes'); // Import material routes
const designRoutes = require('./routes/designRoutes'); // Import material routes
const preferencesRoutes = require('./routes/preferencesRoutes'); // Import material routes
const furnitureRoutes = require('./routes/furnitureRoutes'); // Import material routes
const app = express();
// Serve static files from the /generated_images directory
const path = require('path');
app.use('/generated_images', express.static(path.join(__dirname, 'generated_images')));
// Connect to DB
connectDB();

// Middleware to parse incoming JSON
app.use(express.json());

// Enable CORS for specific origin (your frontend)
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Use routes
app.use('/api/auth', loginRoutes); // Login routes
app.use('/api/user', userRoutes); // User routes
app.use('/api/room', roomTypesRoutes); // User routes
app.use('/api/store', storeRoutes); // User routes
app.use('/api/furniture', furnitureCategoryRoutes); // User routes
app.use('/api/furniture-color', furnitureColorRoutes); // User routes
app.use('/api/material', materialRoutes); // User routes
app.use('/api/designs', designRoutes); // User routes
app.use('/api/preferences', preferencesRoutes); // User routes
app.use('/api/furnitures', furnitureRoutes); // User routes

// Start the server
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
