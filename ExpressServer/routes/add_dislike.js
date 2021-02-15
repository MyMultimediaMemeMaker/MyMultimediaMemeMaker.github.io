var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Meme = require('../models/memes');


/* GET home page.*/
router.get('/', function(req, res, next) {
    //Meme basierend auf übergebener Meme-ID finden 
    //Dislikes des Memes mit ID des übergebenen Dislikers übergeben 
    Meme.findByIdAndUpdate(req.query.memeid, {$push: {Dislikes: req.query.likeid}}, function(err, result){

        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }

    })
})
module.exports = router;
