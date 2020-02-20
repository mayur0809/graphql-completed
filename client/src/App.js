//import React from "react";
import React, { Component } from "react";
//importing the apollo client that we need from the package apollo-boost
import ApolloClient from "apollo-boost";
// apolloProvider wraps our application and injects whatever data we receive from the server
// into our application
import { ApolloProvider } from "@apollo/react-hooks";
// importing the component "BookList" from the "BookList.js" file in
// components folder
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";

// here we set up apollo client
const client = new ApolloClient({
  // this client takes in some options, one of them is uri which is our supercharged end-point
  uri: "http://localhost:4000/graphql"
});
class App extends Component {
  render() {
    return (
      // we set up ApolloProvider by wrapping our template in ApolloProvider tag
      // client means "what client ApolloProvider will be using" and it nothing but
      // the client we created on line number 13
      // we use curly braces and not the double quotes to put the data dynamically
      <ApolloProvider client={client}>
        <div id="main">
          <h1>Reading List</h1>
          {/* since we have imported the component "BookList", we can render it anywhere we want
        the way we nest any other component is by opening tag, name of component and then
        self closing tag */}
          <BookList></BookList>
          <AddBook></AddBook>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
