var scrape = require('../scripts/scrape');
var makeDate = require('../scripts/date');

var Story = require('../models/Story');

module.exports = {
    fetch: function(cb) {
        scrape(function(data){
            var stories = data;
            for (var i=0; i < stories.length; i++){
                stories[i].date = makeDate();
                stories[i].saved = false;
            }
            Story.collection.insertMany(stories, {ordered:false}, function(err,docs){
                cb(err, docs);
            });
        });
    },
    delete: function(query, cb) {
        Story.remove(query, cb);
    },
    get: function(query, cb) {
        Story.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc){
            cb(doc);
        });
    },
    update: function(query, cb){
        Story.update({_id: query._id},{
            $set: query
        }, {}, cb);
    }
}