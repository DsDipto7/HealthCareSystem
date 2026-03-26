import React, { useEffect, useState } from "react";
import "./ContactTable.css";

export default function ContactTable() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/contact-list/");
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  function getBadgeStyle(type) {
    if (type === "good") {
      return {
        background: "#d4edda",
        color: "#155724",
        border: "1px solid #c3e6cb",
        padding: "4px 12px",
        borderRadius: "20px",
        fontWeight: "600",
        fontSize: "13px",
        textTransform: "capitalize",
        display: "inline-block",
        minWidth: "60px",
        textAlign: "center",
      };
    }
    if (type === "bad") {
      return {
        background: "#f8d7da",
        color: "#721c24",
        border: "1px solid #f5c6cb",
        padding: "4px 12px",
        borderRadius: "20px",
        fontWeight: "600",
        fontSize: "13px",
        textTransform: "capitalize",
        display: "inline-block",
        minWidth: "60px",
        textAlign: "center",
      };
    }
    return {
      background: "#fff3cd",
      color: "#856404",
      border: "1px solid #ffeeba",
      padding: "4px 12px",
      borderRadius: "20px",
      fontWeight: "600",
      fontSize: "13px",
      textTransform: "capitalize",
      display: "inline-block",
      minWidth: "60px",
      textAlign: "center",
    };
  }

  if (loading) {
    return (
      <div className="contact-table-container">
        <h2 className="contact-table-title">Contact Messages</h2>
        <div className="contact-table-loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contact-table-container">
        <h2 className="contact-table-title">Contact Messages</h2>
        <div className="contact-table-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="contact-table-container">
      <h2 className="contact-table-title">Contact Messages</h2>
      <div className="contact-table-wrapper">
        <table className="contact-table">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map(function (contact, index) {
                var type = contact.message_type || "other";
                return (
                  <tr key={contact.id || index}>
                    <td>{index + 1}</td>
                    <td>{contact.first_name}</td>
                    <td>{contact.last_name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.message}</td>
                    <td>
                      <span style={getBadgeStyle(type)}>{type}</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="contact-table-no-data">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}