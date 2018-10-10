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

    // Renders comments to modal
    const renderCommentsList = (data)=>{
        console.log(data);
        // Creates variables to house comments
        let commentToRender = [];
        let currentComment;

        // If no comments then display no comments message...
        if (!data.comments.length) {
            currentComment = "<li class='list-group-item'>No comments for this article yet.</li>";
            commentToRender.push(currentComment);
            console.log(commentToRender);

        // ...Else Log out comments
        }else {
            // Maps through the comments array
            data.comments.map((res)=>{
                // For each comment, send GET request
                // This passes the comment id, which is 'joined' with the articles, into my api to get comment body
                $.ajax(`/comments/${res}`, {
                    type: 'GET'
                }).then((data)=>{
                    console.log(data);
                    // Create a list item for each comment in the array
                    currentComment = $(
                        `<li class='list-group-item note'>${data.body}
                        <button class='btn btn-danger comment-delete'>x</button>
                        </li>`
                    );

                    // Give each delete button a data-id to target later
                    currentComment.children("button").data("_id", data._id);

                    // Pushes the above list item into an array to send to the page all at once
                    commentToRender.push(currentComment);
                    console.log(commentToRender);

                    // For some weird reason, this function started to give me trouble last second. It would either push the comments,
                    // or it would push the 'no comments' message. But it would not push both. So, as a quick fix, I put the copied line 105 onto line 100.
                    // It doesn't look pretty, but it functions. If I have more time, I'll give it a look over.

                    $(".comment-container").append(commentToRender);
                });
            });
        };
        // Renders comment body to page
        $(".comment-container").append(commentToRender);
    };

    // Handles comments button, opens comments modal
    $(".comments").on("click", function(){
        // Targets article id
        const currentArticle = $(this)
          .parents(".card")
          .data("id");

        // Grab any comments with this headline/article id
        $.ajax(`/articles/${currentArticle}`, {
            type: 'GET'
        }).then((data)=>{
            // Constructs modal
            const modalText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text(`Article Comments:`),
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

            // Targets data to send to render function
            const commentData = data || [];

            // Sends data to render function
            renderCommentsList(commentData);
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
            data: {body: comment}
        }).then((data)=>{
            // Closes modal after comment save
            bootbox.hideAll();
        });
    });

    // Handles comment delete button
    $(document).on('click', '.comment-delete', function(){
        console.log('button clicked');
    });

});