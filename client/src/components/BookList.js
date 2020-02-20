import React, { Component } from "react";
import { graphql } from "react-apollo";

import { getBooksQuery } from "../queries/queries";
import BookDetails from "./BookDetails";
// note the syantax of query
// this query is to get all the books

// initially we have written query here
// but now we have shifted it to new folder "queries" and inside the file "queries.js"
// and then we have imported those queries in respective files

//once we write the query, we also should bind this query to component BookList
//we do that where we export the package and with the help of "graphql" package

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // this.state is equal to an object
      selected: null
      // we are making use of "selected" property of props
      // "selected" property will keep track of "id" of book which will be clicked
      // by user
      // since initially, when page is loaded, nothing is clicked on, that is why
      // "selected" is set as "null"
    };
  }
  // actually we want to display data from database,
  // so we are writing function instead of displaying static data
  displayBooks() {
    var data = this.props.data; // we are getting data from "data" property of the "prop"
    if (data.loading) {
      // means if data loading is not yet complete
      return <div>Still loading books....</div>;
    } else {
      // means our data is ready, and we can map that data to some html element
      return data.books.map(book => {
        // now we have access to books through data property
        // now map function can map that array to some html element
        // map function can go throug that array and give us individual access to those element
        // "book" here is just placeholder for individual element in that array
        // we are taking that book and firing an "es6" function
        // and that function will return name of the book through "book.name"
        return (
          <li
            key={book.id}
            onClick={e => {
              this.setState({ selected: book.id });
            }}
          >
            {book.name}
          </li>
        );
        // in order to detect whether user has clicked on the name of the book
        // we are setting up event listener on the "li" tag
        // "onClick" is taking event "e" as input parameter
      });
    }
  }
  render() {
    // console.log(this.props); // this displays props of "this" (BookList) component on log
    return (
      <div>
        <ul id="book-list">
          {/* calling the function "displayBooks",
          note that we have to use keyword "this", because "displayBooks" is the 
          function of "this" component */}
          <li>{this.displayBooks()}</li>
        </ul>
        {/* nesting the component "BookDetails" here */}
        <BookDetails bookId={this.state.selected}></BookDetails>
        {/* we need to pass "selected" to "BookDetails"  as a "prop"*/}
      </div>
    );
  }
}

export default graphql(getBooksQuery, {
  options: props => {
    return {
      variables: {
        id: props.bookId
      }
    };
  }
  // actually options property is a function which takes in "props" as a parameter
  // and whenever "props" is updated, it fires up  the function associated
  // this function returns an object which sets variables for this query
})(BookList);

// we have created this "BookList" component and we want to render that on the app page
// the name of the query that we want to bind to the component goes in as a first parameter for
// graphql
// data is stored in "props" of the component
// if query is getting loaded in the background, (means if any component is getting rendered)
// "loading" property of component is set to "true"
// if query is done loading, "loading" property of component is set to "false"
// so we could say that, if "loading" is false, data is loaded completely

// we want to attach "prop" of the component BookList to the query "getBooksQuery"
// we can do this by passing "options" property as a parameter along with "getBooksQuery"
