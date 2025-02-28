const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const Port = 8000;

app.use(express.json());
app.use(cors());

// Database connection
require("./db/connections");

// Import the user model
const User = require("./Models/users");
const Middleman = require("./Models/Middleman");
const Farmer = require("./Models/Farmer")

// Route to register a user
// Registration Endpoint
app.post("/", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure valid role selection
    if (role !== "Farmer" && role !== "Middleman") {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    // Save user to database
    const newUser = new User({ email, password, role });
    const result = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving user" });
  }
});
// Login Endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check user credentials
    const user = await User.findOne({ email, password, role });
    if (!user) {
      return res.status(401).json({ error: "Invalid email, password, or role" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in" });
  }
});


app.get("/middlemen", async (req, res) => {
  try {
    const middlemen = await Middleman.find();
    res.status(200).json(middlemen);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch middlemen data" });
  }
});


// Fetch all farmers
app.get('/farmer', async (req, res) => {
  try {
      const farmers = await Farmer.find(); // Ensure FarmerModel is imported correctly
      res.status(200).json(farmers);
  } catch (error) {
      console.error('Error fetching farmers:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});




// Start server
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
