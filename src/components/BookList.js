import React, { useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';

const BookList = ({ books, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBooks = filteredBooks.sort((a, b) => {
    const comparison = sortBy === 'year' ? a.year - b.year : a[sortBy].localeCompare(b[sortBy]);
    return order === 'desc' ? -comparison : comparison;
  });

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Book Catalog
      </Typography>
      <Button component={Link} to="/add" variant="contained" color="primary" style={{ marginBottom: '16px' }}>
        Add Book
      </Button>
      <TextField
        label="Search by Title or Author"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginLeft: '16px', marginBottom: '16px', width: '300px' }}
      />
      <Select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        variant="outlined"
        style={{ marginLeft: '16px', marginBottom: '16px', width: '200px' }}
      >
        <MenuItem value="title">Sort by Title</MenuItem>
        <MenuItem value="author">Sort by Author</MenuItem>
        <MenuItem value="year">Sort by Year</MenuItem>
      </Select>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['title', 'author', 'year'].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={sortBy === column}
                    direction={order}
                    onClick={() => {
                      setSortBy(column);
                      setOrder(order === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Genre</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.year}</TableCell>
                  <TableCell>
                    <Button component={Link} to={`/edit/${book.id}`} color="primary">
                      Edit
                    </Button>
                    <Button onClick={() => onDelete(book.id)} color="secondary" style={{ marginLeft: '8px' }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedBooks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
};

export default BookList;
