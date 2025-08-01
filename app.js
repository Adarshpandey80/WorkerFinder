if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}


 



const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Plumber = require('./models/plumber.js');
const Carpenter = require('./models/carpenter.js');
const Electrician = require('./models/electrician.js');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require('./models/review.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
 const LocalStrategy = require('passport-local');
 const  User = require('./models/user.js');
const {isLoggedIn, saveRedirectUrl, isownerCarpenter, isownerPlumber, isownerElectrician, isreviewAuthod} = require('./middleware.js');
const multer = require('multer');
const {storage} = require("./cloudConfig.js");
const upload = multer({ storage });



app.use(session({secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires : Date.now() + 7 *24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); // serializeUser is a method in passport.js to store user data in session
passport.deserializeUser(User.deserializeUser()); // deserializeUser is a method in passport.js to delete user data from session




app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user; // make the user object available to all templates .locals use for excess of data anywhere 
  
  next();
})




async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/workerfinder');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
main();

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(ejsMate());



// authentication routes
app.get ("/signup" , (req,res)=>{
  res.render("users/signup");
})
app.get("/login" , (req,res)=>{
  res.render("users/login");
  })


app.post("/signup" ,  async(req,res)=>{
  try {
  const {username , password , email} = req.body;
  const newUser = new User({username , email });
  const registeredUser = await User.register(newUser , password);
  req.login(registeredUser , (err)=>{
    if(err) {
      return next(err);
      }
      req.flash('success' , 'Welcome to worker finder');
      res.redirect("/home");
      });

    }
  catch (err) {
    req.flash('error' , err.message);
    res.redirect('/signup');
    }

})


app.post("/login"  ,
  saveRedirectUrl,
   passport.authenticate("local" ,
    { failureRedirect: "/login" , 
      failureFlash: true ,
}),
async (req,res)=>{
   req.flash("success" , "Welcome to WorkerFinder!");
   const redirectUrl = res.locals.redirectUrl || "/home";
   delete req.session.redirectUrl;
   res.redirect(redirectUrl);
 })


 // logout route
 app.get("/logout" , (req,res , next)=>{
  req.logout((err) =>{
    if (err) {
    return  next(err);
    }
    req.flash("success" , "Logged out!");
    res.redirect("/home");
  }) ;
  
    });


//index page

app.get("/carpenter" , isLoggedIn,
 
    async (req,res)=>{
 
  const location = req.query.location;
  let allcarpenter;
  if(location){
    allcarpenter =  await Carpenter.find({ location: location });
  } else {
    allcarpenter =  await  Carpenter.find({});
  }
  res.render("listings/carpenter" , { allcarpenter})
})



app.get("/electrician" , isLoggedIn,  async (req,res)=>{
  const location = req.query.location;
  let allelectrician;
  if(location){
    allelectrician =  await Electrician.find({ location: location });
  } else {
    allelectrician =  await  Electrician.find({});
  }
  res.render("listings/electrician" , { allelectrician})

})

app.get("/plumber" , isLoggedIn,  async (req,res)=>{
  const location = req.query.location;
  let allplumber;
  if(location){
    allplumber =  await Plumber.find({ location: location });
  } else {
    allplumber =  await Plumber.find({});
  }
  res.render("listings/plumber" , { allplumber})
});

//show page

app.get("/carpenter/:id", async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const carpenter = await Carpenter.findById(id).populate({ 
    path:"reviews",
     populate:{ path: "author"},
    })
    .populate("owner");

  res.render("listings/showcarpenterdata", { listing: carpenter });
});

app.get("/electrician/:id", async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const electrician = await Electrician.findById(id).populate("reviews");
  
  res.render("listings/showelectriciandata", { listing: electrician });
});

app.get("/plumber/:id", async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const plumber = await Plumber.findById(id).populate("reviews");

  res.render("listings/showplumberdata", { listing: plumber });
});

//  new listing

app.get("/formcarpenter",  
  isLoggedIn,
 
  (req, res) => {
  res.render("listings/formcarpenter");
}
);
app.get("/formelectrician", isLoggedIn, (req, res) => {
  res.render("listings/formelectrician");
}
);
app.get("/formplumber", isLoggedIn, (req, res) => {
  res.render("listings/formplumber");
}
);

app.post("/formcarpenter",
    upload.single("image"),
   async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
  const {image, name,contact, rate, location, country,experience } = req.body;
  const newCarpenter = new Carpenter({
    image,
    name,
    contact,
    rate,
    location,
    country,
    experience,
  });
  newCarpenter.image = {url , filename}; 
  await newCarpenter.save();
  req.flash("success", "You registered as carpenter!");
  
  console.log("Carpenter listing saved");
  res.redirect("/home");
  
}
);
app.post("/formelectrician",
 upload.single("image"),
   async (req, res) => {
     let url = req.file.path;
    let filename = req.file.filename;
  const {image, name,contact, rate, location, country,experience } = req.body;
  const newElectrician = new Electrician({
    image,
    name,
    contact,
    rate,
    location,
    country,
    experience,
  });
  newElectrician.image = {url , filename};
  await newElectrician.save();
  req.flash("success", "You registered as electrician!");
  console.log("electrician listing saved");
  res.redirect("/home");
  
}
);
app.post("/formplumber", 
  upload.single("image"),
  async (req, res) => {
     let url = req.file.path;
    let filename = req.file.filename;
  const {image, name,contact, rate, location, country,experience } = req.body;
  const newPlumber = new Plumber({
    image,
    name,
    contact,
    rate,
    location,
    country,
    experience,
  });
  newPlumber.image = {url , filename};
  await newPlumber.save();
  req.flash("success", "You registered as plumber!");
  console.log("Plumber listing saved");
  res.redirect("/home");
  
}
);


// edit page


app.get("/carpenter/:id/editcarpenter", 
    isLoggedIn,
    isownerCarpenter,
   async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const carpenter = await Carpenter.findById(id);
  res.render("listings/editcarpenter", { listing: carpenter });
});
app.get("/electrician/:id/editelectrician",   isLoggedIn,
  isownerElectrician,
   async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const electrician = await Electrician.findById(id);
  res.render("listings/editelectrician", { listing: electrician });
}
);
app.get("/plumber/:id/editplumber",   isLoggedIn, isownerPlumber,
   async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const plumber = await Plumber.findById(id);
  res.render("listings/editplumber", { listing: plumber });
}
);


//update page
app.put("/carpenter/:id",   isLoggedIn,
  isownerCarpenter,
   async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const { image, name, contact, rate, location, country, experience } = req.body;
  const updatedCarpenter = await Carpenter.findByIdAndUpdate(id, { ...req.body});
   req.flash("success", "You updated your profile!");
  
  res.redirect(`/carpenter/${id}`);
});

app.put("/electrician/:id",   isLoggedIn,  isownerElectrician,
  async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const { image, name, contact, rate, location, country, experience } = req.body;
  const updatedElectrician = await Electrician.findByIdAndUpdate(id, { ...req.body});
  req.flash("success", "You updated your profile!");
  console.log("Electrician listing updated");
  res.redirect(`/electrician/${id}`);
}
);
app.put("/plumber/:id",   isLoggedIn, isownerPlumber, async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const { image, name, contact, rate, location, country, experience } = req.body;
  const updatedPlumber = await Plumber.findByIdAndUpdate(id, { ...req.body});
  req.flash("success", "You updated your profile!");
  console.log("Plumber listing updated");
  res.redirect(`/plumber/${id}`);
}
);

// delete page
app.delete("/carpenter/:id",   isLoggedIn,  isownerCarpenter,
   async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const deletedCarpenter = await Carpenter.findByIdAndDelete(id);
  req.flash("success", "You deleted your profile!");
  console.log("Carpenter listing deleted");
  res.redirect("/home");
});


app.delete("/electrician/:id",   isLoggedIn,   isownerElectrician,
  async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const deletedElectrician = await Electrician.findByIdAndDelete(id);
  req.flash("success", "You deleted your profile!");
  console.log("Electrician listing deleted");
  res.redirect("/home");
}
);


app.delete("/plumber/:id",   isLoggedIn,  isownerPlumber,
   async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const deletedPlumber = await Plumber.findByIdAndDelete(id);
  req.flash("success", "You deleted your profile!");
  console.log("Plumber listing deleted");
  res.redirect("/home");
}
);

// review post route


app.post("/carpenter/:id/reviews", isLoggedIn, async (req, res) =>
  {
    
  let listing = await Carpenter.findById(req.params.id);
  let newReview = new Review(req.body.review)
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save(); 
  await listing.save();

    console.log("Review added");
    req.flash("success", "You added a review!");
    res.redirect(`/carpenter/${req.params.id}`);
    })

app.post("/electrician/:id/reviews", isLoggedIn, async (req, res) => {
  let listing = await Electrician.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  console.log("Electrician review added");
  req.flash("success", "You added a review!");
  res.redirect(`/electrician/${req.params.id}`);
});

app.post("/plumber/:id/reviews", isLoggedIn, async (req, res) => {
  let listing = await Plumber.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  console.log("Plumber review added");
  req.flash("success", "You added a review!");
  res.redirect(`/plumber/${req.params.id}`);
});

//delete review route 

app.delete("/carpenter/:id/reviews/:reviewId", isLoggedIn,  isreviewAuthod,
  async( req,res)=>{
  let {id, reviewId} = req.params;
  await Carpenter.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  console.log("Review deleted");
  res.redirect(`/carpenter/${id}`);
})

app.delete("/electrician/:id/reviews/:reviewId", isLoggedIn,  isreviewAuthod,
  async (req, res) => {
  let { id, reviewId } = req.params;
  await Electrician.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  console.log("Electrician review deleted");
  res.redirect(`/electrician/${id}`);
});

app.delete("/plumber/:id/reviews/:reviewId", isLoggedIn,  isreviewAuthod,
   async (req, res) => {
  let { id, reviewId } = req.params;
  await Plumber.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  console.log("Plumber review deleted");
  res.redirect(`/plumber/${id}`);
});



// app.get("/pulmber" , async (req , res) => {
//   let sampellisting = new Pulmber({
//     name: "John Doe",
//     rate : 100,
//     location : "New York",
//     country : "USA",
//     });
//     await sampellisting.save();
//     console.log("sample was saved");
//     res.send("sample was saved");
//   });

//   app.get("/carpenter" , async (req , res) => {
//     let carpenterlisting = new Carpenter({
//       name: "John Doe",
//       rate : 100,
//       location : "New York",
//       country : "USA",
//       });
//       await carpenterlisting.save();
//       console.log("sample was saved");
//       res.send("sample was saved");
//       });
       

//       app.get("/electrician" , async (req , res) => {
//         let electricianlisting = new Electrician({
//           name: "John Doe",
//           rate : 100,
//           location : "New York",
//           country : "USA",
//           });
//           await electricianlisting.save();
//           console.log("sample was saved");
//           res.send("electrician data save");
          
//       })




app.get("/home", (req, res) => {
  res.render("listings/home");
});

app.get("/about", (req, res) => {
  res.render("about");
});
app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})

