import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;
const connectDb = async () =>{
  if(!mongoUri){
    throw new Error("Mongo uri is not provided or Wrong Mongo URI Prover please check it.");
  }
  try {
    await mongoose.connect(mongoUri);
    console.log("Database Connected Successfully.");
  } catch (error) {
    console.error("Database Connection Error: " , error?.message);
  }

}

export default connectDb;