const User = require("../models/schema");
const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const { generateToken, validateToken } = require("../auth/JWT");
const bcrypt = require("bcrypt");
// to register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const newUser = new User({ email, password });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    newUser.password = hashedPassword;
    await newUser.save();
    return res.status(200).json({ message: "Successfully registered" });
  } catch (err) {
    console.log("err", err);
    throw new Error(err);
  }
});

//to login new users
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
      res.status(400).json({ message: "No users found" });
    }
    const validPassword = await bcrypt.compare(password, isUserExist.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(isUserExist.email, isUserExist._id);
    return res
      .status(200)
      .json({ message: "Logged in successfully", token: token });
  } catch (err) {
    console.log("err", err);
    throw new Error(err);
  }
});

// get login data//////////////////
router.get("/checkuser", validateToken, async (req, res) => {
  try {
    const { email } = req.user;
    console.log("email", email);
    const user = await User.findOne({ email });
    console.log("user", user);
    return res.status(200).json(user);
  } catch (err) {
    console.log("err", err);
    throw new Error();
  }
});

/// update userdata///

router.put("/update/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email,
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("err", err);
    throw Error(err);
  }
});

// delete user id////
router.delete("/delete/:id", validateToken, async (req, res) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);

  console.log("deletedUser", deletedUser);

  res.status(200).send("successfully deleted");
});
module.exports = router;
