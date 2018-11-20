(function() {
    //all of our vue code will go here
    new Vue({
        el: "#main",
        data: {
            images: [],
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
        }, //mounted ends here

        //every function thet runs in response to an event
        methods: {
            handleFileChange: function(e) {
                // console.log("handle File Change running!!", e.target.files[0]);
                this.form.file = e.target.files[0];
                // console.log("this.form: ", this.form);
            },

            //function that runs when user clicks "submiot" button
            //e preventing defaults such as refresh the page always when we clicking the buttonand urls
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
                    console.log("resp: ", resp);
                    var imagesArrayFromServer = resp.data.rows[0];
                    self.images.unshift(imagesArrayFromServer);
                });
            }
        }
    });
})();
