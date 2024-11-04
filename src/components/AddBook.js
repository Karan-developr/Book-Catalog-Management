import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';

const AddBook = ({ onAdd }) => {
  const [formData, setFormData] = useState({ title: '', author: '', genre: '', year: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

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

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading delay
      onAdd(formData);
      setMessage('Book added successfully!');
      setMessageType('success');
      navigate('/');
    } catch {
      setMessage('Failed to add the book.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setMessage('');
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '32px' }}>
      <Typography variant="h4" gutterBottom>
        Add New Book
      </Typography>
      <form onSubmit={handleSubmit}>
        {['title', 'author', 'genre', 'year'].map((field) => (
          <TextField
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            fullWidth
            value={formData[field]}
            onChange={handleChange}
            margin="normal"
            error={!!errors[field]}
            helperText={errors[field]}
            type={field === 'year' ? 'number' : 'text'}
          />
        ))}
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }} disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
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

export default AddBook;
