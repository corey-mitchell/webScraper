$(document).ready(()=>{
    // Controls save button
    $('.saveArticle').on('click', function(event){
        // Targets article id
        const id = $(this).data('id');
        // console.log(id);

        // Sends a PUT request
        $.ajax(`/saved/${id}`, {
            type: 'PUT'
        }).then (
            // Reloads page to show changes
            location.reload()
        );
    });

    // Handles comments button, opening the comments modal
    $('.comments').on('click', function(event){
        // Grabs the id of the article
        const currentArticle = $(this)
        .parent('h3')
        .data("id");

        // console.log(currentArticle);

        // Grab any notes with this headline/article id
        $.get(`/articles/${currentArticle}`).then((data)=>{
            // Need to build a modal here
            console.log(data);
        });
    });

});