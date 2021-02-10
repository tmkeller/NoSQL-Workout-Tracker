const db = require("../models");

module.exports = function (app) {

    app.get("/", async (req, res) => {

        const exercises = await db.Exercise.find({}).lean()
        .then( dbExercise => {
            return dbExercise;
        })
        const hbsObj = {
            exercises
        }
        console.log( hbsObj )
        res.render( "index", hbsObj );
    });

}