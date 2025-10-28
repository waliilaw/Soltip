import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { UserRoleEnum } from "../types/user.types";

/**
 * User Status Enum
 */
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING = "pending",
  BANNED = "banned",
  LOCKED = "locked",
}

/**
 * Onboarding Step Enum
 */
export enum OnboardingStep {
  USERNAME = "username",
  PROFILE = "profile",
  AVATAR = "avatar",
  CUSTOMIZE = "customize",
  COMPLETE = "complete",
}

/**
 * Interface for Social Links
 */
export interface ISocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
  tiktok?: string;
  website?: string;
  discord?: string;
  github?: string;
}

/**
 * Interface for Tip Option
 */
export interface ITipOption {
  amount: number;
  label?: string;
  isDefault?: boolean;
}

/**
 * Interface for Profile Customization
 */
export interface IProfileCustomization {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  buttonStyle?: string;
  customCss?: string;
  showTipCounter?: boolean;
  enableCustomMessage?: boolean;
  tipOptions?: ITipOption[];
  minimumTipAmount?: number;
  allowCustomAmounts?: boolean;
  receiveNotes?: boolean;
}

/**
 * Interface for User Permission
 */
export interface IPermission {
  slug: string;
  module: string;
}

/**
 * Interface for User document
 */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  status: UserStatus;
  role: UserRoleEnum; // Primary role (for categorization)
  permissions: string[]; // Direct permission slugs
  socialLinks?: ISocialLinks;
  customization?: IProfileCustomization;
  onboardingCompleted: boolean;
  currentOnboardingStep?: OnboardingStep;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  failedLoginAttempts?: number;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  // circle
  circleWalletId?: string;
  depositWalletAddress?: string; // Circle-generated deposit wallet address
  withdrawalWalletAddress?: string; // User-provided withdrawal wallet address
  // refresh token management
  refreshTokens?: string[]; // Store active refresh token hashes
  refreshTokensExpiry?: Date[]; // Store expiration dates for refresh tokens
  // methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(permissionSlug: string): boolean;
}

/**
 * Schema for User model
 */
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    displayName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
    },
    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      default: UserRoleEnum.CREATOR,
    },
    permissions: [
      {
        type: String,
        trim: true,
      },
    ],
    socialLinks: {
      twitter: String,
      instagram: String,
      youtube: String,
      twitch: String,
      tiktok: String,
      website: String,
      discord: String,
      github: String,
    },
    customization: {
      primaryColor: String,
      backgroundColor: String,
      fontFamily: String,
      buttonStyle: String,
      customCss: String,
      showTipCounter: { type: Boolean, default: true },
      enableCustomMessage: { type: Boolean, default: true },
      tipOptions: [
        {
          amount: { type: Number, required: true },
          label: String,
          isDefault: { type: Boolean, default: false },
        },
      ],
      minimumTipAmount: { type: Number, default: 1 },
      allowCustomAmounts: { type: Boolean, default: true },
      receiveNotes: { type: Boolean, default: true },
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    currentOnboardingStep: {
      type: String,
      enum: Object.values(OnboardingStep),
      default: OnboardingStep.USERNAME,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    verificationCode: String,
    verificationCodeExpires: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    circleWalletId: { type: String, unique: true, default: null },
    depositWalletAddress: {
      type: String,
      trim: true,
      unique: true,
    },
    withdrawalWalletAddress: {
      type: String,
      trim: true,
    },
    refreshTokens: [
      {
        type: String,
        trim: true,
      },
    ],
    refreshTokensExpiry: [
      {
        type: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ depositWalletAddress: 1 });
UserSchema.index({ withdrawalWalletAddress: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isFeatured: 1, status: 1 });

// Pre-save hook to hash password
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next();

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  console.log("Comparing password:", candidatePassword, this.password);
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has a specific permission
UserSchema.methods.hasPermission = function (permissionSlug: string): boolean {
  return this.permissions.includes(permissionSlug);
};

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
