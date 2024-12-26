// controllers/profileController.js
const Profile = require("../models/profile");

const getProfiles = (req, res) => {
  Profile.getAllProfiles((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

module.exports = {
  getProfiles,
};
