const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plumberSchema = new Schema({
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

plumberSchema.post("findOneAndDelete", async (plumber) => {
  if (plumber) {
    await Review.deleteMany({ _id: { $in: plumber.reviews } });
  }
});

 const Plumber= mongoose.model('Plumber', plumberSchema);  //export th

 module.exports = Plumber;  //export the model
