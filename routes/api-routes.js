const db = require("../models");

module.exports = function (app) {

    app.get( '/api/workouts', ( req, res ) => {
        db.Workout.find({})
        .then( dbWorkouts => {
            res.json( dbWorkouts );
        })
    })

    app.get( "/api/exercises", ( req, res ) => {
        db.Exercise.find({})
        .then( dbExercise => {
            res.json( dbExercise );
        })
    })

    app.post( "/api/workouts", ( req, res ) => {
        db.Workout.create( req.body )
    })

    app.get( "/api/populatedexercises", ( req, res ) => {
        db.Workout.find({})
        .populate( 'exercises' )
        .then( dbWorkout => {
            res.json( dbWorkout );
        })
        .catch( err => {
            console.log( err );
            res.json( err );
        })
    })

    // Seed data
    const seedExercises = [
        {
            name: 'deadlift',
            type: 'strength',
            weight: 225,
            sets: 3,
            repetitions: 10,
            duration: 5,
            mileage: null
        },
        {
            name: 'bench press',
            type: 'strength',
            weight: 165,
            sets: 3,
            repetitions: 12,
            duration: 5,
            mileage: null
        },
        {
            name: 'squat',
            type: 'strength',
            weight: 180,
            sets: 3,
            repetitions: 8,
            duration: 5,
            mileage: null
        },
        {
            name: 'running',
            type: 'cardio',
            duration: 45,
            mileage: 5
        },
        {
            name: 'rowing',
            type: 'cardio',
            duration: 60,
            mileage: 2
        },
        {
            name: 'tabata sets',
            type: 'cardio',
            duration: 20
        }
    ]

    app.get( '/seedworkouts', ( req, res ) => {
        db.Exercise.create( seedExercises )
            .then( result => {
                db.Workout.create([
                    {
                        name: 'legs',
                        exercises: [
                            result[ 2 ]._id,
                            result[ 3 ]._id
                        ]
                    },
                    {
                        name: 'arms',
                        exercises: [
                            result[ 1 ]._id,
                            result[ 4 ]._id
                        ]
                    },
                    {
                        name: 'core',
                        exercises: [
                            result[ 0 ]._id,
                            result[ 5 ]._id
                        ]
                    }
                ]).then( fullRes => {
                    res.json( fullRes );
                }).catch( err => {
                    res.json( err );
                })
            }).catch( err => {
                res.json( err );
            })
    })

    app.get( "/:id", ( req, res ) => {
        res.render( "404" );
    })

}