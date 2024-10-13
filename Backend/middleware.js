module.exports.isLoggedin = (req , res , next) =>{
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.flash("error", "Please log in first");
        return res.redirect("/login");
}
    next();
}