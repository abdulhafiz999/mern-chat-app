import bcrypt from 'bcryptjs';
import userModel from '../models/user.model.js';

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
        .json({ message: "password must be at least 6 characters" });
    }

    //encrypt password using decryptjs
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (!hashPassword) {
      return res.status(404).json({
        message: "Password hashing failed"
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //create a new user

    const newUser = new userModel({
      username,
      email,
      password: hashPassword,
      avatar
    })

    await newUser.save();




    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        avatar: newUser.avatar,
      }
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error"
    });
  }
};
