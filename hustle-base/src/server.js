require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require("crypto");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const uri = "mongodb+srv://Admin:Hustlebase@hustle-base.goii2xv.mongodb.net/?retryWrites=true&w=majority&appName=Hustle-Base";
const client = new MongoClient(uri);
const jwtSecret = process.env.JWT_SECRET;
console.log("Loaded JWT Secret:", jwtSecret);


// Connect to the MongoDB database
async function connectToDb() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db("qrcodeAttendance");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Failed to connect to the database');
    }
}

// **Middleware for Authentication**
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;    
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// **POST: Secure Login**
app.post('/login', async (req, res) => {
    const { _id, password } = req.body;

    if (!_id || !password) {
        return res.status(400).json({ message: "Both _id and password are required." });
    }

    try {
        const db = await connectToDb();
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ _id: _id });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // **Generate JWT Token**
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: "2h" }
        );
        console.log(token);

        if (!jwtSecret) {
            console.error("JWT_SECRET is missing from .env");
            process.exit(1); // Stop the server if the secret is not set
        }

        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Strict" });
        return res.json({ token, user }); // Removed unreachable response

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

app.post('/signup', async (req, res) => {
  const { fname, lname, _id, email, password, role }=req.body;
  if(!fname||!lname||!_id||!email||!password||!role){
    return res.status(400).json({ message: "All fields are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }


try{
  const db = await connectToDb();
  const usersCollection =db.collection("users");
  
  const existingUser = await usersCollection.findOne({ $or:[{id: _id},{ email: email}] });
  if(existingUser){
    return res.status(400).json({ message: 'User with this ID or email already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    fname: fname,
    lname: lname,
    _id: _id,
    email: email,
    password: hashedPassword,
    role: role,
  };
  await usersCollection.insertOne(newUser);
  res.status(201).json({message:"Signup Successful"});
}
catch(error){
  console.error("Error during signup:", error);
  res.status(500).json({ message: "Server error. Please try again later." });
}
});

// GET application status counts for a student
app.get('/api/student/:studentID/application-status-counts', async (req, res) => {
  const studentID = req.params.studentID.trim();
  console.log("Fetching counts for studentID:", studentID);

  try {
    const db = await connectToDb();
    const applicationsCollection = db.collection("Applications");

    const matchingDocs = await applicationsCollection.find({ studentID: studentID }).toArray();
    console.log("Matching documents:", matchingDocs);

    const counts = await applicationsCollection.aggregate([
      { $match: { studentID: studentID } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log("Aggregated counts:", counts);

    const response = {
      pending: 0,
      accepted: 0,
      rejected: 0
    };

    counts.forEach(item => {
      const key = item._id.toLowerCase();
      if (response.hasOwnProperty(key)) {
        response[key] = item.count;
      }
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Full error:", error.stack || error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


app.get('/api/admin/Applications',  async (req, res) => {
    try {
        const db = await connectToDb();
        const usersCollection = db.collection("Applications");
        const Applications = await usersCollection.find().toArray();
        res.status(200).json(Applications);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});




// **Start the server**
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});