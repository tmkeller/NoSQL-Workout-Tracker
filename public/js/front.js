$(document).ready(function(){
    $('.modal').modal();

    $( "#continue_workout" ).on( "click", function() {
        $.get( "/api/workouts", function( result ) {
            // Append a new <option> tag to #workouts_select for every workout you retrieve.
            if ( !result ) {
                let option = $( '<option>', { text: "No workouts yet! Create a new one." } ).attr( "disabled", true );
                $( "#workouts_select" ).append( option );
            }
            for ( let i = 0; i < result.length; i++ ) {
                let option = $( '<option>', { 
                    class: "modify_existing_option",
                    value: result[ i ]._id
                }).text( result[ i ].name ).attr( "data-id", result[ i ]._id );
                $( "#workouts_select" ).append( option );
            }
        })
    })

    $( "#submit_modify_existing" ).on("click", function() {
        removeElements();

        let id = $( "#workouts_select" ).val();
        $.get( "/api/populatedexercises/" + id )
        .then( populatedData => {
            $( '.modal' ).modal( 'close', "#modal1" );

            // Render the row where title elements will appear.
            const newRow = renderTitleRow( populatedData );

            $( "#divider" ).after( newRow );

            const exrcsRow = $( "<div>", { class: "row exercise_row" });

            newRow.after( exrcsRow );

            // Add the event listener for the delete workout button.
            addDeleteWorkout();
            addAddExercise();

            renderExerciseCards( populatedData, exrcsRow );
        })
    });

    $("#submit_add_new").on("click", function() {
        removeElements();

        // GET all 
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

            // Render the row where title elements will appear.
            const newRow = renderTitleRow( workoutData );
            $( "#divider" ).after( newRow );

            const exrcsRow = $( "<div>", { class: "row exercise_row" });

            newRow.after( exrcsRow );

            // Add the event listener for the delete workout button.
            addDeleteWorkout();
            // Add the event listener for the add exercise button.
            addAddExercise();

            $.get( "/api/populatedexercises/" + workoutData._id )
            .then( function( populatedData ) {

                renderExerciseCards( populatedData, exrcsRow );

            })
        });
    });

    function addDeleteWorkout() {
        $( "#delete_workout" ).on( "click", function() {

            let id = $( this ).attr( "data-id" );
            console.log( id );
            
            $.ajax({
                url: '/api/workouts/' + id,
                type: 'DELETE'
            }).then( ( req, res ) => {
                console.log( res );
                window.location.href=window.location.href;
            }).catch( err => {
                console.log( err );
                res.json( err );
            });
        })
    }

    function addAddExercise() {
        $( "#exercise_submit" ).on( "click", function( e ) {
            e.preventDefault();
            let id = $( "#exercise_submit" ).data( "id" );
            let obj = {
                workoutId: id,
                name: $( "#exercise_name" ).val(),
                type: $( "#exercise_type" ).val(),
                weight: $( "#exercise_weight" ).val(),
                sets: $( "#exercise_sets" ).val(),
                reps: $( "#exercise_reps" ).val(),
                duration: $( "#exercise_duration" ).val(),
                mileage: $( "#exercise_mileage" ).val()
            }
            $.ajax({
                type: "POST",
                url: "/api/exercises",
                data: obj,
                dataType: "json"
            }).then( function( data ) {
                console.log( "Data from addAddExercise ", data )
                const exrcsRow = $( ".exercise_row" );
                const column = renderSingleExerciseCard( data );
                exrcsRow.append( column );
            })
            .catch( err => {
                console.log( err );
            })
        })
    }

    function renderSingleExerciseCard( newExrcs ) {
        const column = $( "<div>", { class: "col s12 m6 l3", id: newExrcs._id });
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
        const exrcsDelButton = $( "<button>", { 
            class: "waves-effect waves-light btn green delete_exercise_button"
            
        }).text( "Remove" ).attr( "data-id", newExrcs._id ).attr( "data-parent", newExrcs._id );

        column.append( card );
        card.append( cardContent );
        card.append( cardAction );
        cardContent.append( titleSpan );
        cardContent.append( typeSpan );
        cardContent.append( paragraph );

        return column;
    }

    function renderTitleRow( populatedData ) {
        // Create a new row with cards for each exercise.
        const newRow = $( "<div>", { class: "row workout_row" });
        const leftCol = $( "<div>", { class: "col s0 m2 l3" });
        const rightCol = $( "<div>", { class: "col s0 m2 l3" } );
        const centerCol = $( "<div>", { class: "col s12 m8 l6" } );
        const workoutHeader = $( "<h3>", { class: "workout_header" }).text( "Workout: " + populatedData.name );
        const deleteButton = $( "<button>", { 
            class: "waves-effect waves-light btn red modal-close", 
            id: "delete_workout" }).text( "Delete" ).attr( "data-id", populatedData._id );

        const addExercise = renderAddExercise( populatedData._id );

        newRow.append( leftCol );
        newRow.append( centerCol );
        newRow.append( rightCol );
        centerCol.append( workoutHeader );
        centerCol.append( deleteButton );
        centerCol.after( addExercise );

        return newRow
    }

    function renderExerciseCards( populatedData, exrcsRow ) {

        for ( let i = 0; i < populatedData.exercises.length; i++ ) {
            let newExrcs = populatedData.exercises[ i ];

            const column = $( "<div>", { class: "col s12 m6 l3", id: newExrcs._id });
            const card = $( "<div>", { class: "card blue-grey darken-1" });
            const cardContent = $( "<div>", { class: "card-content white-text" });
            const titleSpan = $( "<span>", { class: "card-title" }).text( newExrcs.name );
            const typeSpan = $( "<span>", { class: "card_type" }).text( "Type: " + newExrcs.type );

            let textContent = "";
            if ( newExrcs.weight ) {
                textContent += "Weight: " + newExrcs.weight + ",\n";
            }
            if ( newExrcs.sets ) {
                textContent += "Sets: " + newExrcs.sets + ",\n";
            }
            if ( newExrcs.reps ) {
                textContent += "Reps: " + newExrcs.reps + ",\n";
            }
            if ( newExrcs.duration ) {
                textContent += "Duration: " + newExrcs.duration + ",\n";
            }
            if ( newExrcs.mileage ) {
                textContent += "Mileage: " + newExrcs.mileage + ",\n";
            }

            const paragraph = $( "<p>", { class: "card_paragraph" }).text( textContent );
            const cardAction = $( "<div>", { class: "card-action" });
            const exrcsDelButton = $( "<button>", { 
                class: "waves-effect waves-light btn green delete_exercise_button"
                
            }).text( "Remove" ).attr( "data-id", newExrcs._id ).attr( "data-parent", populatedData._id );

            exrcsRow.append( column );
            column.append( card );
            card.append( cardContent );
            card.append( cardAction );
            cardContent.append( titleSpan );
            cardContent.append( typeSpan );
            cardContent.append( paragraph );
        }
    }

    function renderAddExercise( id ) {
        const exerciseForm = $( "<form>", { id: "add_exercise" } );
        const name = $( "<input>", { placeholder: "Exercise Name", id: "exercise_name" } );
        const type = $( "<select>", { placeholder: "Exercise Type", id: "exercise_type" } );
        const weight = $( "<input>", { placeholder: "Exercise Weight", id: "exercise_weight", type: "number" } );
        const sets = $( "<input>", { placeholder: "Exercise Sets", id: "exercise_sets", type: "number" } );
        const reps = $( "<input>", { placeholder: "Exercise Reps", id: "exercise_reps", type: "number" } );
        const duration = $( "<input>", { placeholder: "Exercise Duration", id: "exercise_duration", type: "number" } );
        const mileage = $( "<input>", { placeholder: "Exercise Mileage", id: "exercise_mileage", type: "number" });
        const submitBtn = $( "<button>", { 
            id: "exercise_submit", 
            class: "waves-effect waves-light btn green modal-close" } )
            .text( "Add Exercise to Workout" )
            .attr( "data-id", id );

        exerciseForm.append( name );
        exerciseForm.append( type );
        exerciseForm.append( weight );
        exerciseForm.append( sets );
        exerciseForm.append( reps );
        exerciseForm.append( duration );
        exerciseForm.append( mileage );
        exerciseForm.append( submitBtn );

        const typePlaceholder = $( "<option>", { class: "type_option", value: "strength", disabled: true, selected: true } ).text( "Exercise type" );
        const typeCardio = $( "<option>", { class: "type_option", value: "strength" } ).text( "strength" );
        const typeStrength = $( "<option>", { class: "type_option", value: "cardio" } ).text( "cardio" );

        type.append( typePlaceholder );
        type.append( typeCardio );
        type.append( typeStrength );
        
        return exerciseForm;
    }

    function removeElements() {
        $( ".workout_row" ).remove();
        $( ".exercise_row" ).remove();
        $( "#add_exercise" ).remove();
    }
});