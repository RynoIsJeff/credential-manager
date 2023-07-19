import React, { createContext, useEffect, useState } from "react";


const ApplicationContext = createContext();

export function ApplicationProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const login = () => {
        setIsLoggedIn(true);

    };

    const logout = () => {
        setIsLoggedIn(false);
    };
 


    return (
        <ApplicationContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </ApplicationContext.Provider>
    );
}

export default ApplicationContext;