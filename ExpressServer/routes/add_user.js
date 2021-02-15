var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');


/* GET home page. */
router.get('/', function(req, res, next) {
    //Neues User-Object nach Meme-Model erstellen
    const user = new User({
        Name: req.query.name,
        Email: req.query.mail,
        Password: req.query.pw,
        IsUser: true,
        IsAdmin: req.query.admin,

    });
    //Erstellten User der Datenbank hinzufügen
    user.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });


});

module.exports = router;