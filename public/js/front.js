$(document).ready(function(){
    $('.modal').modal();

    $("#submit_add_new").on("click", async function() {
        // Call get() on all checked exercise elements to turn them into a true array.
        $( "#workout_row" ).remove();
        const exercises = $( "input:checkbox:checked.submit_workout_checkbox" )
            .map( function() {
                return $( this ).data( "id" );
            }).get();
        $.ajax({
          type: "POST",
          url: "/api/workouts",
          dataType: "json",
          data: {
            name: $("#submit_workout_name").val(),
            exercises
          }
        })
        .then( function( workoutData ) {
            $( '.modal' ).modal( 'close', "#modal1" );

            // Create a new row with cards for each exercise.
            const newRow = $( "<div>", { class: "row workout_row" });
            const leftCol = $( "<div>", { class: "col s0 m2 l3" });
            const rightCol = $( "<div>", { class: "col s0 m2 l3" } );
            const centerCol = $( "<div>", { class: "col s12 m8 l6" } );
            const workoutHeader = $( "<h3>", { class: "workout_header" }).text( workoutData.name );
            const deleteButton = $( "<button>", { class: "waves-effect waves-light btn red modal-close", id: "delete_workout" }).text( "Delete" );

            newRow.append( leftCol );
            newRow.append( centerCol );
            newRow.append( rightCol );
            centerCol.append( workoutHeader );
            centerCol.append( deleteButton );

            $( "#divider" ).after( newRow );

            const exrcsRow = $( "<div>", { class: "row exercise_row" });

            newRow.after( exrcsRow );
            console.log( "Workout data._id", workoutData._id )
            $.get( "/api/populatedexercises/" + workoutData._id )
            .then( function( populatedData ) {
                console.log( populatedData.exercises );
                for ( let i = 0; i < populatedData.exercises.length; i++ ) {
                    let newExrcs = populatedData.exercises[ i ];

                    const column = $( "<div>", { class: "col s12 m6 l3" }).attr( "data-id", newExrcs._id );
                    const card = $( "<div>", { class: "card blue-grey darken-1" });
                    const cardContent = $( "<div>", { class: "card-content white-text" });
                    const titleSpan = $( "<span>", { class: "card-title" }).text( newExrcs.name );
                    const typeSpan = $( "<span>", { class: "card_type" }).text( "Type: " + newExrcs.type );

                    let textContent = "";
                    if ( newExrcs.weight ) {
                        textContent += "Weight: " + newExrcs.weight + "\n";
                    }
                    if ( newExrcs.sets ) {
                        textContent += "Sets: " + newExrcs.sets + "\n";
                    }
                    if ( newExrcs.reps ) {
                        textContent += "Reps: " + newExrcs.reps + "\n";
                    }
                    if ( newExrcs.duration ) {
                        textContent += "Duration: " + newExrcs.duration + "\n";
                    }
                    if ( newExrcs.mileage ) {
                        textContent += "Mileage: " + newExrcs.mileage + "\n";
                    }

                    const paragraph = $( "<p>", { class: "card_paragraph" }).text( textContent );
                    const cardAction = $( "<div>", { class: "card-action" });
                    const exrcsDelButton = $( "<button>", { class: "waves-effect waves-light btn green", id: "delete_exrcs_card"}).text( "Remove" );

                    exrcsRow.append( column );
                    column.append( card );
                    card.append( cardContent );
                    card.append( cardAction );
                    cardContent.append( titleSpan );
                    cardContent.append( typeSpan );
                    cardContent.append( paragraph );
                    cardAction.append( exrcsDelButton );
                }
            })
        });

        // <div class="row">
        //     <div class="col s0 m2 l3"></div>
        //     <div class="col s12 m8 l6">
        //         <h3 class="workout_header">workout name</h3>
        //         <button class="waves-effect waves-light btn red modal-close" id="delete_workout">Delete</button>
        //     </div>
        //     <div class="col s0 m2 l3"></div>
        // </div>
        
        return false;
    });
});