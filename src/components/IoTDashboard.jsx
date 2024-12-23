import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import ReactSpeedometer from "react-d3-speedometer";
import "../styles/skeleton.css";

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

const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const IoTDashboard = () => {
  const [waterLevel, setWaterLevel] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [gateStatus, setGateStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    // References to database nodes
    const waterLevelRef = ref(database, "/dam/water_level");
    const pressureRef = ref(database, "/dam/pressure");
    const gateStatusRef = ref(database, "/dam/gate_status");
    const alertRef = ref(database, "/dam/alert");

    // Set initial loading state
    setLoading(true);

    // Counter for loaded data
    let loadedCount = 0;
    const totalDataPoints = 4;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalDataPoints) {
        setLoading(false);
      }
    };

    // Attach listeners to database nodes
    const unsubscribeWaterLevel = onValue(waterLevelRef, (snapshot) => {
      setWaterLevel(snapshot.val());
      checkAllLoaded();
    });

    const unsubscribePressure = onValue(pressureRef, (snapshot) => {
      setPressure(snapshot.val());
      checkAllLoaded();
    });

    const unsubscribeGateStatus = onValue(gateStatusRef, (snapshot) => {
      setGateStatus(snapshot.val());
      checkAllLoaded();
    });

    const unsubscribeAlert = onValue(alertRef, (snapshot) => {
      setAlert(snapshot.val());
      checkAllLoaded();
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <h1 style={{ 
        textAlign: "center",
        fontSize: "calc(1.5rem + 1vw)",
        marginBottom: "2rem"
      }}>IoT Dam Monitoring Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ 
          display: "flex", 
          flexDirection: window.innerWidth <= 768 ? "column" : "row",
          justifyContent: "center", 
          gap: "20px",
          alignItems: "center"
        }}>
          <div style={{ 
            width: "100%",
            maxWidth: "500px",
            padding: "20px",
            boxSizing: "border-box"
          }}>
            <h2 style={{ textAlign: "center" }}>Water Level</h2>
            <ReactSpeedometer
              maxValue={100}
              value={waterLevel}
              valueFormat=".0f"
              currentValueText="${value} cm"
              needleColor="steelblue"
              startColor="#2ecc71"
              endColor="#FF5F6D"
              segments={10}
              height={window.innerWidth <= 768 ? 150 : 200}
              width={window.innerWidth <= 768 ? 300 : 400}
            />
          </div>
          <div style={{ 
            width: "100%",
            maxWidth: "500px",
            padding: "20px",
            boxSizing: "border-box"
          }}>
            <h2 style={{ textAlign: "center" }}>Water Pressure</h2>
            <ReactSpeedometer
              maxValue={5}
              value={pressure}
              valueFormat=".1f"
              currentValueText="${value} N"
              needleColor="steelblue"
              startColor="#2ecc71"
              endColor="#FF5F6D"
              segments={10}
              height={window.innerWidth <= 768 ? 150 : 200}
              width={window.innerWidth <= 768 ? 300 : 400}
            />
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2 style={{ 
          marginBottom: "1rem",
          fontSize: "calc(1.2rem + 0.5vw)"
        }}>Gate Status: {gateStatus ? "Open" : "Closed"}</h2>
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => toggleGate(true)}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Open Gate
          </button>
          <button
            onClick={() => toggleGate(false)}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Close Gate
          </button>
        </div>
      </div>

      <div style={{ 
        textAlign: "center", 
        marginTop: "2rem",
        padding: "20px"
      }}>
        <h3 style={{ 
          marginBottom: "0.5rem",
          fontSize: "calc(1rem + 0.3vw)"
        }}>Real-time Monitoring</h3>
        <p style={{ 
          color: "#666",
          fontSize: "calc(0.8rem + 0.2vw)"
        }}>Data updates in real-time from Firebase.</p>
      </div>
    </div>
  );
};

export default IoTDashboard;
