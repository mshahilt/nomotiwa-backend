const express = require('express');
const router = express.Router();
const { 
  getDoctors, 
  addDoctor, 
  updateDoctor, 
  deleteDoctor,
  getDoctorSlots,
  bookSlot
} = require('../controller/hostpitalController');

// Health check route
router.get('/', (req, res) => {
    res.json({ status: 'healthy', message: 'Server is running' });
});

// Doctor management routes
router.get('/doctors', getDoctors);
router.post('/doctors', addDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Token management routes
router.get('/doctors/:doctorId/tokens', getDoctorSlots);  // Get booked tokens for a date
router.post('/doctors/:doctorId/tokens/book', bookSlot);  // Book a new token (auto-increments token number)

// Documentation route
router.get('/api-docs', (req, res) => {
    res.json({
        endpoints: {
            doctors: {
                'GET /doctors': 'Get all doctors',
                'POST /doctors': 'Add a new doctor',
                'PUT /doctors/:id': 'Update doctor details',
                'DELETE /doctors/:id': 'Delete a doctor'
            },
            tokens: {
                'GET /doctors/:doctorId/tokens': 'Get all booked tokens for a specific date (use ?date=YYYY-MM-DD)',
                'POST /doctors/:doctorId/tokens/book': 'Book a new token with auto-generated token number (send date and patientInfo in body)'
            }
        }
    });
});

module.exports = router;