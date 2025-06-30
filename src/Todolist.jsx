import React, { useState, useEffect } from 'react';
import './todoList.css';
import { v4 as uuidv4 } from 'uuid';
import checkicon from './assets/check2-circle.svg';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');


    useEffect(() => {
        const storedTasks = localStorage.getItem('todoTasks');
        if (storedTasks) {
            try {
                const parsedTasks = JSON.parse(storedTasks);
                if (
                    Array.isArray(parsedTasks) &&
                    parsedTasks.every(
                        t =>
                            typeof t.id === 'string' &&
                            typeof t.text === 'string' &&
                            typeof t.completed === 'boolean'
                    )
                ) {
                    setTasks(parsedTasks);
                }
            } catch (e) {

                localStorage.removeItem('todoTasks');
            }
        }
    }, []);



    useEffect(() => {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAdd = () => {
        const text = inputValue.trim();
        if (!text) return;
        setTasks([{ id: uuidv4(), text, completed: false }, ...tasks]);
        setInputValue('');
    };

    const handleDelete = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const moveup = (id) => {
        const index = tasks.findIndex(task => task.id === id);
        if (index > 0) {
            const updatetasks = [...tasks];
            [updatetasks[index - 1], updatetasks[index]] = [updatetasks[index], updatetasks[index - 1]];
            setTasks(updatetasks);
        }
    }
    const movedown = (id) => {
        const index = tasks.findIndex(task => task.id === id);
        if (index < tasks.length - 1) {
            const updatetasks = [...tasks];
            [updatetasks[index + 1], updatetasks[index]] = [updatetasks[index], updatetasks[index + 1]];
            setTasks(updatetasks);
        }
    }

    return (
        <div className="todo-container d-flex flex-column align-items-center">
            <img src={checkicon} alt='check icon' className='check-icon' style={{ display: 'flex' }} />
            <span className="todo-header">To-Do-List</span>

            <div className="input-group">
                <input
                    className="task-input"
                    type="text"
                    placeholder="Enter a task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <button className="btn-add" onClick={handleAdd}>
                    +
                </button>
            </div>

            <div className="todo-list">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`todo-card d-flex align-items-center justify-content-between ${task.completed ? 'completed' : ''
                            }`}
                    >
                        <div className="left-side d-flex align-items-center">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleComplete(task.id)}
                            />
                            <span className="task-text">{task.text}</span>
                        </div>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(task.id)}
                        >
                            Delete
                        </button>
                        <button className='btn' onClick={() => moveup(task.id)} >⬆️</button>
                        <button className='btn' onClick={() => movedown(task.id)} >⬇️</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TodoList;
