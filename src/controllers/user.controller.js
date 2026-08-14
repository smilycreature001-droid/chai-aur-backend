import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    console.log("email:", email);

    // Validation
    if (
        [fullname, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check existing user
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "User with email or username already exists"
        );
    }

    console.log(req.files);

    // Get avatar path
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    // Get cover image path
    let coverImageLocalPath;

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Upload images
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    if (!avatar) {
        throw new ApiError(
            400,
            "Avatar upload failed, please try again"
        );
    }

    // Create user
    console.log("Creating user...");

    let user;

    try {
        user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),
        });

        console.log("User created:", user._id);
    } catch (createError) {
        console.log("User.create error:", createError.message);

        throw new ApiError(500, createError.message);
    }

    // Remove sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {
    // Get data from request
    const { email, username, password } = req.body;

    // Check username/email and password
    if ((!username && !email) || !password) {
        throw new ApiError(
            400,
            "Username or email and password are required"
        );
    }

    // Find user
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Check password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } =
        await generateAccessAndRefreshToken(user._id);

    // Get logged-in user without sensitive fields
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // Cookie options
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});


const refreshAccessToken = asyncHandler(async(req,res)
=>{
    const incomingregreshtoken = req.cookies.refreshToken || req.body.refreshToken

    if(incomingrefreshToken){
        throw new ApiError(401, "unaouthorized request")
    }

   try {
    const decodedToken =  jwt.verify(
         incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
     )
 
    const user = await user.findById(decodedToken?._id)
 
     if(!user){
         throw new ApiError(401, "invalid refresh token ")
     }
 
     if(incomingRefreshToken !== user?.refreshToken){
       throw new ApiError(401,"Refresh Token is expired or used")
 
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     const{accesstoken,refreshToken}=await genarateAccesAndRefreshTokens(user._id)
 
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
         new ApiResponse(
             200,
             {accessToken,refreshToken:newRefreshToken},
             "Access Token refreshed"
         )
     )
   } catch (error) {
    throw new ApiError(401,error?.message ||"Invalid Refresh Token")
    
   }
})

export {
    registerUser,
    loginUser,
    logout,
    refreshAccessToken,
};