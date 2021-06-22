import React, { useState, useEffect } from "react";
import edit from "./edit.svg";
import del from "./trash.svg";
import done from "./check.svg";
import cancel from "./delete.svg";
import axios from "axios";

import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [indexEdit, setIndex] = useState(null);
  const [textNew, setEdit] = useState("");

  useEffect(async () => {
    await axios.get("http://localhost:4000/allTasks").then((res) => {
      setTasks(res.data.data);
    });
  });

  const addNewTask = async () => {
    if (!text.trim()) return alert("Введите текст");
    await axios
      .post("http://localhost:4000/createTask", {
        text,
        isCheck: false,
      })
      .then((res) => {
        setTasks([...tasks, res.data.data]);
        setText("");
      });
  };

  const updateValueInput = (event) => {
    if (event.key === "Enter") {
      addNewTask();
    }
  };

  const onChangeCheckbox = async (index) => {
    const { _id, isCheck } = tasks[index];
    await axios
      .patch("http://localhost:4000/updateTask", {
        _id,
        isCheck: !isCheck,
      })
      .then((res) => {
        setTasks(res.data.data);
      });
  };

  const deleteTask = async (index) => {
    await axios
      .delete(`http://localhost:4000/deleteTask?_id=${tasks[index]._id}`)
      .then((res) => {
        setTasks(res.data.data);
      });
  };

  const editTask = (index) => {
    setIndex(index);
    setEdit(tasks[index].text);
  };

  const doneTask = async (index) => {
    if (!textNew.trim()) return alert("Введите текст");
    const { _id } = tasks[index];
    await axios
      .patch("http://localhost:4000/updateTask", {
        _id,
        text: textNew,
      })
      .then((res) => {
        setTasks(res.data.data);
      });
    setIndex();
  };

  const cancelTask = (index) => {
    setIndex(index);
  };

  tasks.sort((a, b) => a.isCheck - b.isCheck);

  return (
    <div className="container">
      <header className="block">
        <h1>To-Do List</h1>
        <input
          onKeyDown={(event) => updateValueInput(event)}
          className="add-tasks"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn" onClick={() => addNewTask()}>+</button>
      </header>
      <div className="content-page">

        {tasks.map((task, index) => {

          return indexEdit === index ? (
            <div key={`task-${index}`}>
              <input
                className="edit-text"
                type="text"
                onChange={(e) => setEdit(e.target.value)}
                value={textNew}
              />
              <img
                src={done}
                onClick={() => doneTask(index)}
                className="App-img"
                alt="done"
              />
              <img
                src={cancel}
                onClick={() => cancelTask(index)}
                className="App-img"
                alt="cancel"
              />
            </div>
          ) : (
            <div className="task-container" key={`task-${index}`}>
              <input className="taskCheck"
                type="checkbox"
                checked={task.isCheck}
                onChange={() => onChangeCheckbox(index)}
              />
              <span className={task.isCheck ? "text-task done-text" : "text-task"}>{task.text}</span>
              {!task.isCheck && <img src={edit} onClick={() => editTask(index)} className={"App-img"} alt="edit" />}
              <img
                src={del}
                onClick={() => deleteTask(index)}
                className="App-img"
                alt="delete"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
