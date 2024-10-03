import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import Register from "./components/Register";
import Container from "./components/container/Container.jsx";
import Login from "./components/Login.js";
const servers = "http://localhost:5000";

function App() {
  const socket = useMemo(() => io(servers), []);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState("");
  const [roomId, setRoomId] = useState(null);

  return (
  //   <div className="App">
  //   {/* <Register /> */}
  //   <Container/>
    
  // </div>
    <div>
      <Routes>
        <Route
          path="/home"
          element={
            <Container
            />
          }
        />
        <Route
          path="/"
          element={
            <Register /> 
          }
        />
        <Route
          path="/login"
          element={
            <Login /> 
          }
        />
      </Routes>
    </div>
  );
}

export default App;
