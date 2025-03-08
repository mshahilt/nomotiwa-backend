const sendEmail = require('../config/nodemailer').default;
const Otp = require('../models/Otp');
const Doctor = require('../models/Doctor');
const TokenCounter = require('../models/TokenCounter');

const authenticateUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const info = await sendEmail(email, otp);
        if (!info) {
            return res.status(500).json({ success: false, message: "Failed to send email" });
        }
        await Otp.deleteOne({ email });

        const newOTP = new Otp({ email, otp });
        await newOTP.save();

        return res.status(200).json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        console.error("Error authenticating user:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;


        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (otpRecord.expiresAt < new Date()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
        }

        await Otp.deleteOne({ email });

        return res.status(200).json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
const getUserWithEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const doctors = await Doctor.find({ "slots.patientInfo.email": email });

        if (!doctors.length) {
            return res.status(404).json({ success: false, message: "No appointments found for this email" });
        }

        const appointmentsMap = new Map();

        for (const doctor of doctors) {
            // Fetch the latest token for the doctor
            const currentTokenData = await TokenCounter.findOne({ doctorId: doctor._id }).sort({ date: -1 });

            const patients = doctor.slots
                .filter(slot => slot.patientInfo.email === email)
                .map(slot => ({
                    date: slot.date,
                    tokenNumber: slot.tokenNumber,
                    patientInfo: slot.patientInfo
                }));

            if (patients.length) {
                if (!appointmentsMap.has(doctor.id)) {
                    appointmentsMap.set(doctor.id, {
                        doctorId: doctor.id,
                        doctorName: doctor.name,
                        specialization: doctor.specialization,
                        currentToken: currentTokenData ? currentTokenData.currentToken : null,
                        patients: []
                    });
                }
                appointmentsMap.get(doctor.id).patients.push(...patients);
            }
        }

        return res.status(200).json({ success: true, appointments: Array.from(appointmentsMap.values()) });

    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


module.exports = { authenticateUser, verifyOTP, getUserWithEmail};