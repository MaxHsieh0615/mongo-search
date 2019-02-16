$(document).ready(function () {
    // Setting a reference to the story-container div where all the dynamic content will go
    // Adding event listeeners to any dynamically generated "save stories"
    // and "scrape new story" buttons
    var storyContainer = $(".story-container");
    $(document).on("click", ".btn.save", handleStorySave);
    $(document).on("click", ".scrape-new", handleStoryScrape);
    // Once the page is ready, run the initPage function
    initPage();

    function initPage() {
        // Empty the story container, run an AJAX request for any unsaved headlines
        storyContainer.empty();
        jQuery.get("/api/headlines?saved=false")
            .then(function (data) {
                // If we have headlines, render then to the page
                if (data && data.length) {
                    renderStories(data);
                } else {
                    // Else render a message explaining we have no stories
                    renderEmpty();
                }
            });
    }
    function renderStories(stories) {
        // This function handles appending HTML containing our story data to the page
        // We are passed an array of JSON containing all available storys in our database
        var storyPanels = [];
        // We pass each story JSON object to the createPanel function which returns a bootstrap
        // panel with our story data inside
        for (var i = 0; i < stories.length; i++) {
            storyPanels.push(createPanel(stories[i]));
        }
        // Once we have all the HTML for the stories stored in our storyPanels array,
        // append them to the storyPanels container
        storyContainer.append(storyPanels);
    }

    function createPanel(story) {
        // This function takes in a single JSON object for an story/headline
        // It constructs a jQuery element containing all of the formatted HTML for the 
        // story panel
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                story.headline,
                "<a class='btn btn-success save'>",
                "Save Story",
                "</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                story.summary,
                "</div>",
                "</div>"].join(""));
        // We attach the story's id to the jQuery element
        // We will use this when trying to figure out which story the user wants to save
        panel.data("_id", story._id);
        // We return the constructed panel jQuery element
        return panel;
    }

    function renderEmpty() {
        // This function renders some HTML to the page explaining we do not have any stories to view
        // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>Sorry no new stories.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>What would you like to do?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'>Try scraping new stories</a></h4>",
                "<h4><a href='/saved'>Go to saved stories</a></h4>",
                "</div>",
                "</div>"].join(""));
                // Appending this data to the page
                storyContainer.append(emptyAlert);
    }

    function handleStorySave() {
        // This function is triggered when the user wants to save a story
        // When we rendered the story initially, we attached a javascript object containing the headline id
        // to the element using the .data method. Here we retrieve that.
        var storyToSave = $(this).parents(".panel").data();
        storyToSave.saved = true;
        // Using a patch method to be semantic since this is an update to an existing record in our collection
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: storyToSave
        })
        .then(function(data){
            // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
            // (which casts to 'true')
            if (data.ok) {
                // Run the initPage function again. This will reload the entire list of storys
                initPage();
            }
        });
    }

    function handleStoryScrape() {
        // This function handles the user clicking any "scrape new story" buttons
        $.get("/api/fetch")
        .then(function(data){
            // If we are able to succesfully scrape the NBA and compare the stories to those
            // already in our collection, re render the stories on the page
            // and let the user know how many unique stories we were able to save
            initPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
        });
    }
});