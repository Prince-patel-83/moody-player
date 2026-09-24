const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model")
const { validationResult } = require("express-validator")

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

const register = async (req, res) => {
  try {

    const { name, email, password } = req.body;
    if (!name || !isValid || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({
        errors:errors.array()
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success:true,
      message: "User registered successfully.",
      user: sanitizeUser(user),
      token,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error.",
      success:false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({
        errors:errors.array()
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({
      email: normalizedEmail,
    }).select("+password");

    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success:true,
      message: "Login successful.",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error.",
      success:false,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user: sanitizeUser(user),
    });
    
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error.",
    });
  }
};

const logoutController =  (req, res) => {
    res.clearCookie("token");

    res.status(200).json({
        message: "Logout successful"
    });
}


module.exports = {
  register,
  login,
  getCurrentUser,
  logoutController,
};
