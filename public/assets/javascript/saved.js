$(document).ready(function () {
    // Setting a reference to the story-container div where all the dynamic content will go
    // Adding event listeeners to any dynamically generated buttons for deleting stories,
    // pulling up story notes, saving story notes, and deleting story notes
    var storyContainer = $(".story-container");
    $(document).on("click", ".btn.delete", handleStoryDelete);
    $(document).on("click", ".btn.notes", handleStoryNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
    // Once the page is ready, run the initPage function
    initPage();

    function initPage() {
        // Empty the story container, run an AJAX request for any unsaved headlines
        storyContainer.empty();
        $.get("/api/headlines?saved=true")
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
        // We are passed an array of JSON containing all available articles in our database
        var storyPanels = [];
        // We pass each article JSON object to the createPanel function which returns a bootstrap
        // panel with our article data inside
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
                article.headline,
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
        panel.data("_id", article._id);
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

    function renderNotesList(data) {
        // This function handles rendering note list items to our notes modal
        // Setting up an array of notes to render after finished
        // Also setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            // If we have no notes, just display a message explaining this
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this story yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        } else {
            // If we do have notes, go through each one
            for (var i = 0; i < data.notes.length; i++) {
                // Constructs an li element to contain our noteText and a delete button
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                // Store the note id on the delete button for easy access when trying to delete
                currentNote.children("button").data("_id", data.notes[i]._id);
                // Adding our currentNote to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        // Now append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
    }

    function handleNoteSave() {
        // This function handles what happens when a user tries to save a new note for an article
        // Setting a variable to hold some formatted data about our note,
        // grabbing the note typed into the input box
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        // If we actually have data typed into the note input field, format it
        // and post it to the "/api/notes" route and send the formatted noteData as well
        if (newNote) {
            noteData = {
                _id: $(this).data("story")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function(){
                // When complete, close the modal
                bootbox.hideAll();
            });
        }
    }

    function handleStoryDelete() {
        // This function handles deleting stories/headlines
        // We grab the id of the story to delete from the panel element the delete button sits inside
        var storyToDelete = $(this).parents(".panel").data();
        // Using a delete method here just to be semantic since we are deleting an article/headline
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + storyToDelete._id
        }).then(function(data){
            // If this works out, run initPage again which will re render our list of saved stories
            if (data.ok){
                initPage();
            }
        });
    }

    function handleStoryNotes () {
        // This function handles opening the notes modal and displaying our notes
        // We grab the id of the article to get notes for from the panel element the delete button sits inside
        var currentStory = $(this).parents(".panel").data();
        // Grab any notes with this headlines/story id
        $.get("/api/notes/" + currentStory._id).then(function(data){
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes for Stories: ",
                currentStory._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='5' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            // Adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentStory._id,
                notes: data || []
            };
            // Adding some information about the story and story notes to the save button for easy access
            // When trying to add a new note
            $(".btn.save").data("article", noteData);
            // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
            renderNotesList(noteData);
        });
    }
    function handleNoteDelete() {
        // This function handles the deletion of notes
        // First we grab the id of the note we want to delete
        // We stored this data on the delete button when we created it
        var noteToDelete = $(this).data("_id");
        // perform an DELETE request to "/api/notes/" with the id of the note we are deleting as a parameter
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function(){
            // When done, hide the modal
            bootbox.hideAll();
        });
    }
});