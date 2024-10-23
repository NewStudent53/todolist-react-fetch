import React, { useState, useEffect } from 'react';
import '../component/index.css';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch initial tasks from API
    fetch('https://playground.4geeks.com/todo/user/alesanchezr')
      .then(response => response.json())
      .then(data => {
        // Ensure data is an array before setting tasks
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (input.trim()) {
        const newTasks = [...tasks, input];
        setTasks(newTasks);
        setInput('');
        updateTasksOnServer(newTasks);
      }
    }
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((task, i) => i !== index);
    setTasks(newTasks);
    updateTasksOnServer(newTasks);
  };

  const updateTasksOnServer = (tasks) => {
    fetch('https://playground.4geeks.com/todo/user/alesanchezr', {
      method: "PUT",
      body: JSON.stringify(tasks),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => console.log('Tasks updated:', data))
    .catch(error => console.error('Error updating tasks:', error));
  };

  const clearTasks = () => {
    const emptyTasks = [];
    setTasks(emptyTasks);
    updateTasksOnServer(emptyTasks);
  };

  return (
    <div className="Home">
      <h1>todos</h1>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addTask}
      />
      <button onClick={addTask}>Add</button>
      <button onClick={clearTasks}>Clear All</button>
      <ul>
        {tasks.length === 0 ? (
          <p>No tasks, add a task</p>
        ) : (
          tasks.map((task, index) => (
            <li key={index} onMouseOver={() => document.getElementById(`del-${index}`).style.display = 'inline'} onMouseOut={() => document.getElementById(`del-${index}`).style.display = 'none'}>
              {task}
              <span id={`del-${index}`} style={{ display: 'none' }} onClick={() => deleteTask(index)}>❌</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Home;
