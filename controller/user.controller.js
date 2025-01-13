import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateUser, validateLogin } from "../validators/user.validator.js";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '24h';
const SALT_ROUNDS = 10;

export const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.status(200).json({
      token,
      user: userResponse
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password, mobile, gender } = req.body;
    console.log(req.body);
    

    const existingUser = await User.findOne({ where: { email }});
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      gender
    });

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender
    };

    res.status(201).json({ 
      message: 'User registered successfully',
      user: userResponse
    });

  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const update = async (req, res) => {
  try {
    const { condition_obj, content_obj } = req.body;

    if (!condition_obj || !content_obj) {
      return res.status(400).json({ error: 'Invalid request: Missing condition or content object' });
    }

    const userDetails = await User.findAll({ where: condition_obj });

    if (userDetails.length > 0) {
      const [updated] = await User.update(content_obj, { where: condition_obj });

      if (updated > 0) {
        res.status(200).json({ message: 'User updated successfully' });
      } else {
        res.status(500).json({ error: 'Server error: No records updated' });
      }
    } else {
      res.status(404).json({ error: 'Requested resource not found' });
    }
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { condition_obj } = req.body;

    if (!condition_obj) {
      return res.status(400).json({ error: 'Invalid request: Missing condition object' });
    }

    const userDetails = await User.findAll({ where: condition_obj });

    if (userDetails.length > 0) {
      const deleted = await User.destroy({ where: condition_obj });

      if (deleted > 0) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(500).json({ error: 'Server error: No records deleted' });
      }
    } else {
      res.status(404).json({ error: 'Requested resource not found' });
    }
  } catch (error) {
    handleDatabaseError(error, res);
  }
};


export const fetch = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Error handler utility
const handleDatabaseError = (error, res) => {
  if (error.name === 'SequelizeValidationError' || 
      error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: error.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }
  return res.status(500).json({ error: 'Internal server error' });
};