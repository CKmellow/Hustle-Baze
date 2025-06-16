require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require("crypto");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Configure file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uri = "mongodb+srv://Admin:Hustlebase@hustle-base.goii2xv.mongodb.net/?retryWrites=true&w=majority&appName=Hustle-Base";
const client = new MongoClient(uri);
const jwtSecret = process.env.JWT_SECRET;
// console.log("Loaded JWT Secret:", jwtSecret);

// Connect to the MongoDB database
async function connectToDb() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db("Hustle-db");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Failed to connect to the database');
    }
}

// Middleware for Authentication
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];    
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// POST: Secure Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email|| !password) {
        return res.status(400).json({ message: "Both _id and password are required." });
    }

    try {
        const db = await connectToDb();
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email: email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials." });
        }


        // Generate JWT Token
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: "2h" }
        );

        res.cookie("token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });
        return res.json({ token, user });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

// POST: Signup
app.post('/signup', async (req, res) => {
    const { fname, lname, _id, email, password, role } = req.body;
    if (!fname || !lname || !_id || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address." });
    }

    try {
        const db = await connectToDb();
        const usersCollection = db.collection("users");
        
        const existingUser = await usersCollection.findOne({ $or: [{ _id: _id }, { email: email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this ID or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            fname,
            lname,
            _id,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date()
        };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "Signup Successful" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

// Applications API Endpoints
app.get('/api/applications', authMiddleware, async (req, res) => {
    try {
        const { status, sortBy, search } = req.query;
        const studentID = req.user._id;
        
        const db = await connectToDb();
        const applicationsCollection = db.collection("Applications");
        
        let query = { studentID };
        
        if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
            query.status = status;
        }
        
        if (search) {
            query.$or = [
                { 'internship.title': { $regex: search, $options: 'i' } },
                { 'internship.company': { $regex: search, $options: 'i' } }
            ];
        }
        
        let sortOption = { createdAt: -1 }; // Default: newest first
        if (sortBy === 'oldest') {
            sortOption = { createdAt: 1 };
        }
        
        const applications = await applicationsCollection.find(query)
            .sort(sortOption)
            .toArray();
            
        res.json(applications);
    } catch (err) {
        console.error("Error fetching applications:", err);
        res.status(500).json({ message: err.message });
    }
});

// Upload documents for application
app.post('/api/applications/:id/documents', authMiddleware, upload.fields([
    { name: 'coverLetter', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
]), async (req, res) => {
    try {
        const db = await connectToDb();
        const applicationsCollection = db.collection("Applications");
        
        const application = await applicationsCollection.findOne({
            _id: new ObjectId(req.params.id),
            studentID: req.user._id
        });
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        const updateData = {};
        if (req.files.coverLetter) {
            updateData.coverLetter = req.files.coverLetter[0].path;
        }
        
        if (req.files.cv) {
            updateData.cv = req.files.cv[0].path;
        }
        
        const result = await applicationsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );
        
        res.json({ message: 'Documents uploaded successfully', modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error("Error uploading documents:", err);
        res.status(400).json({ message: err.message });
    }
});

// Download document
app.get('/api/documents/:filename', authMiddleware, async (req, res) => {
    try {
        const filePath = path.join(__dirname, req.params.filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }
        
        res.download(filePath);
    } catch (err) {
        console.error("Error downloading document:", err);
        res.status(500).json({ message: err.message });
    }
});

// Delete application
app.delete('/api/applications/:id', authMiddleware, async (req, res) => {
    try {
        const db = await connectToDb();
        const applicationsCollection = db.collection("Applications");
        
        const result = await applicationsCollection.findOneAndDelete({
            _id: new ObjectId(req.params.id),
            studentID: req.user._id
        });
        
        if (!result.value) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // Delete associated files if they exist
        if (result.value.coverLetter) {
            fs.unlink(result.value.coverLetter, () => {});
        }
        if (result.value.cv) {
            fs.unlink(result.value.cv, () => {});
        }
        
        res.json({ message: 'Application deleted successfully' });
    } catch (err) {
        console.error("Error deleting application:", err);
        res.status(500).json({ message: err.message });
    }
});

// Get application status counts
app.get('/api/student/:studentID/application-status-counts', authMiddleware, async (req, res) => {
    const studentID = req.params.studentID.trim();
    
    if (req.user._id !== studentID && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const db = await connectToDb();
        const applicationsCollection = db.collection("Applications");

        const counts = await applicationsCollection.aggregate([
            { $match: { studentID } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]).toArray();

        const response = {
            pending: 0,
            accepted: 0,
            rejected: 0,
            profileCompletion: 0, // You'll need to implement this
            alerts: [] // You'll need to implement this
        };

        counts.forEach(item => {
            const key = item._id.toLowerCase();
            if (response.hasOwnProperty(key)) {
                response[key] = item.count;
            }
        });

        res.status(200).json(response);
    } catch (error) {
        console.error("Error getting application counts:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

// Get all internships with filters
app.get('/api/internships', async (req, res) => {
  try {
    const { title, location, orgName, deadline } = req.query;
    const db = await connectToDb();
    const internshipsCollection = db.collection("Internships");

    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (orgName) {
      query.orgName = { $regex: orgName, $options: 'i' };
    }

    if (deadline) {
      query.deadline = { $gte: new Date(deadline) };
    }

    const internships = await internshipsCollection.find(query).toArray();
    res.json(internships);
  } catch (err) {
    console.error("Error fetching internships:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ filePath: req.file.path });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ message: "File upload failed" });
  }
});

// Create new application
app.post('/api/applications', authMiddleware, async (req, res) => {
  try {
    const db = await connectToDb();
    const applicationsCollection = db.collection("Applications");
    
    // Verify the internship exists
    const internshipsCollection = db.collection("Internships");
    const internship = await internshipsCollection.findOne({ 
      _id: new ObjectId(req.body.internship) 
    });
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    const application = {
      internshipID: req.body.internship,
      studentID: req.user._id,
      status: req.body.status || 'pending',
      feedback: req.body.feedback || 'N/A',
      coverLetter: req.body.coverLetter,
      cv: req.body.cv,
      applicationDate: new Date(req.body.applicationDate || Date.now()),
      createdAt: new Date()
    };
    
    const result = await applicationsCollection.insertOne(application);
    
    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.insertedId
    });
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ message: "Failed to submit application" });
  }
});

// // Get ALL internships (no filters)
// app.get('/api/internships', async (req, res) => {
//   try {
//     const db = await connectToDb();
//     const internships = await db.collection('Internships').find({}).toArray();
//     res.json(internships);
//   } catch (err) {
//     console.error('Error fetching internships:', err);
//     res.status(500).json({ message: 'Server error. Failed to fetch internships.' });
//   }
// });

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});