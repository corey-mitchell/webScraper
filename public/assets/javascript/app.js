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
        const id = $(this).data('id');
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

    // Working on...

    // Handles article comments button, opening the comments modal
    $('.comments').on('click', function(event){
        // Grabs the id of the article
        const currentArticle = $(this)
        .parent('h3')
        .data("id");

        // console.log(currentArticle);

        // Grab any notes with this headline/article id
        $.get(`/articles/${currentArticle}`).then((data)=>{

            // **Need to build a modal here**
            console.log(data);
        });
    });

});