// schema will describe how our data will be
const graphql = require("graphql");
const _ = require("lodash");

const Book = require("../models/book"); // importing actual schema from "book.js" file
const Author = require("../models/author"); // importing actual schema from "author.js" file

// our graph has two types of objects, "books" and "author"
// so we need to describe these object types in the schema File

// we are grabbing the function "GraphQLObjectType" and "GraphQLString" from the
// package "graphql"
// later on we have grabbed GraphQLSchema too
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// dummy data
// var books = [
//   { name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },
//   { name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2" },
//   { name: "The Hero of Ages", genre: "Fantasy", id: "4", authorId: "2" },
//   { name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "3" },
//   { name: "The Colour of Magic", genre: "Fantasy", id: "5", authorId: "3" },
//   { name: "The Light Fantastic", genre: "Fantasy", id: "6", authorId: "3" }
// ];

// var authors = [
//   { name: "Patrick Rothfuss", age: 44, id: "1" },
//   { name: "Brandon Sanderson", age: 42, id: "2" },
//   { name: "Terry Pratchett", age: 66, id: "3" }
// ];

// we are defining a new object book
// GraphQLObjectType is a function which takes in an object which
// defines how each book is going to be
const BookType = new GraphQLObjectType({
  name: "Book", // name of the object is "Book"
  fields: () => ({
    // fields specify what will be the fields in the object
    id: { type: GraphQLID }, // "id" is String (we cant just write "String"
    // instead we have to call it "GraphQLString")
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType, // now author is an objcet of type "AuthorType"
      //(that we have defined below)
      resolve(parent, args) {
        // resolve function is responsible for going out and grabbing data
        // and returning whatever is needed
        // console.log(parent);
        //return _.find(authors, { id: parent.authorId }); // now resolve function will look into
        // array of authors (dummy data) and wherever "id " matches
        // authordId of "books" array (means parent here refers to
        // book object), it will return information about that author

        return Author.findById(parent.authorId);
        // because here we wanted to return information about author
        // now information about author is present in "Author" collection(or model)
        // we are using the method "findById" which takes id and will return corresponding
        // record. since we have access to parent (means here book), we are taking authorId from
        // book
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return _.filter(books, { authorId: parent.id });

        return Book.find({ authorId: parent.id });
        // since we want to return all books by that author, we are using find method
        // and now in "Book" collection, wherever "authorId" mathces id in args
        // that record will be returned
      }
    }
  })
});

// Basically our user can
// get the information about all books
// get the information about one particular book
// get the information about all authors
// get the information about one particular author
// so these act as initial jumping points of User
// hence we need to write four root queries

// This is the query for a particular book
// RootQuery is how we initially jump in the graph
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType", // this is the name of the object
  fields: {
    // in fields there are different options, how we can jump into graph
    book: {
      // now in the front end, we have to call this query "book"
      type: BookType, // type of the data the we are querying is of "BookType
      //which we defined above"
      // In "args", we specify the arguments that user shoud pass to this query
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //console.log(typeof args.id);
        // when we receive the query, resolve funtion is invoked by the server
        //resolve function takes in two parameters
        // args is the same parameter that user passes
        //In resolve function, we write the code to get the data from database.
        // code to get data from db / other source
        //return _.find(books, { id: args.id });
        // we are searching in "books" array (which is our dummy data above) using id
        // when the associated query comes in, resolve function will be fired
        // now using lodash we are finding the book in books array

        // In this root query, they are going to pass a book id and want to return
        // book which mathces that ID
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(authors, { id: args.id });

        return Author.findById(args.id);
      }
    },
    books: {
      // we are adding one more "end-point", user will now be able to see list of all books
      type: new GraphQLList(BookType), // since we want to return all the books, its type will be
      // list of books hence "list of booktype"
      resolve(parent, args) {
        // and now resolve function will just now return our array of books
        // and graph QL internally takes care of which fields to be displayed

        //when we pass empty object to find, it returns everything
        return Book.find({});
      }
    },
    authors: {
      // we are adding one more "end-point", user will now be able to see list of all authors
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        //return authors;
        return Author.find({});
      }
    }
  }
});

//just like we created root query, we are going to create mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation", // this is the name of mutation object
  fields: {
    // fields property allow us to define different types of mutations
    // for example "add author" or "add book" or "delete author"
    addAuthor: {
      // because of this mutation, we will be able to add the author
      type: AuthorType, // because we are adding a new author
      // args property means the arguments that user passes while adding author
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      // once we receive the arguments, what we should do, that is specified in
      // resolve function
      resolve(parent, args) {
        let author = new Author({
          // this "Author" on RHS is actually a model that we
          // imported from schema (from "author.js" file
          // in models directory)
          // we are creating new local variable called author(which is actually an object)
          // name and age of that new author are equated to name and age supplied in args
          name: args.name,
          age: args.age
        });
        return author.save(); // we are using save method of mongoose
        // mongoose knows where to save this new object
        // because we specified so in "author.js" file in models directory
        // and mongoose knows the database because we have specified which is the
        // database in the statement "mongoose.connect(........)"
      }
    },
    addBook: {
      type: BookType,
      args: {
        // if we want particular field to be non null, we do it by using
        // "GraphQLNonNull"
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  //we are exporting the schema that we just made
  query: RootQuery,
  //and inside GraphQLSchema we are passing our root query
  mutation: Mutation // we are sort of registering our mutation
});
