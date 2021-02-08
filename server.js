const express = require("express");
const mongojs = require("mongojs");
const mongoose = require('mongoose');
const handlebars = require("express-handlebars");

const app = express();

app.use( express.urlencoded({ extended: true }));
app.use( express.json());

const PORT = process.env.PORT || 8080;

const databaseUrl = "workoutlogger";
const collections = [ "workouts" ];

const db = mongojs( databaseUrl, collections );

db.on( "error", error => {
    console.log( "Database Error: ", error );
})

app.use( express.static( "public" ))

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

app.listen( PORT, () => {
    console.log( "App running on port " + PORT );
})