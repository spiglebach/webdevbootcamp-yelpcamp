const 	express 	= require("express"),
		passport 	= require('passport'),
		User 		= require("../models/user");
const router = express.Router();

router.get("/", function(req, res){
	res.render("home");
});

router.get("/register", function(req, res){
	res.render('register');
});

router.post("/register", function(req, res){
	const username = req.body.username;
	const password = req.body.password;
	var newUser = new User({username: username});
	User.register(newUser, password, (err, registeredUser) => {
		if (err) {
			req.flash("error", err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Successfully registered! Welcome " + registeredUser.username + "!");
			res.redirect("/campgrounds");
		});
	});
});

router.get("/login", function(req, res){
	res.render('login');
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){
	
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect('/');
});

module.exports = router;