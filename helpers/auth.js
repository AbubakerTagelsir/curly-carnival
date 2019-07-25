module.exports = {
    ensureAuthenticated: function (req,res,next){
        console.log("Check Auth!");
        
        if(req.isAuthenticated()){
            console.log("Secure!");
            
            return next();
        }
        console.log("Not!");
        
        req.flash("error_msg", "Not Authorized");
        res.redirect('/users/login');
    }
}