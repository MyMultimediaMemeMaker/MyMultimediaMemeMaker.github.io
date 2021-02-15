var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');


/* GET home page. */
router.get('/', function(req, res, next) {
    //Alle User aus Datenbank beziehen
    User.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });


});

module.exports = router;