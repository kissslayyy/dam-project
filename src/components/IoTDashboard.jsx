import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlhOeHflNK-xjvldMMY3s89qiii-TVJKM",
  authDomain: "dam-project-b33d3.firebaseapp.com",
  databaseURL: "https://dam-project-b33d3-default-rtdb.firebaseio.com/",
  projectId: "dam-project-b33d3",
  storageBucket: "dam-project-b33d3.appspot.com",
  messagingSenderId: "995086536333",
  appId: "1:995086536333:web:55becdb795f607dfd95cc4",
  measurementId: "G-91RVZQ38EF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const IoTDashboard = () => {
  const [waterLevel, setWaterLevel] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [gateStatus, setGateStatus] = useState(false);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    // References to database nodes
    const waterLevelRef = ref(database, "/dam/water_level");
    const pressureRef = ref(database, "/dam/pressure");
    const gateStatusRef = ref(database, "/dam/gate_status");
    const alertRef = ref(database, "/dam/alert");

    // Attach listeners to database nodes
    const unsubscribeWaterLevel = onValue(waterLevelRef, (snapshot) => {
      setWaterLevel(snapshot.val());
    });

    const unsubscribePressure = onValue(pressureRef, (snapshot) => {
      setPressure(snapshot.val());
    });

    const unsubscribeGateStatus = onValue(gateStatusRef, (snapshot) => {
      setGateStatus(snapshot.val());
    });

    const unsubscribeAlert = onValue(alertRef, (snapshot) => {
      setAlert(snapshot.val());
    });

    // Cleanup listeners on component unmount
    return () => {
      unsubscribeWaterLevel();
      unsubscribePressure();
      unsubscribeGateStatus();
      unsubscribeAlert();
    };
  }, []);

  const toggleGate = (open) => {
    const gateStatusRef = ref(database, "/dam/gate_status");
    set(gateStatusRef, open);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>IoT Dam Monitoring Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Water Level: {waterLevel} cm</h2>
        <h2>Water Pressure: {pressure}</h2>
        <h2>Gate Status: {gateStatus ? "Open" : "Closed"}</h2>
        {alert && <h2 style={{ color: "red" }}>Alert: {alert}</h2>}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => toggleGate(true)}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            background: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Open Gate
        </button>
        <button
          onClick={() => toggleGate(false)}
          style={{
            padding: "10px 20px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Close Gate
        </button>
      </div>

      <div>
        <h3>Real-time Monitoring</h3>
        <p>Data updates in real-time from Firebase.</p>
      </div>
    </div>
  );
};

export default IoTDashboard;
