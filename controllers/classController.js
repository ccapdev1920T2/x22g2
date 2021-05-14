const mongoose = require("mongoose");
const Class = require("../models/class-model");
const Comment = require("../models/comment-model");
const db = require("../models/db.js");

module.exports.getClass = async function(req, res) {

    var seshdetails;
    if(req.session._id)
    {
        seshdetails = {
            flag: true,
            name: req.session.name,
            _id: req.session._id,
            class: true
        };
    }
    else
    {
        seshdetails = {
            flag: false,
            class: true
        };
        
    }

    let details = await Class.findOne({lcName : req.params.className}).lean();
    if(details != null) {
        return res.render("ClassInfo", {details, seshdetails});
    }
    else {
        console.log("!=============================================!")
        console.log("Error: Class not found");
        console.log("!=============================================!")
        return res.redirect('/');
    }
}

module.exports.addClassComment = async function(req, res) {
    console.log("?---------------------------------------------?")
    console.log("adding comment to class...");
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
                Class.updateOne({lcName : req.params.className}, {$push : {Comments: newComment}}, function(error,result){});
            }
            else {
                console.log("!=============================================!")
                console.log("Cannot leave comment field empty")
                console.log("!=============================================!")
            }

            var url1 = "/class/"
            var url = url1.concat(req.params.className);
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

            var url1 = "/class/"
            var url = url1.concat(req.params.className);
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

