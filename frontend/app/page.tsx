'use client';

import { useEffect, useState } from 'react';
import { getTasks, createTask, toggleTaskComplete, deleteTask } from '../lib/api';
import './pro-style.css';

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdHVzZXIiLCJleHAiOjE3NzEwMTE3NTd9.UAZk66Nvg4gRmZs_xr5Qr3LuyhrXNfeRhoSL4L2Oh10";

  useEffect(() => {
    getTasks(token).then(setTasks);
  }, []);

  const handleToggle = async (id: number) => {
    const updated = await toggleTaskComplete(id, token);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updated.id ? { ...task, completed: updated.completed } : task
      )
    );
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id, token);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="pro-container">
      <h1 className="pro-header">My Tasks</h1>

      {/* Add Task Form */}
      <form
        className="pro-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const title = (e.target as any).title.value;
          const description = (e.target as any).description.value;

          const newTask = await createTask(title, description, token);
          if (newTask) setTasks((prev) => [...prev, newTask]);

          (e.target as any).reset();
        }}
      >
        <input
          name="title"
          placeholder="Task Title"
          required
        />
        <input
          name="description"
          placeholder="Description"
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <ul className="pro-task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`pro-task ${task.completed ? 'completed' : ''}`}>
            <span>
              <strong>{task.title}</strong>
              {task.description && ` - ${task.description}`}
            </span>
            <div>
              <button
                className="complete-btn"
                onClick={() => handleToggle(task.id)}
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
