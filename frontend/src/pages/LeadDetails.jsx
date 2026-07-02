// src/pages/LeadDetails.jsx
import { useLocation } from "react-router-dom";

function LeadDetails() {
  const { state } = useLocation();
  const lead = state?.lead;

  return lead ? (
    <div style={{ padding: "20px" }}>
      <h2>Lead Details</h2>
      <p><strong>Name:</strong> {lead.name}</p>
      <p><strong>Phone:</strong> {lead.phone || lead.phoneNumber}</p>
      <p><strong>Project:</strong> {lead.projectTitle || lead.project || "Not provided"}</p>
      <p><strong>Payment:</strong> ₹{lead.paymentAmount}</p>
      <p><strong>Status:</strong> {lead.status}</p>
      <p><strong>Purpose:</strong> {lead.purpose || lead.purpose|| "Not provided"}</p>
    </div>
  ) : (
    <p>No lead data available</p>
  );
}


export default LeadDetails;
