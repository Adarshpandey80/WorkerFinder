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
            type: Number,
            required: true,
        },
        
        country :{
            type: String,
            required: true,
        
        } ,
        experience : {
            type: String,
            required: true,
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
