import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
dotenv.config({
    path:"./.env"
});
const app=express();
 /*
(async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        app.on("error",(err)=>{
            console.log("Error",err);
            throw err;
        });
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch(error){
        console.log("Error",error);
        throw error;
    }

})()*/
connectDB()
.then(()=>{ 
    app.listen(process.env.port || 8000, () => {
        console.log('server is running at port: ${process.env.port}');
    })
})
.catch((err)=>{
 console.log("mongo db connection is failed !!!",err );
})



