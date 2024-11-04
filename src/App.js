import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import { CssBaseline } from '@mui/material';

const App = () => {
  const [books, setBooks] = useState([]);

  const addBook = (book) => {
    setBooks((prevBooks) => [
      ...prevBooks,
      { ...book, id: prevBooks.length + 1 },
    ]);
  };

  const editBook = (id, updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === parseInt(id) ? { ...book, ...updatedBook } : book
      )
    );
  };

  const deleteBook = (id) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };

  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<BookList books={books} onDelete={deleteBook} />} />
        <Route path="/add" element={<AddBook onAdd={addBook} />} />
        <Route path="/edit/:id" element={<EditBook books={books} onEdit={editBook} />} />
      </Routes>
    </Router>
  );
};

export default App;
