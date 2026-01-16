import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import Poll from "./components/Poll";
import "./App.css";

function App() {
  const [pollIds, setPollIds] = useState([]);

  useEffect(() => {
    const pollsRef = ref(db, "polls");
    const unsubscribe = onValue(pollsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const keys = Object.keys(data);
        setPollIds(keys);
      } else {
        setPollIds([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">📊 Encuesta en Tiempo Real</h1>
      <div className="polls-wrapper">
        {pollIds.map((id) => (
          <Poll key={id} pollId={id} />
        ))}
      </div>
    </div>
  );
}

export default App;
