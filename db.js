var spicedPg = require("spiced-pg");
// var myurl = require("./config.json");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = () => {
    return db.query(
        `SELECT *
        FROM images
        ORDER BY id DESC
        LIMIT 4`
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

exports.getImageId = id => {
    return db.query(
        `SELECT i.id AS imageId, url, i.username AS username, title, description, i.created_at AS created_at, comment, c.username AS commentUser
        FROM images AS i
        LEFT JOIN comments AS c
        ON i.id = c.image_id
        WHERE i.id = $1`,
        [id]
    );
};

exports.submitComment = (comment, username, image_id) => {
    return db.query(
        `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3)
        RETURNING comment, username AS commentUser, image_id AS imageId`,
        [comment || null, username || null, image_id || null]
    );
};

//get more images

exports.getMoreImages = lastId => {
    return db
        .query(
            `SELECT *, (
                SELECT id AS lasteId  FROM images
                WHERE id = $1
                ORDER BY id DESC
            )
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 4`,
            [lastId]
        )
        .then(results => {
            return results.rows;
        });
};
