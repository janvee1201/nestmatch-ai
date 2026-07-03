import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    propertyType: {
      type: String,
      enum: {
        values: ['Apartment', 'Flat', 'PG', 'House'],
        message: 'Property type must be Apartment, Flat, PG, or House',
      },
      required: [true, 'Property type is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, 'Rent is required'],
      min: [0, 'Rent must be a positive number'],
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit must be a positive number'],
    },
    availableFrom: {
      type: Date,
      required: [true, 'Available from date is required'],
    },
    furnishing: {
      type: String,
      enum: {
        values: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
        message: 'Furnishing status must be Furnished, Semi-Furnished, or Unfurnished',
      },
      required: [true, 'Furnishing status is required'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms cannot be negative'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Property = mongoose.model('Property', propertySchema);
export default Property;
