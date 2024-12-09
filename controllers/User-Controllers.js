const User = require("../models/User-Model.js");
const Enroll = require("../models/Enrollment-model.js");
const bcryptjs = require("bcryptjs");
const auth = require("../auth.js");

// User Registration
module.exports.registerUser = async (req, res) => {
  try {
    let newUser = new User({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      password: bcryptjs.hashSync(req.body.password, 10),
    });

    const result = await newUser.save();
    res.send({
      code: "REGISTRATION-SUCCESS",
      message: "You are now registered!",
      result: result,
    });
  } catch (error) {
    res.status(500).send({
      code: "REGISTRATION-FAILED",
      message: "We've encountered an error during the registration. Please try again!",
      error: error.message,
    });
  }
};

// User Login
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        code: "USER-NOT-REGISTERED",
        message: "Please register to login.",
      });
    }

    const isPasswordCorrect = bcryptjs.compareSync(password, user.password);

    if (isPasswordCorrect) {
      return res.status(200).send({
        code: "USER-LOGIN-SUCCESS",
        token: auth.createAccessToken(user),
      });
    } else {
      return res.status(401).send({
        code: "PASSWORD-INCORRECT",
        message: "Password is not correct. Please try again.",
      });
    }
  } catch (error) {
    res.status(500).send({
      code: "LOGIN-FAILED",
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

// Check if email exists
module.exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await User.find({ email });
    if (result.length > 0) {
      return res.send({
        code: "EMAIL-EXISTS",
        message: "The user is registered.",
      });
    } else {
      return res.send({
        code: "EMAIL-NOT-EXISTING",
        message: "The user is not registered.",
      });
    }
  } catch (error) {
    res.status(500).send({
      code: "CHECK-EMAIL-FAILED",
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

// Get user profile
module.exports.getProfile = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({
        code: "USER-NOT-FOUND",
        message: "Cannot find user with the provided ID.",
      });
    }

    user.password = "*****"; // Masking password before sending user data
    res.status(200).send({
      code: "USER-FOUND",
      message: "A user was found.",
      result: user,
    });
  } catch (error) {
    res.status(500).send({
      code: "PROFILE-ERROR",
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

// Enroll a user
module.exports.enroll = async (req, res) => {
  const { id } = req.user;

  try {
    const newEnrollment = new Enroll({
      userId: id,
      enrolledCourse: req.body.enrolledCourse,
      totalPrice: req.body.totalPrice,
    });

    const result = await newEnrollment.save();
    res.status(200).send({
      code: "ENROLLMENT-SUCCESSFUL",
      message: "Congratulations, you are now enrolled!",
      result: result,
    });
  } catch (error) {
    res.status(500).send({
      code: "ENROLLMENT-FAILED",
      message: "There is a problem during your enrollment, please try again!",
      error: error.message,
    });
  }
};
