"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserManagement() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apiUsers, setApiUsers] = useState<any[] | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setApiError("No auth token found in localStorage");
        setApiUsers(null);
        return;
      }
      try {
        const response = await fetch("http://localhost:3001/api/userManagement/usersByInstitution", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setApiUsers(data);
        setApiError(null);
      } catch (error) {
        setApiError("Error fetching users by institution: " + (error instanceof Error ? error.message : String(error)));
        setApiUsers(null);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ minHeight: "100vh", width: "100vw" }}>
      {/* DEBUG: Show API response at the top of the page */}
      {apiError && (
        <div style={{ background: '#ffdddd', color: '#a00', padding: 10, marginBottom: 10, borderRadius: 8, maxWidth: 800, wordBreak: 'break-all', zIndex: 10000, position: 'relative' }}>
          <strong>Error:</strong> {apiError}
        </div>
      )}
      <div style={{ background: 'white', color: 'black', padding: 10, marginBottom: 10, borderRadius: 8, maxWidth: 800, wordBreak: 'break-all', zIndex: 10000, position: 'relative' }}>
        <strong>API Response (First Entry):</strong>
        <pre style={{ margin: 0, fontSize: 14 }}>
          {apiUsers
            ? Array.isArray(apiUsers)
              ? JSON.stringify(apiUsers[0], null, 2)
              : JSON.stringify(apiUsers, null, 2)
            : 'Loading...'}
        </pre>
      </div>
      {/* Background image */}
      <Image
        src="/background_home.png"
        alt="Home background"
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        priority
      />
      {/* Top Navigation Bar */}
      <div
        style={{
          position: "absolute",
          top: 30,
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
          top: 30 + 60 + 40, // header top + header height + spacing
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
      {/* Rectangle centered 15px below the bottom of clearsky.svg */}
      <div
        onClick={() => router.push("/add_user")}
        style={{
          position: "absolute",
          top: 30 + 60 + 40 + 131 + 15, // nav top + nav height + spacing + clearsky height + 15px
          left: "50%",
          transform: "translateX(-50%)",
          width: 232,
          height: 48,
          borderRadius: 24,
          background: "rgba(149,149,149,0.25)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1.4px solid rgba(255,255,255,0.3)",
          boxSizing: "border-box",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start", // align content to the left
          paddingLeft: 47, // add padding for the icon
          cursor: "pointer",
        }}
      >
        <img
          src="/user_management.svg" // Make sure this file exists in public/
          alt="Add User"
          width={27}
          height={26}
          style={{ display: "block" }}
        />
        <span
          style={{
            marginLeft: 11,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 20,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          Add User
        </span>
      </div>
      {/* Large blurred rectangle centered below clearsky.svg */}
      <div
        style={{
          position: "absolute",
          top: 30 + 60 + 40 + 131 + 80, // moved down by 40px
          left: "50%",
          transform: "translateX(-50%)",
          width: 1340,
          height: 450,
          borderRadius: 46,
          background: "rgba(149,149,149,0.25)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        {/* Overlayed Course Name text */}
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 30,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Full Name
        </div>
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 330,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Email
        </div>
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 630,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Type
        </div>
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 954,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Actions
        </div>
        <div
          style={{
            position: "absolute",
            top: 20.5 + 25 + 16, // header top + header height (approx) + 16px
            left: 30,
            width: 1280,
            height: 1,
            background: "rgba(255,255,255,0.8)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Scrollable row content */}
        <div
          style={{
            position: "absolute",
            top: 20.5 + 25 + 16, // below the header line
            left: 0,
            width: 1340,
            height: 450 - (20.5 + 25 + 16) - 20, // leave some padding at the bottom
            overflowY: "auto",
          }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {Array.isArray(apiUsers) && apiUsers.map((row: any, i: number) => (
            <React.Fragment key={row.userID || row.studentID || i}>
              {/* Full Name */}
              <div
                style={{
                  position: "absolute",
                  top: 57 * i,
                  height: 57,
                  display: 'flex',
                  alignItems: 'center',
                  left: 30,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                {row.FullName}
              </div>
              {/* Email */}
              <div
                style={{
                  position: "absolute",
                  top: 57 * i,
                  height: 57,
                  display: 'flex',
                  alignItems: 'center',
                  left: 330,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                {row.email}
              </div>
              {/* Type (role) */}
              <div
                style={{
                  position: "absolute",
                  top: 57 * i,
                  height: 57,
                  display: 'flex',
                  alignItems: 'center',
                  left: 630,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                {row.role === 'STUDENT'
                  ? `Student (${row.studentID})`
                  : row.role === 'INSTRUCTOR'
                    ? 'Instructor'
                    : row.role === 'INSTITUTION_REPRESENTATIVE'
                      ? 'Institution Representative'
                      : row.role}
              </div>
            </React.Fragment>
          ))}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {Array.isArray(apiUsers) && apiUsers.map((row: any, i: number) => (
            <div
              key={"action-rect-" + i}
              style={{
                position: "absolute",
                top: 57 * i + 57 / 2 - 16.5,
                left: 954,
                width: 175,
                height: 33,
                borderRadius: 100,
                background: "rgba(255,255,255,0.18)",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                let studentID = null;
                if (row.role === 'STUDENT') {
                  // Extract studentID from "Student (studentID)" format
                  const match = row.studentID ? row.studentID.toString() : '';
                  studentID = match;
                }
                router.push(`/change_password?email=${encodeURIComponent(row.email)}&studentID=${encodeURIComponent(studentID || '')}`);
              }}
            >
              <img
                src="/change_password.svg"
                alt="Change Password"
                width={9}
                height={16}
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 16 + 9 + 5,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                Change Password
              </div>
            </div>
          ))}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {Array.isArray(apiUsers) && apiUsers.map((row: any, i: number) => (
            <div
              key={"action-rect-2-" + i}
              style={{
                position: "absolute",
                top: 57 * i + 57 / 2 - 16.5,
                left: 1135,
                width: 175,
                height: 33,
                borderRadius: 100,
                background: "rgba(255,255,255,0.18)",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <img
                src="/delete_user.svg"
                alt="Delete User"
                width={12}
                height={15}
                style={{
                  position: "absolute",
                  left: 36.5,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 36.5 + 12 + 5,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                Delete User
              </div>
            </div>
          ))}
          {/* 7 horizontal lines as row separators */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={"row-line-" + i}
              style={{
                position: "absolute",
                top: 20.5 + 25 + 16 + 57 * i,
                left: 30,
                width: 1280,
                height: 1,
                background: "rgba(255,255,255,0.8)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 