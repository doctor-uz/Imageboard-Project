(function() {
    //all of our vue code will go here
    new Vue({
        el: "#main",
        data: {
            images: []
        },

        mounted: function() {
            var self = this;
            console.log("front end");
            axios.get("/kitty").then(function(resp) {
                var imagesArrayFromServer = resp.data.rows;
                self.images = imagesArrayFromServer;

                console.log("self :", self.images);
            });
        }
    });
})();
