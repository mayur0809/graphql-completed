const express = require("express");
const graphqlHTTP = require("express-graphql");

// we are importing schema that we have written in "schema.js" file
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const cors = require("cors");
const app = express();

// allow requests from other servers
app.use(cors());

// mongoose.connect(
//   "mongodb+srv://mayur:mayur@cluster0-s7dmo.mongodb.net/test?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }
// );

mongoose.connect("mongodb://localhost/testaroo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once("open", function() {
  console.log("connection has been made to local mongo DB...");
});

// .catch(function() {
//   console.log("promise rejected");
// });

//once the connection is open, second parameter is a callback function, gets called
// mongoose.connection.once("open", () => {
//   console.log("connected to database");
// });

// because of the package "express-graphql" graphqlHTTP is able to understand
// graphql requests. so when we get request on the endpoint "/graphql", express app is
// handing over that request to graphqlHTTP.
// Now we have set graphqlHTTP as a function (it takes some options inside the object)
// which will be fired up when request is
// received on the route "/graphql"

app.use(
  "/graphql",
  graphqlHTTP({
    // here in "schema" atttibute we specify the schema that we will be using
    // so ideally we should have written "schema:schema"
    // first schema is name of the attribute and second schema is the one that we imported above
    // but since both names are same, we can just write schema
    schema,
    // this schema is giving information about our graph
    // and mongoose schema talks about the data that is stored in database
    graphiql: true // by writing this statement, we are saying that, we want to use
    // graphiql tool when we go to address "/graphql" in browser
  })
);

// "app" (which is now express app) is listening to port number 4000.
//Second parameter in "app.listen" is a callback function.
//When app listens to port number 4000, this callback function
// gets fired, and it tells us on console the Message "listening requests on port 4000"
// This callback function is "es6" function, which is just brackets, arrow and then curly brackets.

app.listen(4000, () => {
  console.log("listening for requests on port 4000");
});

// note that by default this server does not accept request from another server (means process)
// so we need to install the package "cors" so as to allow request from other server
