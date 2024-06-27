import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

interface PresenceUpdate {
  username: string;
  status: string;
}

const socket = io("http://localhost:3000");

function App() {
  const [username, setUsername] = useState<string>("");
  const [status, setStatus] = useState<string>("online");
  const [presenceUpdates, setPresenceUpdates] = useState<string[]>([]);

  useEffect(() => {
    socket.on("presenceUpdate", (data: PresenceUpdate) => {
      setPresenceUpdates((prevUpdates) => [
        ...prevUpdates,
        `${data.username} is ${data.status}`,
      ]);
    });

    return () => {
      socket.off("presenceUpdate");
    };
  }, []);

  const handleSetPresence = () => {
    if (username) {
      socket.emit("setPresence", { username, status });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Presence App</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="online">Online</option>
          <option value="away">Away</option>
          <option value="offline">Offline</option>
        </select>
        <button onClick={handleSetPresence}>Set Presence</button>

        <ul>
          {presenceUpdates.map((update, index) => (
            <li key={index}>{update}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
