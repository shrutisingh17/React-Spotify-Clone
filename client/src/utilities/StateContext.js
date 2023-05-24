import React, { createContext, useContext, useState} from "react";

export const MessageContext = createContext(() => {})
export const PlayContext = createContext(() => {})

const Context = createContext();
export const StateContext = ({ children }) => {
 
    const [loggedIn, setloggedIn] = useState(false)
    const [token, setToken] = useState(null)
    const [userInfo, setuserInfo] = useState({})

  return (
    <Context.Provider
      value={{loggedIn, setloggedIn,token, setToken, userInfo, setuserInfo}}
    >
      {children}
    </Context.Provider>
  );
};
export const useStateContext = () => useContext(Context);
