"use client";

import React, { Dispatch, createContext, useReducer } from "react";
import { object } from "zod";

type User = {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    photo?: string
    phone: string;
    address: string;
    birth_date: string;
    email: string;
}

type StateType = {
    user: User;
    isLogin: boolean;
    isLoading: boolean;
    isMenuDropDown: boolean;
    profile: Profile;
    userActivity?: UserActivity[];
    securityUserActivity?: SecurityUserActivity;
};

type ActionType = {
    type: string;
    payload: any
};

type Profile = {
    id?: number;
    user_id: number;
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
    birthDate: Date;
    address: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
}


type UserActivity = {
    id?: number;
    user_id: number;
    userAgent: string;
    activity: string;
    created_at: Date;
    updated_at: Date;
}

type SecurityUserActivity = {
    lastLogin?: Date; //last login at, identify last login at device
    lastChangePassword?: Date //last change password, identify last password has changed
}
const initialState: StateType = {
    user: {
        id: 0,
        name: "",
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        birth_date: "",
        email: ""
    },
    isLogin: false,
    isLoading: true,
    isMenuDropDown: false,
    profile: {
        user_id: 0,
        email: "",
        firstName: "",
        lastName: "",
        photo: "",
        birthDate: new Date(),
        address: "",
        phone: "",
        created_at: new Date(),
        updated_at: new Date()
    },
    userActivity: [],
    securityUserActivity: {
    }
};

const reducer = (state: StateType, action: ActionType) => {
    switch (action.type) {
        case "set-user":
            return { ...state, user: action.payload };
        case "setProfile":
            return { ...state, profile: action.payload };
        case "setUserActivity":
            return { ...state, userActivity: action.payload };
        case "setSecurityUserActivity":
            return { ...state, securityUserActivity: action.payload };
        case "del-user":
            return {
                ...state, user: { id: 0, name: "" }
            };
        case "setLogin":
            return { ...state, isLogin: action.payload };

        case "setLoading":
            return { ...state, isLoading: action.payload };
        case "setStateMenuDropDown":

            return { ...state, isMenuDropDown: action.payload };
        default:
            return state;
    }
};

export const SecretContext = createContext<{
    state: StateType;
    dispatch: Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => null });

export const SecretContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <SecretContext.Provider value={{ state, dispatch }}>
            {children}
        </SecretContext.Provider>
    );
};
