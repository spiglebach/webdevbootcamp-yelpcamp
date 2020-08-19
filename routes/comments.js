const 	express 		= require("express"),
		Campground 		= require("../models/campground"),
		Comment 		= require("../models/comment"),
		Middleware		= require("../middleware");
const router = express.Router({mergeParams: true});

// NEW
router.get("/new", Middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("newcomment.ejs", {camp : foundCampground});
	});
	
});

// CREATE
router.post("/", Middleware.isLoggedIn, function(req, res){
	var id = req.params.id;
	Campground.findById(id, (err, foundCamp) => {
		if (err) {
		console.log("error while finding campground for comment: " + err);
	} else {
		Comment.create(req.body.comment, (err, comment) => {
		if (err) {
			console.log("error while adding comment: " + err);
		} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save((err, savedCampground) => {
						if (err) {
							console.log("error while saving campground with comment: " + err);
						} else {
							res.redirect("/campgrounds/" + id);
						}
					});
				}
			});
		}
	});
});

// EDIT
router.get("/:commentId/edit", Middleware.checkCommentOwnership, function(req, res){
	var commentId = req.params.commentId;
	Campground.findById(req.params.id, (err, camp) => {
		Comment.findById(commentId, (err, foundComment) => {
			res.render("editcomment", {camp: camp, comment: foundComment});
		});
	});
	
});

// UPDATE
router.put("/:commentId", Middleware.checkCommentOwnership, function(req, res){
	var commentId = req.params.commentId;
	var comment = req.body.comment
	Comment.findByIdAndUpdate(commentId, comment, (err, updatedComment) => {
		res.redirect("/campgrounds/" + req.params.id);
	});
});

// DELETE
router.delete("/:commentId", Middleware.checkCommentOwnership, function(req, res){
	var commentId = req.params.commentId;
	Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
		res.redirect("/campgrounds/" + req.params.id);
	});
});

module.exports = router;