const 	express 		= require("express"),
		Campground 		= require("../models/campground"),
		Middleware		= require("../middleware");
const router = express.Router();

// INDEX
router.get("/", function(req, res){
	Campground.find({}, function(err, camps) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds",
				{
					camps: camps,
				});
		}
	});
});

// NEW
router.get("/new", Middleware.isLoggedIn, function(req, res){
	res.render("new");
});

// CREATE
router.post("/", Middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	Campground.create(
		{
			name: name,
			image: image,
			description: description,
			author: {
				id: req.user._id,
				username: req.user.username
			}
		}, (err, newCampground) => {
			if (err) {
				console.error(err);
			} else {
				req.flash("success", "Successfully created a campground!");
				res.redirect("/campgrounds");
			}
	});
});

// SHOW
router.get("/:id", function(req, res){
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err, camp) {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {camp: camp});
		}
	});
});

// EDIT
router.get("/:id/edit", Middleware.checkCampgroundOwnership, function(req, res){
	var id = req.params.id;
	Campground.findById(id, function(err, camp) {
		res.render("edit", {camp: camp});
	});
});

// UPDATE
router.put("/:id", Middleware.checkCampgroundOwnership, function(req, res){
	var id = req.params.id;
	var campground = req.body.campground;
	Campground.findByIdAndUpdate(id, campground, function(err, editedCampground) {
		req.flash("success", "Campground successfully updated!");
		res.redirect("/campgrounds/" + id);
	});
});


// DESTROY
router.delete("/:id", Middleware.checkCampgroundOwnership, function(req, res){
	var id = req.params.id;
	Campground.findByIdAndDelete(id, function(err, deletedCampground) {
		req.flash("success", "Campground deleted!");
		res.redirect("/campgrounds");
	});
});

module.exports = router;