import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Container, Snackbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Joi from 'joi';

const EditBook = ({ books, onEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find(b => b.id === parseInt(id));

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const schema = Joi.object({
    title: Joi.string().required().messages({
      'string.empty': 'Title cannot be empty.',
      'string.min': 'Title must be at least 3 characters long.',
    }),
    author: Joi.string().required().messages({
      'string.empty': 'Author cannot be empty.',
      'string.min': 'Author must be at least 3 characters long.',
    }),
    genre: Joi.string().required().messages({
      'string.empty': 'Genre cannot be empty.',
    }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
      'number.base': 'Year must be a valid number.',
      'number.empty': 'Year cannot be empty.',
      'number.min': 'Year must be at least 1900.',
      'number.max': 'Year cannot be in the future.',
    }),
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset errors

    const { error } = schema.validate(formData, { abortEarly: false });
    if (error) {
      const newErrors = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message;
        return acc;
      }, {});
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Simulate API call to update the book
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading delay
      onEdit(id, formData);
      setMessage('Book updated successfully!');
      setMessageType('success');
      navigate('/');
    } catch {
      setMessage('Failed to update the book.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setMessage('');
  };

  if (!book) return <Typography>Book not found</Typography>;

  return (
    <Container maxWidth="sm" style={{ marginTop: '32px' }}>
      <Typography variant="h4" gutterBottom>
        Edit Book
      </Typography>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <TextField
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            name={key}
            fullWidth
            value={value}
            onChange={handleChange}
            margin="normal"
            error={!!errors[key]}
            helperText={errors[key]}
            type={key === 'year' ? 'number' : 'text'}
          />
        ))}
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }} disabled={loading}>
          {loading ? 'Updating...' : 'Update Book'}
        </Button>
      </form>
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={message}
        severity={messageType}
      />
    </Container>
  );
};

export default EditBook;
