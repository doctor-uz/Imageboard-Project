(function() {
    //all of our vue code will go here
    Vue.component("some-component", {
        template: "#my-template",

        props: ["imageId"],

        data: function() {
            return {
                img: {
                    created_at: "",
                    description: "",
                    title: "",
                    url: "",
                    username: ""
                },
                comment: "",
                commentUser: "",
                comments: [],
                next_id: 0,
                prev_id: 0
            };
        },

        watch: {
            imageId: function() {
                var self = this;
                console.log("watcher runnig!!");
                axios
                    .get("/kitty/" + self.imageId)
                    .then(function(resp) {
                        console.log("Response data: ", resp);
                        if (resp.data.rowCount > 0) {
                            var next_id = resp.data.rows[0].next_id;
                            var prev_id = resp.data.rows[0].prev_id;
                            if (next_id) {
                                self.next_id = next_id;
                            } else {
                                self.next_id = 0;
                            }
                            if (prev_id) {
                                self.prev_id = prev_id;
                            } else {
                                self.prev_id = 0;
                            }
                            self.image = resp.data.rows[0];
                            self.comments = resp.data.rows;
                        } else {
                            location.hash = "";
                            self.$emit("close-component");
                        }
                    })
                    .catch(err => {
                        console.log("error while getting image: ", err);
                    });
                //get image and comment for new imageId and put in data i
            }
        },

        mounted: function() {
            // console.log("this of vue ", this.imageId);
            //it should be number which is ID
            var self = this;
            axios
                .get("/kitty/" + this.imageId)
                .then(function(resp) {
                    // console.log("this is Resp: ", resp);
                    if (resp.data.rowCount > 0) {
                        var next_id = resp.data.rows[0].next_id;
                        var prev_id = resp.data.rows[0].prev_id;
                        if (next_id) {
                            self.next_id = next_id;
                        }
                        if (prev_id) {
                            self.prev_id = prev_id;
                        }
                        self.img.created_at = resp.data.rows[0].created_at;
                        self.img.description = resp.data.rows[0].description;
                        self.img.title = resp.data.rows[0].title;
                        self.img.url = resp.data.rows[0].url;
                        self.img.username = resp.data.rows[0].username;
                        self.comments = resp.data.rows;
                    } else {
                        location.hash = "";
                        self.$emit("close-component");
                    }
                })
                .catch(err => {
                    console.log("error while getting image: ", err);
                });
        },

        methods: {
            handleClick: function() {
                // console.log("clicked!!!");
            },
            closeComponent: function() {
                this.$emit("close-the-component");
                // console.log("x clicked");
            },
            postComment: function(e) {
                e.preventDefault();
                var self = this;
                var formData = {
                    comment: this.comment,
                    commentUser: this.commentUser
                };
                axios
                    .post("/kitty/" + this.imageId, formData)
                    .then(function(resp) {
                        self.comments.unshift(resp.data.rows[0]);
                    })
                    .catch(err => {
                        console.log("Post comment ERROR: ", err);
                    });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            images: [],

            imageId: location.hash.slice(1) || 0,

            showComponent: false,

            form: {
                title: "",
                description: "",
                username: "",
                file: null
            },

            moreButton: true
        },

        mounted: function() {
            var self = this;

            window.addEventListener("hashchange", function() {
                // console.log("hash has changed", location.hash.slice(1));
                self.imageId = location.hash.slice(1);
                //if imgae is not found, show message image is not exists
                //shouldnt break my code
            });

            axios
                .get("/kitty")
                .then(function(resp) {
                    var imagesArrayFromServer = resp.data.rows;
                    self.images = imagesArrayFromServer;
                    // console.log(
                    //     "res.data.rows.length: ",
                    //     resp.data.rows.length
                    // );
                    if (resp.data.rows.length) {
                        self.moreButton = true;
                    }
                })
                .catch(err => {
                    console.log("error while getting images: ", err);
                });

            // axios.post("")
        }, //mounted ends here

        //every function thet runs in response to an event
        methods: {
            getMoreImages: function() {
                // console.log("get images running!!!!");

                var lastId = this.images[this.images.length - 1].id;
                var self = this;
                //GET /get-more-images/6
                axios.get("/get-more-images/" + lastId).then(function(resp) {
                    self.images.push.apply(self.images, resp.data);

                    var lastId = self.images[self.images.length - 1].id;

                    if (lastId == 1) {
                        self.moreButton = false;
                    }
                });
            },

            toggleComponent: function(e) {
                this.imageId = e.target.id;
                // console.log("this is id ", this.imageId);
            },

            closingTheComponent: function() {
                this.imageId = 0;
            },

            handleFileChange: function(e) {
                document.getElementById("uploadFile").value = e.target.value;
                this.form.file = e.target.files[0];
            },

            submitComment: function() {
                console.log("heee");
            },

            uploadFile: function(e) {
                var self = this;
                e.preventDefault();
                console.log("this: ", this.form);

                //use formData to upload file to server
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(function(resp) {
                    var imagesArrayFromServer = resp.data.rows[0];
                    self.images.unshift(imagesArrayFromServer);
                    console.log("resp: ", self.images);
                });
            }
        }
    });
})();
