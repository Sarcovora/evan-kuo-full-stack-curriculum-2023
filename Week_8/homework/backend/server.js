// Importing required modules
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Creating an instance of Express
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");

// Middlewares to handle cross-origin requests and to parse the body of incoming requests to JSON
app.use(cors());
app.use(express.json());

const auth = (req, res, next) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    admin
      .auth()
      .verifyIdToken(tokenId)
      .then((decoded) => {
        req.token = decoded;
        next();
      })
      .catch((err) => res.status(401).send(err));
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

// Your API routes will go here...

// GET: Endpoint to retrieve all tasks
app.get("/tasks", async (req, res) => {
  try {
    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("tasks").get();

    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id, // Document ID from Firestore
        ...doc.data(), // Document data
      });
    });

    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// GET: Endpoint to retrieve all tasks for a user
app.get("/tasks/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    // console.log("from getting all tasks: " + req.params);

    // Fetch all documents from tasks collection for a specific user
    const snapshot = await db
      .collection("tasks")
      .where("userID", "==", userID)
      .get();
    let tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST: Endpoint to add a new task
app.post("/tasks", async (req, res) => {
  try {
    // Fetching the request body
    const userID = req.body.userID;
    const userTask = req.body.name;
    const finished = req.body.finished;
    const data = {
      'userID': userID,
      'name': userTask,
      'finished': finished,
    };
    // Adding a new document to the "tasks" collection
    const addedTask = await db.collection("tasks").add(data);
    // console.log(addedTask.id);

    res.status(201).send({
      id: addedTask.id,
      ...data,
    });

    // Sending a successful response
  } catch (error) {
    // console.log("adding new task failed with err: " + error.message)
    res.status(500).send(error.message);
  }
});

// DELETE: Endpoint to remove a task
app.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("tasks").doc(id).delete();
    res.status(204).send();
    // console.log("delete task success")
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
