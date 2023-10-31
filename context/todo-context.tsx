"use client"

import React, { Dispatch, createContext, useReducer } from "react";

const initialState: ITodo = {
    todos: [],
};

interface IAction {
    type: string
    payload: any
}

interface ITodo {
    todos: string[]
}

const reducer = (state: ITodo, action: IAction) => {
    console.log(action.type)
    switch (action.type) {
        case "ADD_TODO":
            return { ...state, todos: [...state.todos, action.payload] };
        case "DELETE_TODO":
            return { ...state, todos: state.todos.filter((todo, index) => index !== action.payload) };
        case "EDIT_TODO":
            const updatedTodos = state.todos.map((todo, index) => index === action.payload.index ? action.payload.newTodo : todo);
            return { ...state, todos: updatedTodos };
        default:
            return state;
    }
};


export const TodoContext = createContext<{
    state: ITodo;
    dispatch: Dispatch<IAction>;
}>({ state: initialState, dispatch: () => null });

export const TodoContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <TodoContext.Provider value={{ state, dispatch }}>
            {children}
        </TodoContext.Provider>
    );
};