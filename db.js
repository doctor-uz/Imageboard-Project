var spicedPg = require("spiced-pg");
// var myurl = require("./config.json");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = () => {
    return db.query(
        `SELECT *
        FROM images`
    );
};

exports.insertImages = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [url, username, title, description]
    );
};
