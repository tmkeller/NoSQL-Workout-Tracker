const express = require("express");
const mongojs = require("mongojs");
const mongoose = require('mongoose');
const handlebars = require("express-handlebars");
const logger = require( "morgan" );

const app = express();
const PORT = process.env.PORT || 8080;

app.use( logger( 'dev' ));

app.use( express.urlencoded({ extended: true }));
app.use( express.json());

app.use( express.static( "public" ))

const db = require( "./models" );

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/workouttracker', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// db.on( "error", error => {
//     console.log( "Database Error: ", error );
// })

//Sets our app to use the handlebars engine
app.set("view engine", "handlebars");
//Sets handlebars configurations (we will go through them later on)
app.engine(
  "handlebars",
  handlebars({ layoutsDir: __dirname + "/views/layouts" })
);

app.get("/", (req, res) => {
    res.render( "index" );
});

// Seed data
const seedExercises = [
    {
        name: 'deadlift',
        isCardio: false,
        weight: 225,
        repetitions: 10,
        mileage: null
    },
    {
        name: 'bench press',
        isCardio: false,
        weight: 165,
        repetitions: 8,
        mileage: null
    },
    {
        name: 'squat',
        isCardio: false,
        weight: 120,
        repetitions: 10,
        mileage: null
    },
    {
        name: 'running',
        isCardio: true,
        mileage: 5
    },
    {
        name: 'rowing',
        isCardio: true,
        mileage: 3
    },
    {
        name: 'tabata sets',
        isCardio: true,
        repetitions: 20
    }
]

app.get( '/seedworkouts', ( req, res ) => {
    db.Exercise.create( seedExercises )
        .then( result => {
            console.log( "Exercise.create result", result )
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
                res.send( fullRes );
            }).catch( err => {
                res.send( err );
            })
        }).catch( err => {
            res.send( err );
        })
})

app.get( '/api/workouts', ( req, res ) => {
    db.Workout.find({})
    .then( dbWorkouts => {
        res.json( dbWorkouts );
    })
})

app.get( "/api/weeks", ( req, res ) => {
    db.Week.find({})
    .then( dbWeek => {
        res.json( dbWeeks );
    })
})

app.listen( PORT, () => {
    console.log( "App running on port " + PORT );
})