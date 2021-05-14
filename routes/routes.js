const express = require('express');
const userController = require("../controllers/userController.js");
const classController = require("../controllers/classController.js");
const guideController = require("../controllers/guideController.js");
const Guide = require("../models/guide-model");

let router = express.Router();

router.get('/', function(req, res) {
    var seshdetails;
    if(req.session._id)
    {
        seshdetails = {
            flag: true,
            name: req.session.name,
            _id: req.session._id,
            type: req.session.type
        };
    }
    else
    {
        seshdetails = {
            flag: false
        };
        
    }

    let manyguides = Guide.find()

    res.render('Homepage', {manyguides, seshdetails}
    )
});

router.get('/Login', userController.getLogin);
router.post('/Login', userController.loginUser);

router.get('/logout', userController.logoutUser);

router.get('/Signup', userController.getSignup);
router.post('/Signup', userController.registerUser);

router.get('/user', userController.getUPage);
router.get('/user/:id', userController.getOtherUPage);
router.post('/user/:id/comment', userController.addcomment);

router.get('/finduser/:toFind', userController.fetchUser);

router.get('/createguide', guideController.getGuidemaker);
router.post('/createguide', guideController.addGuide)

router.get('/guide/:id', guideController.fetchGuide);
router.post('/guide/:id/like', guideController.addlike);
router.post('/guide/:id/comment', guideController.addcomment);
router.get('/guide/:id/delete', guideController.deleteguide);

router.get('/guide', guideController.getAll);

router.get("/class/:className", classController.getClass);
router.post("/class/:className", classController.addClassComment);

module.exports = router;