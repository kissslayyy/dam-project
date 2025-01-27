import { useNavigate } from "react-router-dom";
import "./DamDetails.css";
import logo from "../assets/logo.jpeg";
import sumit from "../assets/sumit.jpeg";
import mantesh from "../assets/mantesh.jpeg";
import ompriya from "../assets/ompriya.jpeg";
import vivek from "../assets/vivek.jpeg";
import sumant from "../assets/sumant.jpeg";
import Hod from "../assets/Hod.jpeg";
const DamDetails = () => {
  const navigate = useNavigate();
  const details = [
    {
      name: "Sumit kumar",
      regNo: "22101128907",
      image: sumit,
    },
    {
      name: "Om priya",
      regNo: "21101128039",
      image: ompriya,
    },
    {
      name: "Mamtesh kumar",
      regNo: "21101128002",
      image: mantesh,
    },
    {
      name: "Vivek kumar",
      regNo: "21101128027",
      image: vivek,
    },
    {
      name: "Sumant kumar",
      regNo: "21101128026",
      image: sumant,
    },
  ];

  return (
    <div className="container">
      <button onClick={() => navigate("/")} className="back-button">
        <span className="back-icon">←</span> Go to Home
      </button>
      <img
        src={logo}
        alt="Logo"
        style={{
          display: "block",
          margin: "0 auto",
          width: "150px",
          height: "auto",
        }}
      />
      <h1
        style={{
          textAlign: "center",
          fontSize: "calc(1.2rem + 1vw)",
          marginBottom: "1rem",
          padding: "0 10px",
        }}
      >
        B. P. Mandal College of Engineering Madhepura Project
      </h1>
      <div className="">
        <h1>Under the guidance of</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="card">
            <div className="card-header">
              <img src={Hod} alt="Hod" className="avatar" />
              <h2 className="name">Prof. Kunal kumar</h2>
            </div>

            <div className="card-content">
              <div className="detail-row">
                <span className="label">HOD:</span>
                <span className="value"> Civil engineering</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="title">Team member Details</h1>

      <div className="grid-container">
        {details.map((detail, index) => (
          <div key={index} className="card">
            <div className="card-header">
              <img src={detail.image} alt={detail.name} className="avatar" />
              <h2 className="name">{detail.name}</h2>
            </div>

            <div className="card-content">
              <div className="detail-row">
                <span className="label">Registration No:</span>
                <span className="value">{detail.regNo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DamDetails;
