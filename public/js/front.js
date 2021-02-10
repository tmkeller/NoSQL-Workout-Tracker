$(document).ready(function(){
    $('.modal').modal();

    $("#submit_add_new").on("click", async function() {
        // Call get() on all checked exercise elements to turn them into a true array.
        const exercises = $( "input:checkbox:checked.submit_workout_checkbox" )
            .map( function() {
                return $( this ).data( "id" );
            }).get();
        console.log( "Exercises returned", exercises );
        const newWorkout = await $.ajax({
          type: "POST",
          url: "/api/workouts",
          dataType: "json",
          data: {
            name: $("#submit_workout_name").val(),
            exercises
          }
        })
        .then( function( data ) {
            console.log( data );
            $( '.modal' ).modal( 'close', "#modal1" );
        });

        // Create a new row with cards for each exercise.
        
        return false;
    });
});