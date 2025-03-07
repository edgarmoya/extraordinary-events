import React from "react";

function AdminPage() {
  return (
    <div>
      <iframe
        src="http://localhost:8000/admin/"
        title="Admin Panel"
        style={{ width: "100%", height: "100vh", border: "none" }}
      ></iframe>
    </div>
  );
}

export default AdminPage;
