const Campground 	= require("../models/campground"),
	  Comment 		= require("../models/comment");
// all middleware goes here

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, camp) {
			if (err) {
				req.flash("error", "Camprgound not found!");
				res.redirect("back");
			} else if(!camp.author.id.equals(req.user._id)) {
				req.flash("error", "You are not authorized to do that!");
				res.redirect("back");
			} else {
				next();
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/campgrounds/" + req.params.id);
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	var commentId = req.params.commentId;
	if (req.isAuthenticated()) {
		Comment.findById(commentId, (err, foundComment) => {
			if (err) {
				req.flash("error", "Comment not found!");
				res.redirect("back");
			} else if (!foundComment.author.id.equals(req.user._id)) {
				req.flash("error", "You are not authorized to do that!");
				res.redirect("back");
			} else {
				next();
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/campgrounds/" + req.params.id);
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
};

module.exports = middlewareObj;