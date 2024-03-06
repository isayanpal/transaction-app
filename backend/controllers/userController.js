const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const zod = require("zod");
const User = require("../models/userModel");
const { Account } = require("../models/accountModel");

// SignUp user
const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});
const signUpUser = async (req, res) => {
  const body = req.body;
  try {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "User already taken / Incorrect inputs",
      });
    }
    // check if user already exists
    const userExists = await User.findOne({
      username: body.username,
    });
    if (userExists) {
      return res.status(411).json({
        message: "User already exists",
      });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    // create User
    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      password: hashedPassword,
    });
    const userId = user._id;

    // create account
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });
    const token = jwt.sign(
      {
        userId,
      },
      process.env.JWT_SECRET
    );
    if (user) {
      return res.status(201).json({
        username: user.username,
        message: "User registered",
        token: token,
      });
    } else {
      throw new Error("Invalid user data");
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// SignIn user
const signinSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
});
const signInUser = async (req, res) => {
  const body = req.body;
  try {
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect credentials",
      });
    }

    // Check user existence
    const user = await User.findOne({
      username: body.username,
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const PassOk = await bcrypt.compare(body.password, user.password);
    if (!PassOk) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET
    );
    res.json({
      message: "Login Successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { signUpUser, signInUser };
