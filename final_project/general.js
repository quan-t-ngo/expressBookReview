const express = require('express');
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

/**
 * Register a new user
 */
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

/**
 * GET all books
 */
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

/**
 * GET book by ISBN
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    }

    return res.status(404).json({ message: "Book not found" });
});

/**
 * GET books by author
 */
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    let result = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );

    return res.status(200).json(result);
});

/**
 * GET books by title
 */
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    let result = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
    );

    return res.status(200).json(result);
});

/**
 * GET book reviews by ISBN
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    }

    return res.status(404).json({ message: "No reviews found" });
});

module.exports.general = public_users;