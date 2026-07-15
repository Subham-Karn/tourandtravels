import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    resetToken: {type: String , required:false},

    resetTokenExpire: {type:Date , required:false},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;