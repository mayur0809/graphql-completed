import React, { Component } from "react";
//import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";

// we are importing mutation also that we have writter
import {
  getAuthorsQuery,
  addBookMutation,
  getBooksQuery
} from "../queries/queries";
class AddBook extends Component {
  // since we want to retrieve the data which user enters in respective fields,
  // we are setting state of the component
  // this is kind of convention in class based components in react
  constructor(props) {
    super(props);
    // we are equating state of component to an object
    this.state = {
      // inside this object, we can keep track of different fields in the form
      // initially all form fields are going to be empty
      name: "",
      genre: "",
      authorId: ""
    };
  }
  displayAuthors() {
    var data = this.props.getAuthorsQuery;
    // now instead of above line, because there are as of now 2 queries (1 "getAuthorsQuery")
    // and 1 mutation ("addBookMutation") attached to the component "AddBook",
    // we are using name of the query that we have given, in our compose statement
    // down below
    if (data.loading) {
      return <option disabled>Loading authors...</option>;
    } else {
      return data.authors.map(author => {
        return (
          <option key={author.id} value={author.id}>
            {" "}
            {author.name}{" "}
          </option>
        );
      });
    }
  }

  submitForm(e) {
    // previously whenever we typed something in the form and press "+" button
    // it just used to get refresh and then do nothing
    // this was the default behaviour of the form, now we want to prevent this default
    // behaviour

    // in this "submitForm" method, we will call the mutation "addBook" mutation
    // and we will pass the "query variables"

    e.preventDefault();
    //console.log(this.state);
    // recall that we have "binded" the context of the form to "submitForm" function

    // now we are calling our "addBookMutation" query when user cliks on submit button
    this.props.addBookMutation({
      variables: {
        // "variables" is sort of like property. (syantactically it is an object)
        name: this.state.name,
        // name variable is equated to whatver the "state" of name variable is as of now
        genre: this.state.genre,
        // similarly for other variables
        authorId: this.state.authorId
      },
      // note that "getBooksQuery" is the query is the query which is retrieving
      //the list of all books
      // from the database
      // what we want is, when we add the book by pressing the "+" button,
      // that book name should also be
      // displayed on the browser without refreshing the browser
      // so we want to "re-run" that query when we add the book

      // so after we call "addBookMutation", we are calling "getBooksQuery"
      refetchQueries: [{ query: getBooksQuery }]
      // "refechQueries" is an array of queries that we want to refetch
      // (means those queries will be fired up again)
    });
  }

  render() {
    return (
      // now when user write something in the form, we need to update the state
      // "onChange" is a listener, and inside "onChange" we are writing es6 function
      // this function is setting the new state
      // for the "Book name" field we are setting "name" property
      // for the "Genre" we are setting "genre" property
      // and for "Author" we are setting "authorId" property
      // now whenever we fill book name in the form, the function will get triggered
      // and whatever is typed in by the user, that will be set to "name" field
      // and similarly for rest of the fields
      // target here refers to the respective field
      // we also need to attach event listener to form so when user clicks on
      // "+" button, then only form gets triggered
      // "bind" will bind the context of "this" form to the function "submitForm"
      <form id="add-book" onSubmit={this.submitForm.bind(this)}>
        <div className="field">
          <label>Book name:</label>
          <input
            type="text"
            onChange={e => this.setState({ name: e.target.value })}
          />
        </div>

        <br></br>
        <br></br>

        <div className="field">
          <label>Genre:</label>
          <input
            type="text"
            onChange={e => this.setState({ genre: e.target.value })}
          />
        </div>

        <br></br>
        <br></br>

        <div className="field">
          <label>Author:</label>
          <select onChange={e => this.setState({ authorId: e.target.value })}>
            <option>Select Author</option>
            {this.displayAuthors()}
          </select>
        </div>

        <br></br>
        <br></br>

        <button>+</button>
      </form>
    );
  }
}

// export default graphql(getAuthorsQuery)(AddBook);

// to the "AddBook" component, we need to bind multiple queries (technically one query and
// one mutation), we can not do it by writing multiple parenthesis like
// "export default graphql(addBookMutation)(getAuthorsQuery)(AddBook);"
// so for this purpose, we use "compose method" (that we need to import from "react-apollo")
// we do it like

export default compose(
  // attaching "getAuthorsQuery" to the component "AddBook"
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  // the query "getAuthorsQuery" will now be named as "getAuthorsQuery"

  // attaching "addBookMutation" to the component "AddBook
  graphql(addBookMutation, { name: "addBookMutation" })
  // the mutation "addBookMutation" will now be named as "addBookMutation"
)(AddBook);

// note:-
// the package "compose" is now not the part of "react- apollo"
// it is now the part of "lodash", so care has been taken in
// the respective import statement
