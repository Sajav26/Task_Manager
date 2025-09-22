import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI,{});
        console.log("MongoDb Connection Successful");
    }catch(error){
        console.error("Error: MongoDb Connection Failed", error);
        process.exit(1);
    }
};

export default connectDB;