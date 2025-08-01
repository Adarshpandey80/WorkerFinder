const Electrician = require("./models/electrician");

module.exports.isLoggedIn  = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You are not logged in");
        res.redirect("/login");
    } else {
        next();
    }
}


module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
       res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
      
module.exports.isownerCarpenter = async (req, res ,next) => {
  let { id } = req.params;
  id = id.trim();
 let listing  = await Carpenter.findById(id);
 if (!listing.owner.equals(currUser._id)) {
  req.flash("error", "You are not the owner of this listing");
   return  res.redirect(`/carpenter/${id}`);
 }
 next();
 }

  module.exports.isownerElectrician = async (req, res ,next) =>
    {
        let { id } = req.params;
        id = id.trim();
        let listing  = await Electrician.findById(id);
        if (!listing.owner.equals(currUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return  res.redirect(`/electrician/${id}`);
            }
            next();
            }

    module.exports.isownerPlumber = async (req, res ,next) => {
        let { id } = req.params;
        id = id.trim();
        let listing  = await Plumber.findById(id);
        if (!listing.owner.equals(currUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return  res.redirect(`/plumber/${id}`);
            }
            next();
    }






    module.exports.isreviewAuthod = async (req, res ,next) => {
  let { id , reviewId } = req.params;
  id = id.trim();
 let review  = await Review.findById(reviewId);
 if (!review.author.equals(currUser._id)) {
  req.flash("error", "You are not author of this review");
   return  res.redirect(`/carpenter/${id}`);
 }
 next();
 }

  

     module.exports.isreviewAuthod = async (req, res ,next) => {
  let { id , reviewId } = req.params;
  id = id.trim();
 let review  = await Review.findById(reviewId);
 if (!review.author.equals(currUser._id)) {
  req.flash("error", "You are not author of this review");
   return  res.redirect(`/electrician/${id}`);
 }
 next();
 }


      module.exports.isreviewAuthod = async (req, res ,next) => {
        let { id , reviewId } = req.params;
        id = id.trim();
        let  review  = await Review.findById(reviewId);
        if ( !review.author.equals(currUser._id)) {
            req.flash("error", "You are not author of this listing");
            return  res.redirect(`/plumber/${id}`);
            }
            next();
    }         