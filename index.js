const express = require("express");
const app = express();
const ca = require("chalk-animation");

app.use(express.static("./public"));

const db = require("./db");

app.get("/kitty", (req, res) => {
    db.getImages()
        .then(response => {
            res.json(response);
            console.log("Response: ", response);
        })
        .catch(function(err) {
            console.log("BLYAAAA: ", err);
        });
});

app.listen(8080, () => ca.rainbow("listening"));
