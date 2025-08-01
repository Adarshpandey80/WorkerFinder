const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');  // Added import for Review model

const electricianSchema = new Schema({
   
     image: {
       url :String,
       filename: String,
   },
   name:
   {
       type: String,
      
   } ,

    contact : {
        type: String,
       
    } ,
      location : {
        type: String,
       
        },
    rate:
    {
        type: String,
    },
    
    country :{
        type: String,
    
    } ,
    experience : {
        type: String,
    },
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

electricianSchema.post("findOneAndDelete", async (electrician) => {
  if (electrician) {
    await Review.deleteMany({ _id: { $in: electrician.reviews } });
  }
});

const Electrician = mongoose.model('Electrician', electricianSchema);
module.exports = Electrician;  //export the model
