"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { jwtDecode } from "jwt-decode";

export default function AddUser() {
  const router = useRouter();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectorPosition, setSelectorPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selectTypeRef = useRef<HTMLDivElement>(null);

  // Open selector and calculate position
  const handleSelectTypeClick = () => {
    if (selectTypeRef.current) {
      const rect = selectTypeRef.current.getBoundingClientRect();
      setSelectorPosition({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
      setSelectorOpen((open) => !open);
    }
  };

  // Close selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectTypeRef.current &&
        !selectTypeRef.current.contains(event.target as Node) &&
        document.getElementById('selector-dropdown') &&
        !(document.getElementById('selector-dropdown') as HTMLElement).contains(event.target as Node)
      ) {
        setSelectorOpen(false);
      }
    }
    if (selectorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectorOpen]);

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    // Validate required fields
    if (!selectedType || !email || !password || !fullName) {
      setError("Please fill in all required fields");
      return;
    }

    // Get institutionID from JWT in localStorage
    const token = localStorage.getItem("authToken");
    let institutionID = "";
    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(token);
        institutionID = decoded.institutionID;
      } catch {
        setError("Invalid token");
        return;
      }
    } else {
      setError("No auth token found");
      return;
    }

    try {
      const res = await fetch("/api/userManagement/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentID: selectedType === "Student" ? studentId : null,
          FullName: fullName,
          email: email,
          password: password,
          role: selectedType === "Institution Manager" ? "INSTITUTION_REPRESENTATIVE" : selectedType?.toUpperCase(),
          institutionID: Number(institutionID),
        }),
      });
      if (res.ok) {
        setError(null);
        // Clear form fields
        setEmail("");
        setPassword("");
        setFullName("");
        setStudentId("");
        setSelectedType(null);
        // Redirect to user management with success flag
        router.push("/user_management?created=1");
        return;
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create user");
      }
    } catch {
      setError("Failed to create user");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ minHeight: "100vh", width: "100vw" }}>
      {/* Background image */}
      <Image
        src="/background_home.png"
        alt="Home background"
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        priority
      />
      {/* Centered, fixed-size canvas for all UI */}
      <div
        style={{
          width: "1440px",
          height: "900px",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          transformOrigin: "center",
          zIndex: 10,
        }}
      >
        {/* Top Navigation Bar */}
        <div
          style={{
            position: "absolute",
            top: 70, // 30 + 40
            left: 50,
            width: 1340,
            height: 60,
            borderRadius: 100,
            background: "rgba(128,128,128,0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
          }}
        >
          {/* Home and My Courses (left) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={() => router.push("/HomeScreen?role=Institution Manager")}
              style={{
                fontSize: 23,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                cursor: "pointer",
              }}
              className="text-white transition-colors duration-200 hover:text-gray-300"
            >
              Home
            </div>
            <div
              onClick={() => router.push("/institutions")}
              style={{
                marginLeft: 18,
                fontSize: 23,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                cursor: "pointer",
              }}
              className="text-white transition-colors duration-200 hover:text-gray-300"
            >
              Institutions
            </div>
            <div
              style={{
                marginLeft: 18,
                color: "#0092FA",
                opacity: 0.7,
                fontSize: 23,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
              }}
            >
              User Management
            </div>
          </div>
          {/* Sign Out button (rightmost) */}
          <div
            onClick={() => { localStorage.removeItem("authToken"); router.push("/"); }}
            style={{
              fontSize: 23,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              cursor: "pointer",
            }}
            className="text-white transition-colors duration-200 hover:text-gray-300"
          >
            Sign Out
          </div>
        </div>
        {/* Clearsky logo centered below header */}
        <div
          style={{
            position: "absolute",
            top: 70 + 60 + 20, // (30+40)+60+20 = 150
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <Image
            src="/clearsky.svg"
            alt="Clearsky"
            width={300}
            height={98}
            priority
          />
        </div>
        {/* Large blurred rectangle 50px below clearsky.svg */}
        <div
          style={{
            position: "absolute",
            top: 150 + 98 + 10, // 150+98+10 = 258
            left: "50%",
            transform: "translateX(-50%)",
            width: 1340,
            height: 550,
            borderRadius: 46,
            background: "rgba(149,149,149,0.25)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 1,
          }}
        >
          {/* Inner white rectangle with back button */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 25,
              width: 1290,
              height: 49,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
            }}
          >
            <img
              src="/back.svg"
              alt="Back"
              width={26}
              height={25}
              style={{ position: "absolute", marginTop:-1, left: 20, top: 14, width: 26, height: 25, display: "block", cursor: "pointer" }}
              onClick={() => router.push("/user_management")}
            />
            {/* Add User text */}
            <div
              style={{
                position: "absolute",
                left: 20 + 26 + 14, // 20px from left, 26px icon, 20px gap
                top: "55%",
                transform: "translateY(-50%)",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 23,
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              Add User
            </div>
          </div>
          {/* Type: text */}
          <div
            style={{
              position: "absolute",
              top: 24 + 53 + 15, // top of inner rectangle + height + 25px
              left: 25,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            Type:
          </div>
          {/* User Name: text */}
          <div
            style={{
              position: "absolute",
              top: 24 + 49 + 20 + 39 + 10, // previous position + text height + 10px
              left: 25,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            Email:
          </div>
          {/* User Name input rectangle */}
          <div
            style={{
              position: "absolute",
              top: 24 + 49 + 20 + 39 + 10 + 25 + 10, // previous position + text height + 10px
              left: 25,
              width: 1290,
              height: 39,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                paddingLeft: 20,
                paddingRight: 20,
                textAlign: "left",
                borderRadius: 100,
                boxSizing: "border-box",
              }}
              autoComplete="off"
            />
          </div>
          {/* Password: text */}
          <div
            style={{
              position: "absolute",
              top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10, // previous position + input height + 10px
              left: 25,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            Password:
          </div>
          {/* Password input rectangle */}
          <div
            style={{
              position: "absolute",
              top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10, // previous position + text height + 10px
              left: 25,
              width: 1290,
              height: 39,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                paddingLeft: 20,
                paddingRight: 20,
                textAlign: "left",
                borderRadius: 100,
                boxSizing: "border-box",
              }}
              autoComplete="new-password"
            />
          </div>
          {/* Second User Name: text */}
          <div
            style={{
              position: "absolute",
              top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10, // previous position + input height + 10px
              left: 25,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            Full Name:
          </div>
          {/* Second User Name input rectangle */}
          <div
            style={{
              position: "absolute",
              top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10, // previous position + text height + 10px
              left: 25,
              width: 1290,
              height: 39,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Enter Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                paddingLeft: 20,
                paddingRight: 20,
                textAlign: "left",
                borderRadius: 100,
                boxSizing: "border-box",
              }}
              autoComplete="off"
            />
          </div>
          {/* Third User Name: text */}
          <div
            style={{
              position: "absolute",
              top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10, // previous position + input height + 10px
              left: 25,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            Student ID:
          </div>
          {/* Third User Name input rectangle */}
          <div
            style={{
              position: "absolute",
              top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10, // previous position + text height + 10px
              left: 25,
              width: 1290,
              height: 39,
              borderRadius: 100,
              background: selectedType !== "Student" ? "rgba(128,128,128,0.3)" : "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => {
                if (selectedType === "Student") {
                  // Only allow numbers
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setStudentId(val);
                }
              }}
              disabled={selectedType !== "Student"}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: selectedType !== "Student" ? "rgba(255,255,255,0.5)" : "#fff",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                paddingLeft: 20,
                paddingRight: 20,
                textAlign: "left",
                borderRadius: 100,
                boxSizing: "border-box",
                cursor: selectedType !== "Student" ? "not-allowed" : "text",
              }}
              autoComplete="off"
              maxLength={10}
            />
          </div>
          {/* Add User button rectangle */}
          <div
            onClick={handleSubmit}
            style={{
              position: "absolute",
              top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 20, // previous position + input height + 20px (increased from 10px)
              left: 25 + 50 + 30 + 1010 , // left of Type text + width of "Type:" + 30px + Type rectangle width - Add User rectangle width
              width: 200,
              height: 39,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              Add User
            </div>
          </div>
          {/* Type selection rectangle */}
          <div
            ref={selectTypeRef}
            onClick={handleSelectTypeClick}
            style={{
              position: "absolute",
              top: 24 + 49 + 22, // top of inner rectangle + height + 15px
              left: 25 + 50 + 30, // left of Type text + approximate width of "Type:" + 30px
              width: 230,
              height: 35,
              borderRadius: 42,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              {selectedType || "Select Type"}
              {!selectedType && (
                <span style={{ marginLeft: -1, marginTop:2, display: "flex", alignItems: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 5L11 9L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Success and error overlays, canvas-centered */}
        {message && (
          <></>
        )}
        {error && (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.32)",
                zIndex: 10001,
              }}
            />
            <div style={{ 
              position: "absolute", 
              top: "50%", 
              left: "50%", 
              transform: "translate(-50%, -50%)", 
              zIndex: 10002,
              color: '#f44', 
              fontWeight: 600, 
              fontSize: 18, 
              textAlign: 'center',
              background: "rgba(149,149,149,0.95)",
              padding: "32px 48px 32px 48px",
              borderRadius: "20px",
              boxShadow: '0 2px 24px rgba(0,0,0,0.22)',
              border: '0.3px solid rgba(255, 255, 255, 0.77)',
            }}>
              {error}
            </div>
          </>
        )}
      </div>
      {/* Render selector dropdown */}
      {selectorOpen && selectorPosition && createPortal(
        <div
          id="selector-dropdown"
          style={{
            position: "absolute",
            top: selectorPosition.top,
            left: selectorPosition.left,
            width: selectorPosition.width,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {["Student", "Institution Manager", "Instructor"].map((option, index) => (
            <div
              key={option}
              onClick={() => {
                setSelectedType(option);
                setSelectorOpen(false);
              }}
              style={{
                padding: "12px 20px",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                color: "#fff",
                cursor: "pointer",
                borderBottom: index < 2 ? "0.3px solid rgba(255, 255, 255, 0.3)" : "none",
                transition: "background-color 0.2s",
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
            >
              {option}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
} 