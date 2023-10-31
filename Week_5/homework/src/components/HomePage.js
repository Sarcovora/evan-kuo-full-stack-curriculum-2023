import React, {useState, useEffect} from "react";
import {
    Container, Typography, TextField, Button, List, ListItem, ListItemText, Checkbox, Box, Grid,
} from "@mui/material";
import Header from "./Header";
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext'
import axios from 'axios';
import {Javascript} from "@mui/icons-material";


export default function HomePage() {
    const navigate = useNavigate();

    const {currentUser} = useAuth();

    useEffect(() => {
        if (!currentUser) {
            // kick them out
            navigate('/login');
        }
    }, [currentUser])

    const [tasks, setTasks] = useState([]);


    useEffect(() => {
        if (currentUser) {
            axios.get(`https://tpeo-todo.vercel.app/tasks/`)
                .then((response) => {
                    console.log("API Response:", response.data);
                    // filter the tasks to only include the current user's tasks
                    console.log("Current User: ", currentUser);
                    const filteredTasks = response.data.filter((task) => task.user.username === currentUser.username);
                    console.log("Filtered tasks:", filteredTasks);
                    setTasks(filteredTasks);
                })
                .catch((error) => {
                    console.error('Error fetching tasks:', error);
                });
        }
    }, [currentUser]);


    // State for the task name being entered by the user.
    const [taskName, setTaskName] = useState("");

    // TODO: Support retrieving your todo list from the API.
    // Currently, the tasks are hardcoded. You'll need to make an API call
    // to fetch the list of tasks instead of using the hardcoded data.


    function addTask() {
        // Check if task name is provided and if it doesn't already exist.
        if (taskName && !tasks.some((task) => task.task === taskName)) {

            // TODO: Support adding todo items to your todo list through the API.
            // In addition to updating the state directly, you should send a request
            // to the API to add a new task and then update the state based on the response.

            axios.post('https://tpeo-todo.vercel.app/tasks', {
                user: currentUser, task: taskName, finished: false,
            })
                .then((response) => {
                    setTasks([...tasks, response.data]);
                    setTaskName('');
                    console.log("Adding task: ", response.data)
                })
                .catch((error) => {
                    console.error('Error adding task:', error);
                });

            // setTasks([...tasks, { name: taskName, finished: false }]);
            // setTaskName("");
        } else if (tasks.some((task) => task.task === taskName)) {
            alert("Task already exists!");
        }
    }

    // Function to toggle the 'finished' status of a task.
    function updateTask(id, name, finished) {
        axios.delete(`https://tpeo-todo.vercel.app/tasks/${id}`)
            .then(() => {
                setTasks(tasks.filter((task) => task.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
        console.log("Deleted task with id: " + id + " and name: " + name + " and finished: " + finished);
    }


    // Function to compute a message indicating how many tasks are unfinished.
    function getSummary() {
        const unfinishedTasks = tasks.filter((task) => !task.finished).length;
        return unfinishedTasks === 1 ? `You have 1 unfinished task` : `You have ${unfinishedTasks} tasks left to do`;
    }

    return (<>
            <Header/>
            <Container component="main" maxWidth="sm">
                {/* Main layout and styling for the ToDo app. */}
                <Box
                    sx={{
                        marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center",
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
                        <List sx={{marginTop: 3}}>
                            {tasks.map((task) => (<ListItem
                                    key={task.id}
                                    dense
                                    onClick={() => updateTask(task.id, task.task, task.finished)}
                                >
                                    <Checkbox
                                        checked={task.finished}
                                    />
                                    <ListItemText primary={task.task}/>
                                </ListItem>))}
                        </List>
                    </Box>
                </Box>
            </Container>
        </>);
}
