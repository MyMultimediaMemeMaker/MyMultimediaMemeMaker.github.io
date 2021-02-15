var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Meme = require('../models/memes');


/* GET home page. */
router.get('/', function(req, res, next) {
    //ID aus Anfrage filtern
    //Meme anhand von Meme-ID finden und entfernen
    var memeid = req.query.id+"";
    Meme.findByIdAndDelete(memeid, function(err, result){

        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }

    });


});

module.exports = router;