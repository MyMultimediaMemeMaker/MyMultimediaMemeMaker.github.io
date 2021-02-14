var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Meme = require('../models/memes');


/* GET home page. */
router.get('/', function(req, res, next) {
        const meme = new Meme({
            Url: req.query.url,
            Preset: req.query.preset,
            Titel: req.query.titel,
            Autor: req.query.autor,
            CreatorID: req.query.uid,
            Likes:[],
            Dislikes:[],
            Public: req.query.public

        });
        meme.save()
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err);
            });


});

module.exports = router;