import { FileUploader } from './components/FileUploader';
import './App.css';
import { createContext, useState } from "react";
import React from 'react';
import ReactSwitch from 'react-switch';

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div className="App" id={ theme }>
      <FileUploader />
      <div className="switch"><ReactSwitch onChange={toggleTheme} checked={theme === "dark"}/>
        <br></br><label>{ theme === "light" ? "go dark":"go light" }</label>
       </div>
    </div>
    </ThemeContext.Provider>
  );
}

export default App;
