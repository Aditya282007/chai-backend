import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config();

connectDB()
.then(()=>{
       app.on("ERROR", (error) => {
              console.error("ERROR",error);
              throw error;
       })
       app.listen(process.env.PORT||8000, () => {
              console.log(`Server is running on port ${process.env.PORT || 8000}`);
       })
})
.catch((error) => {
       console.error("MONGODB connection failed !!!",error);
});








/*
import express from "express";
const app = express();

(async () => {
       try {
              await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
              app.on("ERROR", (error) => {
                     console.error("ERROR",error);
                     throw error;
              })

              app.listen(process.env.PORT, () => {
                     console.log(`Server is running on port ${process.env.PORT}`);
              })
       }
       catch (error) {
              console.error("ERROR",error);
              throw error;
       }
})()
*/