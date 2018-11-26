const express = require("express");
const app = express();
const ca = require("chalk-animation");

var s3Url = require("./config.json");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//// do not touch!
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 4097152
    }
});

///=======do not touch

app.use(express.static("./public"));

const db = require("./db");

app.get("/kitty", (req, res) => {
    db.getImages()
        .then(response => {
            res.json(response);
        })
        .catch(function(err) {
            console.log("BLYAAAA: ", err);
        });
});

app.get("/kitty/:id", (req, res) => {
    db.getImageId(req.params.id)
        .then(response => {
            res.json(response);
            // console.log("Response: ", response);
        })
        .catch(function(err) {
            console.log("I blyat: ", err);
        });
});

app.post("/kitty/:id", (req, res) => {
    // var self = this;
    const imageId = req.params.id;

    db.submitComment(req.body.comment, req.body.commentUser, imageId)
        .then(response => {
            res.json(response);
            // console.log("Response: ", response);
        })
        .catch(function(err) {
            console.log("I blyat post: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        var url = s3Url.s3Url + req.file.filename;
        console.log("this is s3url ", s3Url.s3Url);
        db.insertImages(
            url,
            req.body.username,
            req.body.title,
            req.body.description
        ).then(response => {
            res.json(response);
            // console.log("Response: ", response);
        });
    } else {
        res.json({
            success: false
        });
    }
});

//get more images /get-moire=images/33
app.get("/get-more-images/:id", (req, res) => {
    // console.log("req.params.id is: ", req.params.id);

    var lastId = req.params.id;
    db.getMoreImages(lastId).then(images => {
        // console.log("images in get more images: ", images);
        res.json(images);
    });
});

app.listen(8080, () => ca.rainbow("listening"));
