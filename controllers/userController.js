const mongoose = require("mongoose");
const User = require("../models/user-model");
const Guide = require("../models/guide-model")
const bcrypt = require('bcrypt');
const session = require("express-session");
const db = require('../models/db.js');

module.exports.getLogin = async function(req, res){
    try{
        res.render('Login', {
         });
    }catch(err){
        res.status(500).send("error");
        console.log("!=============================================!")
        console.log(err);
        console.log("!=============================================!")
    }
}

module.exports.getSignup = async function(req, res){
    try{
        res.render('Signup', {
         });
    }catch(err){
        res.status(500).send("error");
        console.log("!=============================================!")
        console.log(err);
        console.log("!=============================================!")
    }
}

module.exports.getUPage = async function(req, res){
    var url1 = "/user/"
    var url = url1.concat(req.session._id)

    res.redirect(url)
}

module.exports.getOtherUPage = async function(req, res) {
	var seshdetails;
    var sameperson;
    var projection = 'userName _id Comments comms Admin';

    if(req.session._id)
    {
        if(req.session._id == req.params.id) {
            sameperson = true
        }
        else {
            sameperson = false
        }
        if(req.session.admin) {
            seshdetails = {
                flag: true,
                name: req.session.name,
                _id: req.session._id,
                admin: true,
                same: sameperson
            };
        }
        else {
            seshdetails = {
                flag: true,
                name: req.session.name,
                _id: req.session._id,
                admin: false,
                same: sameperson
            };
        }
    }
    else
    {
        seshdetails = {
            flag: false
        };
        
    }

    let details = await User.findOne({_id: req.params.id}, projection).lean();
    let userGuides = await Guide.find({author: details.userName}).lean();

    if(details != null) {

    	try{
    		res.render('User', {details, userGuides, seshdetails})
    	}
    	catch {

    	}
    }
}

module.exports.loginUser = async function(req, res){
    var username = req.body.username;
    var password = req.body.psw;
    var confirm = false;

    db.findOne(User, {userName: username}, '', function(result){

        var user = {
            userName: result.userName,
            _id: result._id,
            Admin: result.Admin
        };
        console.log("?---------------------------------------------?")
        console.log("Found user");
        console.log("?---------------------------------------------?")
        
        bcrypt.compare(password, result.password, function(err, equal){
            if(equal){
                console.log('Pass confirmed');
                req.session._id = user._id;
                req.session.name = user.userName;
                if(result.Admin) {
                    req.session.admin = true
                    console.log("?---------------------------------------------?")
                    console.log("admin login successful");
                    console.log("?---------------------------------------------?")
                }
                else {
                    req.session.admin = false
                }
                var details = {
                    flag: true,
                    name: req.session.name,
                };

                console.log("?---------------------------------------------?")
                console.log("user login successful");
                console.log("?---------------------------------------------?")

                var url1 = "/user/"
                var url = url1.concat(user._id)

                res.redirect(url);
                confirm = true;
            } else {
                var details = {
                    flag: false,
                    error: `username and/or Password is incorrect.`
                };
                console.log("!=============================================!")
                console.log("Wrong password")
                console.log("!=============================================!")
                res.render('login', details);
                confirm = false;
            }
        });
    });
}


module.exports.registerUser = async function(req, res){
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1){
                return res.status(422).json({
                    message: 'user already exists'
                });
            } else {
                bcrypt.hash(req.body["psw"], 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                        console.log(err);
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            userName: req.body["username"],
                            email: req.body["email"],
                            password: hash,
                            Admin: false,
                            Comments: [],
                            likes:[],
                            comms: 0
                        });
                        user
                        .save()
                        
                        .then(result => {
                            //res.status(201).json({
                                 //message: 'User created'
                            //});
                            return res.redirect('/Login');
                        })
                    }
                });
            }
        })
}

module.exports.logoutUser = async function(req, res){
    req.session.destroy(function(err) {
        if(err) throw err;
        res.redirect('/');
    });

}

module.exports.fetchUser = async function(req, res) {
    let details = await User.findOne({userName: req.params.toFind})

    if(details != null) {
        var url1 = "/user/"
        var url = url1.concat(details._id)

        res.redirect(url)
    }
    else {
        console.log("!=============================================!")
        console.log("FetchUser: User not found")
        console.log("!=============================================!")
    }
}

module.exports.addcomment = async function(req, res) {
    console.log("adding comment to user...");
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
                
                console.log(newComment);
                User.updateOne({_id : req.params.id}, {$push : {Comments: newComment}}, function(error,result){});
            }
            else {
                console.log("!=============================================!")
                console.log("Cannot leave comment field empty")
                console.log("!=============================================!")
            }

            var url1 = "/user/"
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
            var url1 = "/user/"
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