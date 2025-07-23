import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import generateJWT from "../lib/generateJWT.js";
import auth from "../middleware/auth.middleware.js"; // Ensure auth middleware is imported

export const signUp = async (req, res) => {
 const { username, email, password, avatar } = req.body;

  try {
    // validate data
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Plz fill all fields" });
    }

    //validate pasword length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters🙂" });
    }

    //encrypt password using decryptjs
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (!hashPassword) {
      return res.status(404).json({
        message: "Password hashing failed",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists 🤦" });
    }

    //create a new user

    const newUser = new userModel({
      username,
      email,
      password: hashPassword,
      avatar,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        userName: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        relationship: newUser.relationship,
        city: newUser.city,
        country: newUser.country,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // 2️⃣ Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Set user online status to true
    user.isOnline = true;
    await user.save();

    // 5️⃣ Generate token
    const token = generateJWT(user._id, res);

    // 6️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
        relationship: user.relationship,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

export const signOut = async (req, res) => {
  try {
    // ✅ Safety check
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user in request",
      });
    }

    // Update user's online status to false
    await userModel.findByIdAndUpdate(req.user._id, {
      isOnline: false,
    });

    // Clear the JWT cookie
    res.cookie("jwt", "", {
      maxAge: 0, // Expire the cookie immediately
      httpOnly: true,
      sameSite: "strict", // Ensure the cookie is sent only in same-site requests
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        isOnline: req.user.isOnline,
        createdAt: req.user.createdAt,
        city: req.user.city,
        relationship: req.user.relationship,
        country: req.user.country,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting user information",
      error: error.message,
    });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  const { username, email, avatar, city, relationship, country, dateOfBirth } =
    req.body;

  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;
    if (city) updateData.city = city;
    if (relationship) updateData.relationship = relationship;
    if (country) updateData.country = country;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    const existingUser = await userModel.findOne({
      _id: { $ne: req.user._id },
      $or: [username ? { username } : {}, email ? { email } : {}].filter(
        Boolean
      ),
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      })
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    res
      .status(500)
      .json({ message: "Profile update failed", error: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({
      message: "Server error during authentication check",
      error: error.message,
    });
  }
};

//implement updateUserInfo function to update user information like username, email, avatar, etc.

//add a user location which will include an location, relationShip, city, country, date of birth




// import bcrypt from "bcryptjs";
// import userModel from "../models/user.model.js";
// import generateJWT from "../lib/generateJWT.js";
// import auth from "../middleware/auth.middleware.js"; // Ensure auth middleware is imported

// // ✅ SIGN UP
// export const signUp = async (req, res) => {
//   const { username, email, password, avatar } = req.body;

//   try {
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "Please fill all fields" });
//     }

//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 6 characters" });
//     }

//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(password, salt);

//     const newUser = new userModel({
//       username,
//       email,
//       password: hashPassword,
//       avatar,
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: "User created successfully",
//       user: {
//         id: newUser._id,
//         username: newUser.username,
//         email: newUser.email,
//         avatar: newUser.avatar,
//       },
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ✅ SIGN IN
// export const signIn = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please provide email and password" });
//     }

//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     user.isOnline = true;
//     await user.save();

//     const token = generateJWT(user._id, res);

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         avatar: user.avatar,
//         isOnline: user.isOnline,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res
//       .status(500)
//       .json({ message: "Server error during login", error: error.message });
//   }
// };

// // ✅ SIGN OUT
// export const signOut = async (req, res) => {
//   try {
//     await userModel.findByIdAndUpdate(req.user._id, {
//       isOnline: false,
//     });

//     res.cookie("jwt", "", {
//       maxAge: 0,
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     res.status(200).json({
//       success: true,
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error during logout",
//       error: error.message,
//     });
//   }
// };

// // ✅ GET AUTHENTICATED USER
// export const getMe = async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         avatar: user.avatar,
//         isOnline: user.isOnline,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Fetch user error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching user information",
//       error: error.message,
//     });
//   }
// };

// // ✅ UPDATE PROFILE
// export const updateProfile = async (req, res) => {
//   const {
//     username,
//     email,
//     avatar,
//     country,
//     city,
//     bio,
//     address,
//     relationshipStatus,
//     dateOfBirth,
//   } = req.body;

//   try {
//     const updateData = {};

//     if (username) updateData.username = username;
//     if (email) updateData.email = email;
//     if (avatar) updateData.avatar = avatar;

//     if (country || city || address) {
//       updateData.location = {};
//       if (country) updateData.location.country = country;
//       if (city) updateData.location.city = city;
//       if (address) updateData.location.address = address;
//     }

//     if (relationshipStatus) updateData.relationshipStatus = relationshipStatus;
//     if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
//     if (bio) updateData.bio = bio;

//     const existingUser = await userModel.findOne({
//       _id: { $ne: req.user._id },
//       $or: [username ? { username } : {}, email ? { email } : {}].filter(
//         Boolean
//       ),
//     });

//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "Username or email already in use" });
//     }

//     const updatedUser = await userModel
//       .findByIdAndUpdate(req.user._id, updateData, {
//         new: true,
//         runValidators: true,
//       })
//       .select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Update profile error:", error);

//     if (error.name === "ValidationError") {
//       return res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors: Object.values(error.errors).map((err) => err.message),
//       });
//     }

//     if (error.code === 11000) {
//       return res
//         .status(400)
//         .json({ message: "Username or email already exists" });
//     }

//     res
//       .status(500)
//       .json({ message: "Profile update failed", error: error.message });
//   }
// };

// // ✅ CHECK AUTH
// export const checkAuth = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     res.status(200).json({
//       success: true,
//       user: req.user,
//     });
//   } catch (error) {
//     console.error("Check auth error:", error);
//     res.status(500).json({
//       message: "Server error during authentication check",
//       error: error.message,
//     });
//   }
// };
