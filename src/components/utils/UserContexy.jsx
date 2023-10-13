import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedIsUserLoggedIn = localStorage.getItem('isUserLoggedIn');

    if (storedToken && storedUserId && storedIsUserLoggedIn) {
      setToken(storedToken);
      setUserId(storedUserId);
      setIsUserLoggedIn(JSON.parse(storedIsUserLoggedIn));
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('isUserLoggedIn', JSON.stringify(false));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (isUserLoggedIn) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('isUserLoggedIn', JSON.stringify(true));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isUserLoggedIn');
    }
  }, [isUserLoggedIn, token, userId]);

  return (
    <UserContext.Provider
      value={{
        token,
        userId,
        isUserLoggedIn,
        setToken,
        setUserId,
        setIsUserLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

