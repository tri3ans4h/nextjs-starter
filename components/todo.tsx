"use client"

import { TodoContext } from "@/context/todo-context";
import React, { useContext, useState } from "react";

export default function Todo() {
  const { state, dispatch } = useContext(TodoContext);
  const [todoText, setTodoText] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedTodo, setEditedTodo] = useState("");

  const handleAddTodo = () => {
    if (todoText.trim() !== "") {
      dispatch({ type: "ADD_TODO", payload: todoText });
      setTodoText("");
    }
  };

  const handleDeleteTodo = (index:any) => {
    dispatch({ type: "DELETE_TODO", payload: index });
  };

  const handleEditTodo = (index:any, newTodo:any) => {
    dispatch({ type: "EDIT_TODO", payload: { index, newTodo } });
    setEditingIndex(-1);
    setEditedTodo("");
  };

  return (
    <div style={{ marginBottom: "4rem", textAlign: "center" }}>
      <h2>Todos</h2>

      <input
        type="text"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        style={{ marginBottom: 16}}
        placeholder="Enter a todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>

      <ul>
        {state.todos.map((todo, index) => (
          <li key={index}>
            {index === editingIndex ? (
              <>
                <input
                  type="text"
                  value={editedTodo}
                  onChange={(e) => setEditedTodo(e.target.value)}
                />
                <button style={{ marginRight: 16}} onClick={() => handleEditTodo(index, editedTodo)}>
                  Save
                </button>
              </>
            ) : (
              <>
                {todo}
                <button style={{ marginRight: 16}} onClick={() => setEditingIndex(index)}>Edit</button>
                <button onClick={() => handleDeleteTodo(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}