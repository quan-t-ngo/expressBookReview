const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

/*
 * Register New User
 */
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (!isValid(username)) {
        return res.status(409).json({ message: "User already exists!" });
    }

    users.push({
        username,
        password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});


/*
 * Get all books
 */
public_users.get("/", (req, res) => {
    return res.status(200).json(books);
});


/*
 * Get book by ISBN
 */
public_users.get("/isbn/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });

});


/*
 * Get books by Author
 */
public_users.get("/author/:author", (req, res) => {

    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );

    return res.status(200).json(result);

});


/*
 * Get books by Title
 */
public_users.get("/title/:title", (req, res) => {

    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(
        book => book.title.toLowerCase() === title
    );

    return res.status(200).json(result);

});


/*
 * Get book reviews
 */
public_users.get("/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });

});


/******************************************************************
 *                  TASK 10-13 (Axios)
 ******************************************************************/

/*
 * Task 10
 * Get all books using async/await with Axios
 */
public_users.get("/async/books", async (req, res) => {

    try {

        const response = await axios.get("http://localhost:5001/");

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});


/*
 * Task 11
 * Get book by ISBN using Promise callbacks
 */
public_users.get("/async/isbn/:isbn", (req, res) => {

    axios
        .get(`http://localhost:5001/isbn/${req.params.isbn}`)
        .then(response => {
            return res.status(200).json(response.data);
        })
        .catch(err => {
            return res.status(500).json({
                message: err.message
            });
        });

});


/*
 * Task 12
 * Get books by Author using async/await
 */
public_users.get("/async/author/:author", async (req, res) => {

    try {

        const response = await axios.get(
            `http://localhost:5001/author/${encodeURIComponent(req.params.author)}`
        );

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});


/*
 * Task 13
 * Get books by Title using async/await
 */
public_users.get("/async/title/:title", async (req, res) => {

    try {

        const response = await axios.get(
            `http://localhost:5001/title/${encodeURIComponent(req.params.title)}`
        );

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});


module.exports.general = public_users;
