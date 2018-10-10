$(document).ready(()=>{
    // Handles scrape articles button
    $('.scrape-new').on('click', ()=>{
        // Sends GET request
        $.ajax(`/scrape`, {
            type: 'GET'
        }).then(
            // Put the reload in a ready function to reload the page AFTER DB is updated
            ()=>{
                // Refreshes page to show changes
                location.reload()
            }
        );
    });

    // Handles save article button
    $('.save').on('click', function(){
        // Targets article id
        const id = $(this).data('id');
        // console.log(id);

        // Sends a PUT request
        $.ajax(`/saved/${id}`, {
            type: 'PUT'
        }).then (
            // Refreshes page to show changes
            location.reload()
        );
    });

    // Handles delete article button
    $('.delete').on('click', function(){
        // Targets article id
        const id = $(this)
            .parents('.card')
            .data('id');
        // console.log(id);
    
        // Sends a DELETE request
        $.ajax(`/articles/${id}`, {
            type: 'DELETE'
        }).then(
            // Refreshes page to show changes
            location.reload()
        );
    });

    // Handles clear articles button
    $('.clear').on('click', ()=>{
        // Sends a DELETE request
        $.ajax('/articles/delete', {
            type: 'POST'
        }).then(
            // Refreshes page to show changes
            location.reload()
        );
    });

    // Handles comments button, opens comments modal
    $(".comments").on("click", function(){
        // Targets article id
        const currentArticle = $(this)
          .parents(".card")
          .data("id");

        // Grab any notes with this headline/article id
        $.ajax(`/articles/${currentArticle}`, {
            type: 'GET'
        }).then((data)=>{
        // Constructs modal
        const modalText = $("<div class='container-fluid text-center'>").append(
            $("<h4>").text(`Notes For Article: ${currentArticle}`),
            $("<hr>"),
            $("<ul class='list-group comment-container'>"),
            $("<textarea id='text' placeholder='New Note' rows='4' cols='60'>"),
            $(`<button class='btn btn-success saveComment' data-id=${currentArticle}>Save Comment</button>`)
        );

        // Opens modal with above html
        bootbox.dialog({
            message: modalText,
            closeButton: true
        });
        const commentData = {
            _id: currentArticle,
            comments: data.comments || []
        };

        // console.log(commentData);

        // Adding some information about the article and article notes to the save button for easy access
        // When trying to add a new note
        $(".btn.save").data("article", commentData);
        // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
        renderNotesList(commentData);
        });
        
    });

    // Handles save comment button
    $(document).on('click', '.saveComment', function() {
        // Targets article id
        const currentArticle = $(this)
            .data('id');

        // Targets textarea text
        const comment = $("#text").val().trim();

        // Sends a POST request
        $.ajax(`/articles/${currentArticle}`, {
            type: "POST",
            data: {_headlineId: currentArticle, body: comment}
        }).then((data)=>{
            console.log(data);
            // Empty the textarea after comment is submitted
            $('#text').empty();   
        });
    });



    function renderNotesList(data) {
        // This function handles rendering note list items to our notes modal
        // Setting up an array of notes to render after finished
        // Also setting up a currentNote constiable to temporarily store each note
        let notesToRender = [];
        let currentNote;
        if (!data.comments.length) {
            // If we have no notes, just display a message explaining this
            currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            notesToRender.push(currentNote);
        } else {
            // If we do have notes, go through each one
            for (let i = 0; i < data.comments.length; i++) {
                // Constructs an li element to contain our noteText and a delete button
                currentNote = $("<li class='list-group-item note'>")
                .text(data.comments[i].noteText)
                .append($("<button class='btn btn-danger note-delete'>x</button>"));
                // Store the note id on the delete button for easy access when trying to delete
                currentNote.children("button").data("_id", data.comments[i]._id);
                // Adding our currentNote to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        // Now append the notesToRender to the note-container inside the note modal
        $(".comment-container").append(notesToRender);
    }

});