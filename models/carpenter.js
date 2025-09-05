const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require("./review.js")
 
const carpenterSchema = new Schema({

    image: {
       url :String,
       filename: String,
       
   },
   name:
   {
       type: String,
         required: true,
      
   } ,

    contact : {
        type: Number,
        required: true,
        unique: true,

       
    } ,
      location : {
        type: String,
        required: true,
       
        },
    rate:
    {
        type: String,
        required: true,
    },
    
    country :{
        type: String,
        required: true,
    
    } ,
    experience : {
        type: String,
        required: true,
       
    } ,
    reviews :[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

carpenterSchema.post ("findOneAndDelete" ,async (carpenter)=> {
    if (carpenter) {
        await Review.deleteMany({ _id: { $in: carpenter.reviews } });
        }
        });




 const Carpenter = mongoose.model('Carpenter', carpenterSchema);
 module.exports = Carpenter;  //export the model
