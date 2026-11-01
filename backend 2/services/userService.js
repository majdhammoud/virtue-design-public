const User = require('../models/user');
const Preferences = require('../models/preferences'); // Assuming a Preferences model exists

const findUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ Username: username.trim() });
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    } catch (error) {
        console.error('Error fetching user by username:', { error, username });
        throw new Error('Failed to fetch user by username.');
    }
};

const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ Email: email.trim() });
        return user;
    } catch (error) {
        console.error('Error fetching user by email:', { error, email });
        throw new Error('Failed to fetch user by email.');
    }
};

const findUserIdByUsername = async (username) => {
    try {
        const user = await User.findOne({ Username: username.trim() }, 'UserID');
        if (!user) {
            throw new Error('User not found.');
        }
        return user.UserID;
    } catch (error) {
        console.error('Error fetching user ID by username:', { error, username });
        throw new Error('Failed to fetch user ID by username.');
    }
};

const findUsernameByUserId = async (userId) => {
    try {
        const user = await User.findById(userId, 'Username');
        if (!user) {
            throw new Error('User not found.');
        }
        return user.Username;
    } catch (error) {
        console.error('Error fetching username by user ID:', { error, userId });
        throw new Error('Failed to fetch username by user ID.');
    }
};

const findByUserId = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', { error, userId });
        throw new Error('Failed to fetch user by ID.');
    }
};

const getUserJoinDate = async (username) => {
    try {
        const user = await User.findOne({ Username: username.trim() }, 'JoinDate');
        if (!user) {
            throw new Error('User not found.');
        }
        return user.JoinDate;
    } catch (error) {
        console.error('Error fetching user join date:', { error, username });
        throw new Error('Failed to fetch user join date.');
    }
};

const updateUserDesigns = async (userId, designs) => {
    // Validate the userId
    if (!isValidObjectId(userId)) {
        throw new Error('Invalid user ID');
    }

    // Ensure designs is an array (or in the expected format)
    if (!Array.isArray(designs)) {
        throw new Error('Designs must be an array');
    }

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        // Update the user's designs
        user.designs = designs;  // Assign new designs
        await user.save();  // Save the updated user data

        // Return the updated user object with the new designs
        return user;
    } catch (error) {
        // Log the error with more context
        console.error(`Error updating user designs for user ID ${userId}:`, error);
        throw new Error(`Failed to update user designs for user ID ${userId}.`);
    }
}

// Add Preferences to User
const addUserPreferences = async (userId, preferenceData) => {
    try {
        // Create a new preference for the user
        const preference = new Preferences({
            UserID: userId, // Link the preference to the current user
            ...preferenceData // Spread the preference data passed from the user
        });

        // Save the preference
        await preference.save();

        // Return the saved preference and the user
        return preference;
    } catch (error) {
        console.error('Error adding user preferences:', error);
        throw new Error('Failed to add preferences.');
    }
};

// Update Preferences of User
const updateUserPreferences = async (userId, updatedPreferenceData) => {
    try {
        // Find the user's preferences by UserID
        const preference = await Preferences.findOne({ UserID: userId });

        if (!preference) {
            throw new Error('Preferences not found for this user.');
        }

        // Update the preferences with the new data
        Object.assign(preference, updatedPreferenceData); // Update fields with the new data

        // Save the updated preference
        await preference.save();

        return preference;
    } catch (error) {
        console.error('Error updating user preferences:', error);
        throw new Error('Failed to update preferences.');
    }
};

const deleteUserPreferences = async (userId) => {
    try {
        // Find and delete the preference associated with the user
        const preference = await Preferences.findOneAndDelete({ UserID: userId });

        if (!preference) {
            throw new Error('Preferences not found for this user.');
        }

        return { message: 'Preferences deleted successfully.' };
    } catch (error) {
        console.error('Error deleting user preferences:', error);
        throw new Error('Failed to delete preferences.');
    }
};


// Get Preferences of User
const getUserPreferences = async (userId) => {
    try {
        // Find and return the user's preferences
        const preference = await Preferences.findOne({ UserID: userId });

        if (!preference) {
            throw new Error('Preferences not found for this user.');
        }

        return preference;
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        throw new Error('Failed to fetch preferences.');
    }
};

// Update User Location (using X and Y coordinates from Google Maps)
const updateUserLocation = async (userId, userLocationX, userLocationY) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found.');

        user.UserLocationX = userLocationX;
        user.UserLocationY = userLocationY;
        await user.save();
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to update user location.');
    }
};


module.exports = {
    findUserByUsername,
    findUserByEmail,
    findUserIdByUsername,
    findUsernameByUserId,
    getUserJoinDate,
    updateUserDesigns,
    addUserPreferences,
    updateUserPreferences,
    deleteUserPreferences,
    getUserPreferences,
    updateUserLocation,
    findByUserId
};
