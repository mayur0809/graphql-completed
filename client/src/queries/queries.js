import { gql } from "apollo-boost"; // we are importing this so as to handle query parsing

const getBooksQuery = gql`
  {
    books {
      name
      id
    }
  }
`;

const getAuthorsQuery = gql`
  {
    authors {
      name
      id
    }
  }
`;

// ideally we want to send the data typed by user in the form to our server
// for this purpose we will make a mutation
const addBookMutation = gql`
  mutation($name: String!, $genre: String!, $authorId: ID!) {
    # after the mutation keyword, whatever we are passing are called as "query variables"
    # "$" sign indicates that, it is a query variable
    # "!" sign indicates that, valued should not be null
    # from user form
    addBook(name: $name, genre: $genre, authorId: $authorId) {
      # and now  instead of variables being empty, we will set their values as query variables
      #  we are getting back name and id of the book
      name
      id
    }
    # you can think like, we are accepting variables in this mutation
    # and in "AddBook.js" we will pass variables to this mutation once user clicks on "+" button

    # actually you can also add the mutation name like
    # "mutation AddBook($name: String!, $genre: String!, $authorId: ID!) {"
  }
`;

// "getBookQuery" will return details of one particular book after we pass id to this query
const getBookQuery = gql`
  query($id: ID) {
    # "id" of type "ID" is going in as a query variable
    # we are using the "id" variable to get the actual book
    book(id: $id) {
      # now here will be the details about the particular book
      id
      name
      genre
      author {
        id
        name
        age
        books {
          id
          name
          genre
        }
      }
    }
  }
`;

// since we are exporting multiple things, we do it in object
export { getAuthorsQuery, getBooksQuery, addBookMutation, getBookQuery };
