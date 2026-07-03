import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['TENANT', 'OWNER', 'ADMIN'],
      required: [true, 'Role is required'],
    },
    preferredLocation: {
      type: String,
      default: null,
    },
    budgetMin: {
      type: Number,
      default: null,
    },
    budgetMax: {
      type: Number,
      default: null,
    },
    moveInDate: {
      type: Date,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      default: null,
    },
    age: {
      type: Number,
      default: null,
    },
    occupation: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    lifestyle: {
      smoking: { type: String, default: null },
      drinking: { type: String, default: null },
      pets: { type: String, default: null },
      sleepSchedule: { type: String, default: null },
      cleanliness: { type: String, default: null },
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password instance method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT Access Token instance method
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      role: this.role,
    },
    env.jwt.secret,
    {
      expiresIn: env.jwt.expiry,
    }
  );
};

export const User = mongoose.model('User', userSchema);
export default User;
