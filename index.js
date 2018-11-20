const express = require("express");
const app = express();
const ca = require("chalk-animation");

var s3Url = require("./config.json");

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
            // console.log("Response: ", response);
        })
        .catch(function(err) {
            console.log("BLYAAAA: ", err);
        });
});

///==========from git
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        console.log("req file.filename: ", req.file.filename);
        console.log("req file: ", req.file);
        console.log("req body: ", req.body);

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

//-=============above from git

app.listen(8080, () => ca.rainbow("listening"));
