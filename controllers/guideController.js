const mongoose = require("mongoose");
const Guide = require("../models/guide-model");
const User = require("../models/user-model");

module.exports.fetchGuide = async function(req, res) {
	var seshdetails;
    if(req.session._id)
    {
        if(req.session.admin) {
            seshdetails = {
                flag: true,
                name: req.session.name,
                _id: req.session._id,
                admin: true
            };
        }
        else {
            seshdetails = {
                flag: true,
                name: req.session.name,
                _id: req.session._id,
                admin: false
            };
        }
    }
    else
    {
        seshdetails = {
            flag: false
        };
        
    }

    let guide = await Guide.findOne({_id: req.params.id}).lean();
    let authordetails = await User.findOne({userName: guide.author}, "userName _id").lean();

    req.session.page = req.params.id

    try {
    	if(guide != null) {
    		res.render("guide", {guide, guide:guide, seshdetails, authordetails});
    	}
    	else {
            console.log("!=============================================!")
    		console.log("Error: guide not found");
            console.log("!=============================================!")
			return res.redirect('/');
    	}
    }
    catch(err) {
    	res.status(500).send("error")
        console.log("!=============================================!")
    	return console.log(err)
        console.log("!=============================================!")
    }
}

module.exports.getGuidemaker = async function(req, res) {
	var seshdetails;
    if(req.session._id)
    {
        seshdetails = {
            flag: true,
            name: req.session.name,
            _id: req.session._id
        };
    }
    else
    {
        seshdetails = {
            flag: false
        };
        
    }
    
    try{
        res.render('Createguide', 
            { seshdetails }
         );
    }catch(err){
        res.status(500).send("error");
        console.log("!=============================================!")
        console.log(err);
        console.log("!=============================================!")
    }
}

module.exports.addGuide = async function(req, res){
    console.log("?---------------------------------------------?")
    console.log("adding guide...");
    console.log("?---------------------------------------------?")
    if(req.session._id){
        try{
        	let today = new Date();
        	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let guide = new Guide({
                _id: new mongoose.Types.ObjectId(),
                title: req.body["guidetitle"],
                tagline: req.body["guidetagline"],
                author: req.session.name,
                content: req.body["guidetext"],
                datePosted: date,
                likes: 0,
                Comments: [],
                Category: req.body["guidecategory"]
            });
            await guide.save();
            var urlpart = "/guide/"
            var url = urlpart.concat(guide._id)

            res.redirect(url)
            }
            catch(err){
                console.log("!=============================================!")
                console.log(err);
                console.log("!=============================================!")
                res.status(500).send("Unable to create guide");
            }
    } 
    else {
        try{

            }
            catch(err){
                console.log("!=============================================!")
                console.log(err);
                console.log("!=============================================!")
                res.status(500).send("Unable to create guide at this time");
            }
    }
   
}

module.exports.addlike = async function(req, res) {
    console.log("?---------------------------------------------?")
    console.log("adding like...")
    console.log("?---------------------------------------------?")

    if(req.session._id) {
        let userLikes = await User.findOne({_id: req.session._id}, "likes")
        let guide = await Guide.findOne({_id: req.session.page})

        if(userLikes.likes.includes(req.session.page) || req.session.name == guide.author) {
            console.log("!=============================================!")
            console.log("You have already liked this page or you cannot like your own page")
            console.log("!=============================================!")
        }
        else {
            var update = {$inc: {likes: 1}}

            Guide.updateOne({_id: req.session.page}, update, function(error, result){});

            User.updateOne({userName: guide.author}, {$inc: {comms: 1}}, function(error, result){});
            User.updateOne({_id: req.session._id}, {$push: {likes: req.session.page}}, function(error, result){})
        }
    }
    else {
        console.log("!=============================================!")
        console.log("You must be logged in to commend a guide")
        console.log("!=============================================!")
    }
    

    var urlpiece = "/guide/"
    var url = urlpiece.concat(req.session.page)

    res.redirect(url)
}

module.exports.addcomment = async function(req, res) {
    console.log("?---------------------------------------------?")
    console.log("adding comment to guide...");
    console.log("?---------------------------------------------?")
    if(req.session._id){
        try{
            if(req.body["writecom"]) {
                let today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

                var newComment = {
                    author: req.session.name,
                    content: req.body["writecom"],
                    datePosted: date
                };
            
                Guide.updateOne({_id : req.params.id}, {$push : {Comments: newComment}}, function(error,result){});
            }
            else {
                console.log("!=============================================!")
                console.log("Cannot leave comment field empty")
                console.log("!=============================================!")
            }

            var url1 = "/guide/"
            var url = url1.concat(req.params.id);
            res.redirect(url);
        }
        catch(err){
            console.log("!=============================================!")
            console.log(err);
            console.log("!=============================================!")
            res.status(500).send("Unable to make comment");
        }
         
    } else {
        try{
            console.log("!=============================================!")
            console.log("You must be logged in to comment")
            console.log("!=============================================!")

            var url1 = "/guide/"
            var url = url1.concat(req.params.id);
            res.redirect(url);
        }
        catch(err){
            console.log("!=============================================!")
            console.log(err);
            console.log("!=============================================!")
            res.status(500).send("Comment error");
        }
    }
}

module.exports.deleteguide = async function(req, res) {
    console.log(req.session.admin)

    if(req.session.admin) {
        console.log("?---------------------------------------------?")
        console.log("Deleting guide...")
        console.log("?---------------------------------------------?")

        try {
            Guide.deleteOne({_id: req.params.id}, function(error, result){
                if(!error) {
                    console.log(result)
                }
            })
        }
        catch {

        }
    }
    else {
        console.log("!=============================================!")
        console.log("Cannot delete guide")
        console.log("!=============================================!")
    }

    res.redirect('/')
}

module.exports.getAll = async function(req, res) {
    var seshdetails;
    if(req.session._id)
    {
        seshdetails = {
            flag: true,
            name: req.session.name,
            _id: req.session._id
        };
    }
    else
    {
        seshdetails = {
            flag: false
        };
        
    }

    let combatGuides = await Guide.find({Category: "combat"}, "title tagline author likes").lean()
    let menuGuides = await Guide.find({Category: "menus"}, "title tagline author likes").lean()
    let generalGuides = await Guide.find({Category: "general"}, "title tagline author likes").lean()
    let miscGuides = await Guide.find({Category: "misc"}, "title tagline author likes").lean()

    res.render("guidelist", {combatGuides, menuGuides, generalGuides, miscGuides, seshdetails})
}