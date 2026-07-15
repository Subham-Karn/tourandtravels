import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    packageName:{
        type: String,
        required: true,
        trim: true,
    },
    packageImage: {
      type:String,
      required:true,
    },
    packagePrice:{
        type: Number,
        required: true,
        trim: true,
    },
    packageDescription:{
        type: String,
        required: true,
        trim: true,
    },
    packageRating:{
        type: Number,
        required: true,
        trim: true,
    }
    
},{timestamps:true})

const Package = mongoose.model("Package", packageSchema);

export default Package;