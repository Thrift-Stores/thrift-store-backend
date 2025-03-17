import mongoose from "mongoose";



const connectToDb = async () => {
    try {
        if (!process.env.MONGO_URL || !process.env.DATA_BASE_NAME) {
            console.error("Database URL OR NAME is missing. Exiting process...");
            process.exit(1); 
        }

        await mongoose.connect(process.env.MONGO_URL, {
            dbName : process.env.DATA_BASE_NAME
        });

        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectToDb;
