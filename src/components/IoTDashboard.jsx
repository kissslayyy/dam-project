import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
      const level = snapshot.val();
      setWaterLevel(level);
      
      // Calculate water level percentage (assuming MAX_WATER_LEVEL is 300)
      const waterLevelPercentage = ((300 - level) / 300) * 100;
      
      // Update gate status and alert based on water level
      if (waterLevelPercentage > 70) {
        set(gateStatusRef, true); // Open the gate
        set(alertRef, "High water level detected! Gate opened automatically.");
      } else {
        set(gateStatusRef, false); // Close the gate when water level is under 70%
        set(alertRef, ""); // Clear alert
      }
      
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
      padding: "10px", 
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      boxSizing: "border-box",
      width: "100%",
      overflowX: "hidden"
    }}>
     

      <h1 style={{ 
        textAlign: "center",
        fontSize: "calc(1.2rem + 1vw)",
        marginBottom: "1rem",
        padding: "0 10px"
      }}>IoT Dam Monitoring Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ 
          display: "flex", 
          flexDirection: window.innerWidth <= 768 ? "column" : "row",
          justifyContent: "center", 
          gap: "10px",
          alignItems: "center",
          width: "100%"
        }}>
          <div style={{ 
            width: "100%",
            maxWidth: window.innerWidth <= 768 ? "100%" : "500px",
            padding: "10px",
            boxSizing: "border-box"
          }}>
            <h2 style={{ 
              textAlign: "center", 
              fontSize: window.innerWidth <= 768 ? "1.2rem" : "1.5rem",
              marginBottom: "10px"
            }}>Water Level</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ReactSpeedometer
                maxValue={100}
                value={waterLevel}
                valueFormat=".0f"
                currentValueText="${value} %"
                needleColor="steelblue"
                startColor="#2ecc71"
                endColor="#FF5F6D"
                segments={10}
                height={window.innerWidth <= 768 ? 140 : 200}
                width={window.innerWidth <= 768 ? 220 : 400}
                paddingHorizontal={15}
                paddingVertical={15}
                labelFontSize={window.innerWidth <= 768 ? "8px" : "12px"}
                valueTextFontSize={window.innerWidth <= 768 ? "10px" : "12px"}
                maxSegmentLabels={5}
              />
            </div>
          </div>
          <div style={{ 
            width: "100%",
            maxWidth: window.innerWidth <= 768 ? "100%" : "500px",
            padding: "10px",
            boxSizing: "border-box"
          }}>
            <h2 style={{ 
              textAlign: "center", 
              fontSize: window.innerWidth <= 768 ? "1.2rem" : "1.5rem",
              marginBottom: "10px"
            }}>Water Pressure</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ReactSpeedometer
                maxValue={5}
                value={pressure}
                valueFormat=".1f"
                currentValueText="${value} N"
                needleColor="steelblue"
                startColor="#2ecc71"
                endColor="#FF5F6D"
                segments={10}
                height={window.innerWidth <= 768 ? 140 : 200}
                width={window.innerWidth <= 768 ? 220 : 400}
                paddingHorizontal={15}
                paddingVertical={15}
                labelFontSize={window.innerWidth <= 768 ? "8px" : "12px"}
                valueTextFontSize={window.innerWidth <= 768 ? "10px" : "12px"}
                maxSegmentLabels={5}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        textAlign: "center", 
        marginTop: "1rem",
        padding: "0 10px"
      }}>
        <h2 style={{ 
          marginBottom: "1rem",
          fontSize: window.innerWidth <= 768 ? "1.2rem" : "1.5rem"
        }}>Gate Status: {gateStatus ? "Open" : "Closed"}</h2>
         
        {alert && waterLevel >= 70 && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "1rem",
            fontSize: window.innerWidth <= 768 ? "0.9rem" : "1rem"
          }}>
            {alert}
          </div>
        )}
        <div style={{ 
          display: "flex", 
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px"
        }}>
          {}
          <p style={{
            fontSize: window.innerWidth <= 768 ? "0.9rem" : "1rem",
            color: "#666"
          }}>
            Automatic Control: Gate opens at 70% water level
          </p>
          <button
            onClick={() => toggleGate(!gateStatus)}
            style={{
              padding: "10px 24px",
              fontSize: window.innerWidth <= 768 ? "0.9rem" : "1rem",
              backgroundColor: gateStatus ? "#e74c3c" : "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              minWidth: "120px"
            }}
          >
            {gateStatus ? "Close Gate" : "Open Gate"}
          </button>
        </div>
      </div>

      <div style={{ 
        textAlign: "center", 
        marginTop: "1rem",
        padding: "10px"
      }}>
        <h3 style={{ 
          marginBottom: "0.5rem",
          fontSize: window.innerWidth <= 768 ? "1rem" : "1.2rem"
        }}>Real-time Monitoring</h3>
        <p style={{ 
          color: "#666",
          fontSize: window.innerWidth <= 768 ? "0.8rem" : "1rem",
          marginBottom: "1rem"
        }}>Data updates in real-time from Firebase.</p>
        <button
          onClick={() => navigate('/details')}
          style={{
            padding: "8px 20px",
            fontSize: window.innerWidth <= 768 ? "0.9rem" : "1rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease"
          }}
        >
          Team Members
        </button>
      </div>
    </div>
  );
};

export default IoTDashboard;
