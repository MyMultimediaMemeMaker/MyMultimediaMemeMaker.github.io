var express = require('express');
var router = express.Router();
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const request = require('request')

router.get('/', function(req, res, next) {
    const width = 500;
    const height = 350;
    //res.send(req.query.color1);
    const download = (url, path, callback) => {
        request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
        })
    }

    const url = req.query.url;
    const path = './image.png'

    download(url, path, () => {
        loadImage('./image.png').then(image => {

            const canvas = createCanvas(width, height);
            const context = canvas.getContext('2d');

            context.fillStyle = '#000';
            context.fillRect(0, 0, width, height);

            context.drawImage(image, 0, 0,500,350);
            var left = 250;
            var style = req.query.style1+"";
            const text1 = req.query.text1;
                context.font =style;
                context.textAlign = 'center';
                context.strokeStyle = 'black';
                context.fillStyle = req.query.color1;
                if(req.query.t1left >0){
                    left = (req.query.t1left-100)*2+250;
                }

            context.strokeText(text1,left,50)
            context.fillText(text1,left, 50)

            style = req.query.style2+"";
            const text2 = req.query.text2;
                left = 250;
                context.font = style;
                context.textAlign = 'center';
                context.strokeStyle = 'black';
                context.fillStyle = req.query.color2;
                if(req.query.t2left >0){
                    left = (req.query.t2left-100)*2+250;
                }
            context.strokeText(text2,left,185)
            context.fillText(text2, left, 185)

            style = req.query.style3+"";
            const text3 = req.query.text3;
                left=250;
                context.font = style;
                context.textAlign = 'center';
                context.strokeStyle = 'black';
                context.fillStyle = req.query.color3;
                if(req.query.t3left >0){
                    left = (req.query.t3left-100)*2+250;
                }
            context.strokeText(text3,left,320)
            context.fillText(text3, left, 320)



            const buffer = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            res.send(buffer);
        })
    })



});

module.exports = router;
