const express = require('express');
const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri_local = "mongodb://127.0.0.1:27017"; 
const uri = "mongodb+srv://test:test123@cluster0.cmvmn.mongodb.net/"
const dbName = "coding_students";

// Middleware
app.use(express.json());

let db, courses;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        courses = db.collection("courses");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all students
app.get('/courses/:courseCode', async (req, res) => {
    try {
        const courseCode = req.params.courseCode;
        const result = await courses.find({ courseCode }).toArray();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

app.get('/courses/name/:courseName', async (req, res) => {
    try {
        const courseName = req.params.courseName;
        const result = await courses.find({ courseName }).toArray();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send("Error fetching courseName: " + err.message);
    }
});




app.get("/courses/_id/:_oid", async (req, res) => {
    try {
      const _oid = new ObjectId(req.params._oid);
      console.log("Object ID: ", _oid);
      const result = await courses.findOne({ _id: _oid });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).send("Error fetching course: " + err.message);
    }
  });


// POST: Add a new student
app.post('/courses/:courseCode', async (req, res) => {
    try {
        const newCourse = req.body;
        const result = await courses.insertOne(newCourse);
        res.status(201).send(`Student added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding course: " + err.message);
    }
});

app.post('/courses/:courseName', async (req, res) => {
    try {
        const newCourse = req.body;
        const result = await courses.insertOne(newCourse);
        res.status(201).send(`Student added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding course: " + err.message);
    }
});


app.post("/courses/_id/:_oid", async (req, res) => {
    try {
      const _oid = new ObjectId(req.params._oid);
      const newCourse = req.body;
      const result = await courses.insertOne(newCourse);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).send("Error adding course: " + err.message);
    }
  });
  



// PUT: Update a student completely
app.put('/courses/:courseCode', async (req, res) => {
    try {
        const courseCode = req.params.courseCode;
        const updatedCourse = req.body;
        const result = await courses.replaceOne({ courseCode }, updatedCourse);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating course: " + err.message);
    }
});

app.put("/courses/_id/:_oid", async (req, res) => {
    try {
      const _oid = new ObjectId(req.params._oid);
      const updatedCourse = req.body;
      const result = await courses.replaceOne({ _id: _oid }, updatedCourse);
      res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
      res.status(500).send("Error updating course: " + err.message);
    }
  });
  


// PATCH: Partially update a student
app.patch('/courses/:courseCode', async (req, res) => {
    try {
        const courseCode = req.params.courseCode;
        const updates = req.body;
        const result = await courses.updateOne({ courseCode }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating course: " + err.message);
    }
});


app.patch("/courses/_id/:_oid", async (req, res) => {
    try {
      const _oid = new ObjectId(req.params._oid);
      const updates = req.body;
      const result = await courses.updateOne({ _id: _oid }, { $set: updates });
      res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
      res.status(500).send("Error partially updating course: " + err.message);
    }
  });
  

// DELETE: Remove a student
app.delete('/courses/:courseCode', async (req, res) => {
    try {
        const courseCode = req.params.courseCode;
        const result = await courses.deleteOne({ courseCode });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting course: " + err.message);
    }
});


app.delete("/courses/_id/:_oid", async (req, res) => {
    try {
      const _oid = new ObjectId(req.params._oid);
      const result = await courses.deleteOne({ _id: _oid });
      res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
      res.status(500).send("Error deleting course: " + err.message);
    }
  });