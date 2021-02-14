var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Meme = require('../models/memes');


/* GET home page.*/
router.get('/', function(req, res, next) {

    Meme.find({Preset: true})
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });


});

module.exports = router;
