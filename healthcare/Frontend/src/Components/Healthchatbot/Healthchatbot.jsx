// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Healthchatbot.css";

// export default function HealthChatbot() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const navigate = useNavigate();



// const sendMessage = async (event) => {
//   event.preventDefault();
//   if (!input.trim()) return;

//   const date = new Date();
//   const hour = date.getHours();
//   const minute = date.getMinutes();
//   const strTime = `${hour}:${minute}`;

//   const userText = input;

//   const newMessage = { text: userText, time: strTime, sender: "user" };
//   setMessages((prevMessages) => [...prevMessages, newMessage]);
//   setInput("");

//   try {
//     const response = await fetch("http://127.0.0.1:8080/get", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ user_query: userText }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.response || "Network response was not ok");
//     }

//     const botMessage = {
//       text: data.response,
//       time: strTime,
//       sender: "bot",
//     };

//     setMessages((prevMessages) => [...prevMessages, botMessage]);
//   } catch (error) {
//     console.error("Error fetching response:", error);

//     const errorMessage = {
//       text: error.message || "Something went wrong.",
//       time: strTime,
//       sender: "bot",
//     };

//     setMessages((prevMessages) => [...prevMessages, errorMessage]);
//   }
// };
//   return (
//     <div className="health-chatbot container-fluid h-100">
//       <div className="row justify-content-center h-100">
//         <div className="col-md-8 col-xl-6 chat">
//           <div className="card">
//             <div className="card-header msg_head d-flex align-items-center">
//               <button className="back_btn btn btn-light me-2" onClick={() => navigate("/")}>
//                 ⬅ Back
//               </button>
//               <div className="img_cont">
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/512/387/387569.png"
//                   className="rounded-circle user_img"
//                   alt="Bot Avatar"
//                 />
//               </div>
//               <div className="user_info ms-3">
//                 <h5 className="mb-0">Medical Chatbot</h5>
//                 <p className="text-muted">Ask me anything!</p>
//               </div>
//             </div>

//             <div className="card-body msg_card_body">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
//                 >
//                   {msg.sender === "bot" && (
//                     <div className="img_cont_msg me-2">
//                       <img
//                         src="https://cdn-icons-png.flaticon.com/512/387/387569.png"
//                         className="rounded-circle user_img_msg"
//                         alt="Bot"
//                       />
//                     </div>
//                   )}
//                   <div className={`msg_cotainer${msg.sender === "user" ? "_send" : ""}`}>
//                     {msg.text}
//                     <span className={`msg_time${msg.sender === "user" ? "_send" : ""}`}>{msg.time}</span>
//                   </div>
//                   {msg.sender === "user" && (
//                     <div className="img_cont_msg ms-2">
//                       <img
//                         src="https://i.ibb.co/d5b84Xw/Untitled-design.png"
//                         className="rounded-circle user_img_msg"
//                         alt="User"
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className="card-footer">
//               <form onSubmit={sendMessage} className="input-group">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="Type your message..."
//                   autoComplete="off"
//                   className="form-control type_msg"
//                   required
//                 />
//                 <button type="submit" className="btn btn-primary ms-2">Send</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Healthchatbot.css";

export default function HealthChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const strTime = `${hour}:${minute.toString().padStart(2, "0")}`;

    const userText = input;

    const newMessage = { text: userText, time: strTime, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:5001/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_query: userText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.response || "Network response was not ok");
      }

      const botMessage = {
        text: data.response,
        time: strTime,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);

      const errorMessage = {
        text: error.message || "Something went wrong.",
        time: strTime,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="hc-root">
      {/* Ambient background blobs */}
      <div className="hc-blob hc-blob--1" />
      <div className="hc-blob hc-blob--2" />

      <div className="hc-wrapper">
        <div className="hc-card">

          {/* Header */}
          <div className="hc-header">
            <button className="hc-back-btn" onClick={() => navigate("/")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back
            </button>

            <div className="hc-header-center">
              <div className="hc-avatar-wrap">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/387/387569.png"
                  className="hc-avatar"
                  alt="Bot Avatar"
                />
                <span className="hc-online-dot" />
              </div>
              <div className="hc-header-info">
                <h5 className="hc-title">Medical Assistant</h5>
                <p className="hc-subtitle">
                  <span className="hc-pulse-dot" />
                  AI-powered · Always available
                </p>
              </div>
            </div>

            <div className="hc-header-ecg">
              <svg viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline
                  points="0,15 20,15 25,5 30,25 35,2 40,28 45,15 65,15 70,10 75,20 80,15 120,15"
                  stroke="#00e5ff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>

          {/* Messages */}
          <div className="hc-messages">
            {messages.length === 0 && (
              <div className="hc-empty-state">
                <div className="hc-empty-icon">
                  <img src="https://cdn-icons-png.flaticon.com/512/387/387569.png" alt="bot" />
                </div>
                <p className="hc-empty-title">How can I help you today?</p>
                <p className="hc-empty-sub">Ask me anything about your health or medical documents.</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`hc-msg-row hc-msg-row--${msg.sender}`}
              >
                {msg.sender === "bot" && (
                  <div className="hc-msg-avatar">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/387/387569.png"
                      alt="Bot"
                    />
                  </div>
                )}
                <div className={`hc-bubble hc-bubble--${msg.sender}`}>
                  <span className="hc-bubble-text">{msg.text}</span>
                  <span className="hc-bubble-time">{msg.time}</span>
                </div>
                {msg.sender === "user" && (
                  <div className="hc-msg-avatar">
                    <img
                      src="https://i.ibb.co/d5b84Xw/Untitled-design.png"
                      alt="User"
                    />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="hc-footer">
            <form onSubmit={sendMessage} className="hc-input-row">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                autoComplete="off"
                className="hc-input"
                required
              />
              <button type="submit" className="hc-send-btn" aria-label="Send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
            <p className="hc-footer-note">Responses are AI-generated. Consult a professional for medical advice.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
