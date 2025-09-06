import mongoose from "mongoose";
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const db=mongoose.connection;
export default db;
