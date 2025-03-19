import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../config/secret";
import { NextFunction, Request, Response } from "express";

const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" }); // Longer expiration
};

// Register User
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Please fill in all fields" });
    return;
  }
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    if (!email.endsWith("@cuchd.in")) {
      res.status(400).json({ message: "Only CUCHD domain emails are allowed" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const refreshToken = generateRefreshToken(user._id.toString());

    // Send refresh token as an httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiration
    });

    const constructedUser = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    res.status(201).json({
      success: true,
      message: "signup successfull",
      user: constructedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const refreshToken = generateRefreshToken(user._id.toString());

    // Set the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiration
    });

    const constructedUser = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    res.status(200).json({
      success: true,
      message: "login successfull",
      user: constructedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Access Token
// export const refreshToken = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
//   const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies

//   if (!refreshToken) {
//     res.status(403).json({ message: 'No refresh token, access denied' });
//     return;
//   }

//   // Verify the refresh token
//   jwt.verify(refreshToken, JWT_SECRET, async (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid refresh token' });
//     }

//     // Find the user associated with the refresh token
//     const user = await User.findById(decoded.id.toString());
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Create a new access token
//     const accessToken = generateAccessToken(user._id.toString());

//     // Send the new access token
//     return res.json({ accessToken });
//   });
// };
