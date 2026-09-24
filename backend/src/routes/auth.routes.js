const express = require("express");
const {body} = require("express-validator")
const {
  register,
  login,
  getCurrentUser,
  logoutController,
} = require("../controllers/user.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", [
    body('name').isLength({min:3}).withMessage('Name must be at least 3 Characters long'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('password mustbe at least 6 characters long')
]
  ,  register);


router.post("/login",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('password mustbe at least 6 characters long')

], login);


router.get("/logout", protect, logoutController);
router.get("/me", protect, getCurrentUser);

module.exports = router;