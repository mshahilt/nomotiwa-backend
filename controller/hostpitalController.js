
const Doctor = require('../models/Doctor');

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

const addDoctor = async (req, res) => {
  try {
    const { name, specialization } = req.body;
    const newDoctor = await Doctor.create({ 
      name, 
      specialization,
      slots: [] 
    });
    console.log(newDoctor);
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Error adding doctor' });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { name, specialization, availability } = req.body;
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id, 
      { name, specialization, availability }, 
      { new: true }
    );
    if (!updatedDoctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor' });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor' });
  }
};

const getDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const dateSlots = doctor.slots.filter(slot => 
      slot.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );

    res.json({ slots: dateSlots });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slots', error: error.message });
  }
};

const generateDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get existing slots for the date
    const existingSlots = doctor.slots.filter(slot => 
      slot.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );

    // If no slots exist for this date, create the first slot
    if (existingSlots.length === 0) {
      const firstSlot = {
        tokenNumber: 1,
        status: 'available',
        date: new Date(date),
        patientId: null,
        patientInfo: null
      };
      doctor.slots.push(firstSlot);
      await doctor.save();
      res.json({ message: 'First token created', slots: [firstSlot] });
    } else {
      res.json({ slots: existingSlots });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error managing tokens', error: error.message });
  }
};

const bookSlot = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { patientInfo, date } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get the slots for the specified date
    const dateSlots = doctor.slots.filter(slot => 
      slot.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );

    // Create a new token with incremented number
    const newTokenNumber = dateSlots.length > 0 
      ? Math.max(...dateSlots.map(slot => slot.tokenNumber)) + 1 
      : 1;

    const newSlot = {
      tokenNumber: newTokenNumber,
      status: 'booked',
      date: new Date(date),
      patientInfo
    };

    doctor.slots.push(newSlot);
    await doctor.save();

    res.json({ message: 'Token booked successfully', slot: newSlot });
  } catch (error) {
    res.status(500).json({ message: 'Error booking token', error: error.message });
  }
};

module.exports = {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorSlots,
  generateDoctorSlots,
  bookSlot
};