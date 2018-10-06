$(()=>{
    // Controls save button
    $('.save').on('click', function(event){
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

    
});