"use client"// Because we're inside a server component

import React, { createContext, useState, useContext } from 'react';



interface IGlobalContextProps {
    user: any;
    loading: boolean;
    setUser: (user: any) => void;
    setLoading: (loading: boolean) => void;
}


export const GlobalContext = React.createContext<IGlobalContextProps>({
    user: {},
    loading: true,
    setUser: () => { },
    setLoading: () => { },
});

//const GlobalContext = createContext();
// Create a provider component
export const GlobalContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    return (
        <GlobalContext.Provider
            value={{
                user: currentUser,
                loading: isLoading,
                setUser: setCurrentUser,
                setLoading: setIsLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )

    /* const [state, setState] = useState(initialState);
     // Define any functions or values you want to provide
     const value = {
         state,
         setState,
     };
     return <GlobalContext.Provider value={ value }> { children } < /GlobalContext.Provider>;*/
};
// Export the context
//export const useGlobalContext = () => useContext(GlobalContext)

