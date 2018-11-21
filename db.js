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

// exports.submitComment = (comment, username, image_id) => {
//     return db.query(
//         `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3)
//         RETURNING comment, username AS commentUser, created_at AS commentCreate`,
//         [comment || null, username || null, image_id]
//     );
// };

exports.getImageId = id => {
    return db.query(
        `SELECT * FROM images
        WHERE id = $1`,
        [id]
    );
};
