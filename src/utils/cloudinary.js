import { constants } from "buffer";
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    const uploadcloudinnary = async (localfilePath) => {
        try{

            if (!localfilePath) return null

           const response = await cloudinary.uploader.upload(localfilePath,{
                resource_type: "auto",
            })

            //file has been uploaded to cloudinary successfully

            console.log("file has been uploaded to cloudinary successfully",
                response.url)

                return response;
            
        }
        catch (error) {

            fs.unlinkSync(localfilePath) //remove the locally save temporary file as the operation got failed

            return null;

        }

    }


    