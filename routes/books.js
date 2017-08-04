'use strict';

const express = require('express');
const knex = require('../knex');


// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title', 'ASC')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt')
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});


router.get('/books/:id', (req, res, next) => {
  // COMMENT: make sure that id is a number,
  // COMMENT: if it is not a number, send a 400 (Bad Request)

  knex('books')
    .where('id', req.params.id)
    .first()
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt')
    .then((book) => {
      if (!book) {
        return next(err);
      }

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});


router.post('/books', (req, res, next) => {
  // COMMENT: Makes sure that the information that you want is in the
  // COMMENT: request body.

  knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }, '*')
    .then((book) => {
      const newObj = {
        id: book[0].id,
        title: book[0].title,
        author: book[0].author,
        genre: book[0].genre,
        description: book[0].description,
        coverUrl: book[0].cover_url
      }
      res.send(newObj);
    })
    .catch((err) => {
      next(err);
    });
});


router.patch('/books/:id', (req, res, next) => {
  // COMMENT: Make sure that id is a number

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      return knex('books')
        .update(
          {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            description: req.body.description,
            cover_url: req.body.coverUrl
          }, '*')
        .where('id', req.params.id);
    })
    .then((books) => {
      const newObj = {
        id: books[0].id,
        title: books[0].title,
        author: books[0].author,
        genre: books[0].genre,
        description: books[0].description,
        coverUrl: books[0].cover_url
      }
      res.send(newObj);
    })
    .catch((err) => {
      next(err);
    });
});


router.delete('/books/:id', (req, res, next) => {
  let book;

  // COMMENT: Make sure that id is a number

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }

      book = row;

      return knex('books')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      // COMMENT: You only need to delete the id if you are sending the object
      // COMMENT: Back in the response.
      // COMMENT: In this case, you are creating a brand new object, and not
      // COMMENT: including the id. Which works great.
      delete book.id;
      const newObj = {
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        coverUrl: book.cover_url
      }
      res.send(newObj);
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
