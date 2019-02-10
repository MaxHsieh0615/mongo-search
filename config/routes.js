var scrape = require("../scripts/scrape");

var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router) {
    // render index page (home)
    router.get("/", function(req, res){
        res.render("index");
    });
    // render saved page
    router.get("/saved", function(req, res){
        res.render("saved");
    });

    router.get("/api/fetch", function(req, res){
        headlinesController.fetch(function(err, docs){
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new stories today. Check back tomorrow!"
                });
            } else {
                res.json({
                    message: "Added" + docs.insertedCount + "new articles!"
                });
            }
        });
    });
    router.get("/api/headlines", function(req, res){
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }
        headlinesController.get(query, function(data){
            res.json(data);
        });
    });
    router.delete ("/api/headlines/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    router.patch("/api/headlines", function(req, res){
        headlinesController.update(req.body, function(err, data){
            res.json(data);
        });
    });
    router.get("/api/notes/:headline_id?", function(req, res){
        var query = {};
        if (req.params.headline_id){
            query_id = req.params.headline_id;
        }

        notesController.get(query, function(err, data){
            res.json(data);
        });
    });
    router.delete("/api/notes/:id", function(req, res){
        var query = {};
        query_id = req.params.id;
        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });
}

// Since I have already set the engine to view handlebar in server.js, the app will know it needs to look at handlebars. Hence we do not need to include the .handlebars when we render the files.