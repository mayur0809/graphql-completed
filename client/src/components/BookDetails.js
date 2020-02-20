// what we want is, when user clicks on name of the book,
// details of the book should be shown to user

import React, { Component } from "react";
import { graphql } from "react-apollo";
import { getBookQuery } from "../queries/queries";

class BookDetails extends Component {
  displayBookDetails() {
    const { book } = this.props.data; // this is actually "es6" destructuring
    // we could have also written
    // "const book = this.props.data.book;"
    // we are actually grabbing "book" variable
    if (book) {
      // if book exists we will return details of that book
      return (
        <div>
          <h2>{book.name}</h2>
          <p>{book.genre}</p>
          <p>{book.author.name}</p>
          <p>All books by this author:</p>
          <ul className="other-books">
            {book.author.books.map(item => {
              return <li key={item.id}>{item.name} </li>;
            })}
          </ul>
        </div>
      );
    } else {
      return <div>No book selected...</div>;
    }
  }
  render() {
    return (
      <div id="book-details">
        <p>{this.displayBookDetails()}</p>
      </div>
    );
  }
}

// we are binding the "getBookQuery" with the component "BookDetails"
export default graphql(getBookQuery)(BookDetails);
// now whenver we render this component, associated query will run
