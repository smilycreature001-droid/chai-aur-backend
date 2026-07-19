import mongoose,{Schema} from "mongoose";
import mongooseAggrigatePaginate from "mongoose-aggrigate-paginate-v2";


const vidioSchema = new Schema (

    {
       
        vidiofile:{
            type:String,
            required:true,

        },

        thumbnail:{
             type:String,
            required:true,


        },

         tittle:{
             type:String,
            required:true,

  
    },

      description:{
             type:String,
            required:true,

  
    },

    duration:{
             type:String,
            required:true,

  
    },

    views:{
             type:number,
           default: 0

  
    },

       isPublish:{
             type:Boolean,
          default:true,

  
    },

    owner:{
             type:Schema.Types.ObjectId,
            ref:"user"
  
    },

    
        timestamps:true,
    }



)

vidioSchema.plugin(mongooseAgrrigatePaginate)

export const vidio = mongoose.model("vidio",vidioSchema)