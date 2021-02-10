const db = require("../models");

module.exports = function (app) {

    app.get( '/api/workouts', ( req, res ) => {
        db.Workout.find({})
        .then( dbWorkouts => {
            res.json( dbWorkouts );
        }).catch( err => {
            console.log( err );
            res.json( err );
        })
    })

    app.get( "/api/workouts/:id", ( req, res ) => {
        db.Workout.findOne({ _id: req.params.id })
        .then( dbWorkout => {
            res.json( dbWorkout );
        }).catch( err => {
            console.log( err );
            res.json( err );
        })
    })

    app.delete( "/api/workouts/:id", ( req, res ) => {
        db.Workout.findOneAndDelete({ _id: req.params.id })
        .then( dbWorkout => {
            res.json( dbWorkout );
        }).catch( err => {
            console.log( err );
            res.json( err );
        })
    })

    app.get( "/api/exercises", ( req, res ) => {
        db.Exercise.find({})
        .then( dbExercises => {
            res.json( dbExercises );
        }).catch( err => {
            console.log( err );
            res.json( err );
        })
    })

    app.get( "/api/exercises/:id", ( req, res ) => {
        db.Exercise.findOne({ _id: req.params.id })
        .then ( dbExercise => {
            res.json( dbExercise );
        }).catch( err => {
            console.log( err );
            res.json( err );
        })
    })

    app.delete( "/api/exercises/:id", ( req, res ) => {
        db.Exercise.findOneAndDelete({ _id: req.params.id })
        .then( dbExercise => {
            res.json( dbExercise );
        }).catch( err => {
            console.log( err );
            res.json( err );
        })
    })

    app.post( "/api/workouts", ( req, res ) => {
        console.log( req.body );
        db.Workout.create( req.body ).then( data => {
            res.json( data );
        }).catch( err => {
            console.log( err );
            res.json( err );
        });
    })

    app.post( "/api/exercises", ( req, res ) => {
        db.Exercise.create( req.body )
        .catch( err => {
            console.log( err );
            res.json( err );
        });
    })

    app.get( "/api/populatedexercises", ( req, res ) => {
        db.Workout.find( req.body )
        .populate( 'exercises' )
        .then( dbWorkout => {
            console.log( "req.body", req.body );
            res.json( dbWorkout );
        })
        .catch( err => {
            console.log( err );
            res.json( err );
        })
    })

    app.get( "/api/populatedexercises/:id", ( req, res ) => {
        db.Workout.findOne({ _id: req.params.id })
        .populate( 'exercises' )
        .then( dbWorkout => {
            console.log( "req.body", req.body );
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
            reps: 10,
            duration: 5,
            mileage: null
        },
        {
            name: 'bench press',
            type: 'strength',
            weight: 165,
            sets: 3,
            reps: 12,
            duration: 5,
            mileage: null
        },
        {
            name: 'squat',
            type: 'strength',
            weight: 180,
            sets: 3,
            reps: 8,
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