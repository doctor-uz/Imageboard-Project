(function() {
    //all of our vue code will go here
    Vue.component("some-component", {
        template: "#my-template",

        props: ["imageId"],

        //#3 step. using props imageID

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
                comments: []
            };
        },

        mounted: function() {
            console.log("this of vue ", this.imageId);
            //it should be number which is ID
            var self = this;
            axios.get("/kitty/" + this.imageId).then(function(resp) {
                self.img.created_at = resp.data.rows[0].created_at;
                self.img.description = resp.data.rows[0].description;
                self.img.title = resp.data.rows[0].title;
                self.img.url = resp.data.rows[0].url;
                self.img.username = resp.data.rows[0].username;

                self.comments = resp.data.rows;

                console.log("this is response ", resp.data.rows[0].url);
            });
        },

        methods: {
            handleClick: function() {
                console.log("clicked!!!");
            },
            closeComponent: function() {
                this.$emit("close-the-component");
                console.log("x clicked");
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
                        self.comments.unshift(resp.data.results.rows[0]);
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
            firstName: "Dilshod Rahmatov",

            images: [],
            //#2 step. Waht is image id that was clicked on
            imageId: 0,

            showComponent: false,

            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },

        mounted: function() {
            var self = this;
            // console.log("front end");

            axios.get("/kitty").then(function(resp) {
                var imagesArrayFromServer = resp.data.rows;
                self.images = imagesArrayFromServer;

                // console.log("self :", self.images);
            });

            // axios.post("")
        }, //mounted ends here

        //every function thet runs in response to an event
        methods: {
            getMoreImages: function() {
                // console.log("get images running!!!!");
                // console.log("This dot images: ", this.images);
                // console.log(
                //     "this is last id ",
                //     this.images[this.images.length - 1].id
                // );
                var lastId = this.images[this.images.length - 1].id;
                var self = this;
                //GET /get-more-images/6
                axios.get("/get-more-images/" + lastId).then(function(resp) {
                    // console.log("resp in /get-more-images: ", resp);
                    self.images.push.apply(self.images, resp.data);

                    // if (lastId == 1) {
                    //     button false
                    // }
                });
            },

            toggleComponent: function(e) {
                this.imageId = e.target.id;
                console.log("this is id ", this.imageId);
            },

            closingTheComponent: function() {
                this.imageId = 0;
            },

            handleFileChange: function(e) {
                this.form.file = e.target.files[0];
            },

            submitComment: function() {
                console.log("heee");
            },

            uploadFile: function(e) {
                var self = this;
                e.preventDefault();
                console.log("this: ", this.form); //this.from in the abouve inside the data :-)

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
