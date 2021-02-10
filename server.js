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
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

//Sets our app to use the handlebars engine
app.set("view engine", "handlebars");
//Sets handlebars configurations (we will go through them later on)
app.engine(
  "handlebars",
  handlebars({ layoutsDir: __dirname + "/views/layouts" })
);

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

app.listen( PORT, () => {
    console.log( "App running on port " + PORT );
})