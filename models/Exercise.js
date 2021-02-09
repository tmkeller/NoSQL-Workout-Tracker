const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    isCardio: Boolean,
    weight: Number,
    repetitions: Number,
    mileage: Number
})

const Exercise = mongoose.model( "Exercise", ExerciseSchema );

module.exports = Exercise;