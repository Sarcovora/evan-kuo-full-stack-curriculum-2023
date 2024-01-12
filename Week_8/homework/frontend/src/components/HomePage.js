import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Javascript } from "@mui/icons-material";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  // console.log("process.env.REACT_APP_BACKEND_URL is " + process.env.REACT_APP_BACKEND_URL)
  const backendURL = `${process.env.REACT_APP_BACKEND_URL}/tasks`;

  useEffect(() => {
    if (currentUser) {
      getTasks(currentUser);
    }
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);

  function getTasks(currentUser) {
    fetch(`${backendURL}/${currentUser.email}`, {
      headers: {
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((item) => {
          return { id: item.id, name: item.name, finished: item.finished };
        });
        // console.log("mappedData is: " + data);
        setTasks(mappedData);
      });
  }

  function addTask() {
    // console.log("addTask was called");
    // Check if task name is provided and if it doesn't already exist.
    if (taskName && !tasks.some((task) => task.task === taskName)) {
      // console.log("got here and backendurl is " + backendURL);
      fetch(`${backendURL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        body: JSON.stringify({
          userID: currentUser.email,
          name: taskName,
          finished: false,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTasks([...tasks, data]);
          setTaskName("");
        });
    } else if (tasks.some((task) => task.task === taskName)) {
      alert("Task already exists!");
    }
  }

  useEffect(() => {
    // remove finished
    tasks.forEach(async (task) => {
      if (task.finished) {
        // console.log(
        //   "TO DELETE TASK ID: " + task.id + " AND NAME: " + task.name
        // );
        // console.log("currentUser.token is: " + currentUser.accessToken);
        await fetch(`${backendURL}/${task.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        })
          .then((response) => {
            if (response.ok && response.status !== 204) {
              return response.json();
            } else {
              // console.log("response is: " + response);
              return null;
            }
          })
          .then(() => {
            const unfinishedTasks = tasks.filter((task) => !task.finished);
            setTasks(unfinishedTasks);
          });
      }
    });
  }, [tasks]);

  function updateTask(id, name, finished) {
    setTasks(
      tasks.map((task) =>
        task.name === name ? { ...task, finished: !task.finished } : task
      )
    );
  }

  // Function to toggle the 'finished' status of a task.
  // function updateTask(id, name, finished) {
  //   console.log(
  //     "updateTask was called with: " + id + " " + name + " " + finished
  //   );
  //   console.log(tasks);
  //   setTasks(
  //     // tasks.map((task) =>
  //     //   task.name === name && task.id === id
  //     //     ? { ...task, finished: !finished }
  //     //     : task
  //     // )
  //     tasks.map((task) =>
  //       task.name === name ? { ...task, finished: !task.finished } : task
  //     )
  //   );
  //   console.log("--------------------");
  //   console.log(tasks);

  //   // remove finished
  //   tasks.forEach(async (task) => {
  //     if (task.finished) {
  //       console.log(
  //         "TO DELETE TASK ID: " + task.id + " AND NAME: " + task.name
  //       );
  //       console.log("currentUser.token is: " + currentUser.accessToken);
  //       await fetch(`${backendURL}/${task.id}`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           accept: "application/json",
  //           Authorization: `Bearer ${currentUser.accessToken}`,
  //         },
  //       }) // This is where I get the unexpected end of JSON input error
  //         // .then((response) => response.json())
  //         .then((response) => {
  //           if (response.ok && response.status !== 204) {
  //             return response.json();
  //           } else {
  //             console.log("response is: " + response);
  //             return null;
  //           }
  //         })
  //         .then(() => {
  //           const unfinishedTasks = tasks.filter((task) => !task.finished);
  //           setTasks(unfinishedTasks);
  //         });
  //     }
  //   });
  // }

  // Function to compute a message indicating how many tasks are unfinished.
  function getSummary() {
    const unfinishedTasks = tasks.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getSummary()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={taskName}
                  placeholder="Type your task here"
                  onChange={(event) => setTaskName(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {tasks.map((task) => (
                <ListItem
                  key={task.id}
                  dense
                  onClick={() => updateTask(task.id, task.name, task.finished)}
                >
                  <Checkbox checked={task.finished} />
                  <ListItemText primary={task.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}
