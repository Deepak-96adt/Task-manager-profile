import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import randomString from "randomstring";

export const login = async (req, res, next) => {
  try {
    const condition_obj = { ...req.body }; 
    const userDetails = await User.findOne({ where: condition_obj });

    if (userDetails) {
      const payload = { subject: userDetails.email };
      const key = randomString.generate();
      const token = jwt.sign(payload, key); 
      res.status(200).json({ token, userDetails });
    } else {
      res.status(400).json({ status: "Invalid details!" });
    }
  } catch (error) {
    res.status(500).json({ status: "Server error", error: error.message });
  }
};


export const register = async (req, res) => {
  try {
    const { name, email, password, mobile, gender } = req.body;
    const user = await User.create({ name, email, password, mobile, gender });
    res.status(201).json({ status: "User registered successfully", user });
  } catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      const messages = error.errors.map((err) => {
        if (err.path === "email") {
          return "Email is already registered or invalid.";
        }
        if (err.path === "mobile") {
          return "Mobile number must be 10 digits.";
        }
        if (err.path === "name") {
          return "Name is required.";
        }
        return err.message;
      });
      res.status(400).json({ status: "Validation error", errors: messages });
    } else {
      res.status(500).json({ status: "An unexpected error occurred", error: error.message });
    }
  }
};

export const fetch = async (req, res, next) => {
  try {
    const condition_obj = JSON.parse(req.query.condition_obj); // Parse condition
    const userDetails = await User.findAll({ where: condition_obj });

    if (userDetails.length > 0) {
      res.status(200).json({ userDetails });
    } else {
      res.status(404).json({ response: "Requested resource not found." });
    }
  } catch (error) {
    res.status(500).json({ status: "Server error", error: error.message });
  }
};

export const update = async (req, res, next) => {
  try {
    const condition_obj = JSON.parse(req.body.condition_obj);
    const content_obj = JSON.parse(req.body.content_obj);

    const userDetails = await User.findAll({ where: condition_obj });

    if (userDetails.length > 0) {
      const [updated] = await User.update(content_obj, { where: condition_obj });

      if (updated > 0) {
        res.status(200).json({ response: "User updated successfully." });
      } else {
        res.status(500).json({ response: "Server error. No records updated." });
      }
    } else {
      res.status(404).json({ response: "Requested resource not found." });
    }
  } catch (error) {
    res.status(500).json({ status: "Server error", error: error.message });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const condition_obj = JSON.parse(req.body.condition_obj);

    const userDetails = await User.findAll({ where: condition_obj });

    if (userDetails.length > 0) {
      const deleted = await User.destroy({ where: condition_obj });

      if (deleted > 0) {
        res.status(200).json({ response: "User deleted successfully." });
      } else {
        res.status(500).json({ response: "Server error. No records deleted." });
      }
    } else {
      res.status(404).json({ response: "Requested resource not found." });
    }
  } catch (error) {
    res.status(500).json({ status: "Server error", error: error.message });
  }
};

