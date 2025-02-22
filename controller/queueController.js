const Queue = require('../models/Queue');

const Doctor = require('../models/Doctor')


exports.addToken = async (req, res) => {
  try {
    const lastToken = await Queue.findOne().sort({ tokenNumber: -1 });
    const newTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const token = new Queue({ tokenNumber: newTokenNumber });
    await token.save();

    req.io.emit('queue_update', newTokenNumber); // Send real-time update
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCurrentQueue = async (req, res) => {
  try {
    const currentQueue = await Queue.findOne({ isCompleted: false }).sort({ tokenNumber: 1 });
    res.status(200).json({ queueNumber: currentQueue ? currentQueue.tokenNumber : 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeToken = async (req, res) => {
  try {
    const currentQueue = await Queue.findOne({ isCompleted: false }).sort({ tokenNumber: 1 });

    if (currentQueue) {
      currentQueue.isCompleted = true;
      await currentQueue.save();

      const nextQueue = await Queue.findOne({ isCompleted: false }).sort({ tokenNumber: 1 });
      req.io.emit('queue_update', nextQueue ? nextQueue.tokenNumber : 0); // Send real-time update
    }

    res.status(200).json({ success: true, message: 'Queue updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
