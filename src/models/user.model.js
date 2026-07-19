import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userScheam.pre("save",async function (next){
    if(this.isModifyed("pasword"))return next();

    this.password=bcrypt.hash(this.password)
    next()
    

})

userSchema.method.ispasswordCorrect=async function
(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.genarateAccesssToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fulname:this.fullname,
        },

        process,eventNames.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }

    )
}
userSchema.methods.genarateAccesssToken = function(){}

 return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fulname:this.fullname,
        },

        process,eventNames.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }

    )

   

export const User = mongoose.model("User", userSchema);