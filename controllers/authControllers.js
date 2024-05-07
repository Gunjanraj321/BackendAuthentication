const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Please fill all the fields",
      });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        error: "User not found , register first",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

    res.status(200).json({ message: "login succesful", token: token });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const authCheck = (req, res) => {
  const userId = req.user;
  res.status(201).json({ message: "working", success: true, userId: userId });
};

const UpdatePassword = async (req, res) => {
    const { oldPassword, newPassword  } = req.body;
    const userId = req.user.userId;
    try {
      // Fetch the user from the database
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        // If user not found, return appropriate error response
        return res.status(400).json({
          error: "User not found",
        });
      }
      // Verify if the old password matches
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        // If old password doesn't match, return appropriate error response
        return res.status(400).json({
          error: "Invalid credentials",
        });
      }
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // Update user's password in the database
      await User.update({ password: hashedPassword }, { where: { id: userId } });
      // Send success response
      res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      // Handle any errors and send error response
      res.status(500).json({
        error: err.message,
      });
    }
  };
  

module.exports = { signup, login, authCheck, UpdatePassword };
