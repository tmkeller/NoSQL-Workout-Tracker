const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

// name, type, weight, sets, reps, and duration
const ExerciseSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    type: { 
        type: String,
        required: true
    },
    weight: Number,
    sets: Number,
    reps: Number,
    duration: Number,
    mileage: Number
})

const Exercise = mongoose.model( "Exercise", ExerciseSchema );

module.exports = Exercise;