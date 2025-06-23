"use client";
import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

function ChangePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const studentID = searchParams.get("studentID") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
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
      const res = await fetch("/api/userManagement/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password: newPassword,
          studentID,
          institutionID: Number(institutionID),
        }),
      });
      if (res.ok) {
        setMessage("Password changed successfully");
        setError(null);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to change password");
      }
    } catch {
      setError("Failed to change password");
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
            top: 70 + 60 + 40, // (30+40)+60+40 = 170
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <Image
            src="/clearsky.svg"
            alt="Clearsky"
            width={400}
            height={131}
            priority
          />
        </div>
        {/* Main rectangle (900x380) centered below clearsky.svg */}
        <div
          style={{
            position: "absolute",
            top: 170 + 131 + 40, // 170+131+40 = 341
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 380,
            borderRadius: 46,
            background: "rgba(149,149,149,0.25)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 1,
          }}
        >
          {/* Inner white rectangle with back button and title */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 25,
              width: 850,
              height: 53,
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
              style={{ position: "absolute", left: 20, top: 14, width: 26, height: 25, display: "block", cursor: "pointer" }}
              onClick={() => router.push("/user_management")}
            />
            <span
              style={{
                position: "absolute",
                left: 20 + 26 + 20, // 20px from left, 26px icon, 20px gap
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 25,
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              Change Password
            </span>
          </div>
          {/* Form below the inner rectangle */}
          <form style={{ width: '80%', margin: '0 auto', marginTop: 24 + 53 + 20 }} onSubmit={handleSubmit}>
            {message ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="#27ae60"/>
                  <path d="M18 34L28 44L46 26" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{ color: '#27ae60', fontWeight: 700, fontSize: 20, marginTop: 18, textAlign: 'center' }}>
                  Password was changed successfully
                </div>
              </div>
            ) : (
              <>
                {/* New Password input */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: '#fff', fontFamily: 'var(--font-roboto)', fontWeight: 600, fontSize: 18 }}>
                    New Password
                  </label>
                  <div
                    style={{
                      width: '100%',
                      height: 49,
                      borderRadius: 55,
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      marginTop: 8,
                    }}
                  >
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        paddingLeft: 32,
                        paddingRight: 60,
                        fontSize: 18,
                        color: '#FFFFFF',
                        borderRadius: 55,
                        fontWeight: 'bold',
                      }}
                      autoComplete="new-password"
                    />
                    <div
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: 20,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {showNewPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                {/* Confirm Password input */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: '#fff', fontFamily: 'var(--font-roboto)', fontWeight: 600, fontSize: 18 }}>
                    Confirm Password
                  </label>
                  <div
                    style={{
                      width: '100%',
                      height: 49,
                      borderRadius: 55,
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      marginTop: 8,
                    }}
                  >
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        paddingLeft: 32,
                        paddingRight: 60,
                        fontSize: 18,
                        color: '#FFFFFF',
                        borderRadius: 55,
                        fontWeight: 'bold',
                      }}
                      autoComplete="new-password"
                    />
                    <div
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: 20,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {showConfirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                {/* Change Password button */}
                <button
                  type="submit"
                  style={{
                    width: 180,
                    height: 40,
                    borderRadius: 55,
                    background: '#0092FA',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: 'var(--font-roboto)',
                    border: 'none',
                    outline: 'none',
                    margin: '0 auto',
                    display: 'block',
                    marginTop: 10,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  Change Password
                </button>
              </>
            )}
            {error && (
              <div style={{ color: '#f44', marginTop: 10, textAlign: 'center', fontWeight: 600 }}>{error}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <ChangePasswordContent />
    </Suspense>
  );
}
