"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserManagement() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apiUsers, setApiUsers] = useState<any[] | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ email: string; name: string } | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState<{ email: string; studentID: string | null; name: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setApiUsers(null);
        return;
      }
      try {
        const response = await fetch("/api/userManagement/usersByInstitution", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setApiUsers(data);
      } catch {
        setApiUsers(null);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = (email: string, name: string) => {
    setUserToDelete({ email, name });
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No auth token found");
      return;
    }

    try {
      // Get institutionID from JWT token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const institutionID = payload.institutionID;

      const response = await fetch("/api/userManagement/removeUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userToDelete.email,
          institutionID: institutionID,
        }),
      });

      if (response.ok) {
        // Refresh the user list
        const updatedResponse = await fetch("/api/userManagement/usersByInstitution", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const updatedData = await updatedResponse.json();
        setApiUsers(updatedData);
        setShowDeleteConfirmation(false);
        setUserToDelete(null);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete user: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirmation(false);
    setUserToDelete(null);
  };

  const handleChangePassword = (email: string, studentID: string | null, name: string) => {
    setUserToChangePassword({ email, studentID, name });
    setShowChangePassword(true);
  };

  const confirmChangePassword = async () => {
    if (!userToChangePassword || !newPassword) {
        alert("Please enter a new password.");
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No auth token found");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const institutionID = payload.institutionID;

      const body = {
        email: userToChangePassword.email,
        password: newPassword,
        institutionID: institutionID,
        studentID: userToChangePassword.studentID,
      };

      console.log('Sending to API:', body);
      console.log('studentID type:', typeof userToChangePassword.studentID);

      const response = await fetch("/api/userManagement/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("Password changed successfully.");
        setShowChangePassword(false);
        setUserToChangePassword(null);
        setNewPassword("");
      } else {
        const errorData = await response.json();
        alert(`Failed to change password: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Error changing password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const cancelChangePassword = () => {
    setShowChangePassword(false);
    setUserToChangePassword(null);
    setNewPassword("");
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
            top: 70,
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
            top: 70 + 60 + 40, // header top + header height + spacing
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
            top: 70 + 60 + 40 + 131 + 15, // nav top + nav height + spacing + clearsky height + 15px
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
            top: 70 + 60 + 40 + 131 + 80, // moved down by 40px
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
                    console.log('Original studentID:', row.studentID, 'Type:', typeof row.studentID);
                    // Handle both number and string cases
                    if (row.studentID !== null && row.studentID !== undefined) {
                      studentID = row.studentID;
                  }
                  }
                  console.log('Final studentID being sent:', studentID, 'Type:', typeof studentID);
                  handleChangePassword(row.email, studentID, row.FullName);
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
                onClick={() => handleDeleteUser(row.email, row.FullName)}
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

        {/* Delete Confirmation Dialog (canvas-centered) */}
        {showDeleteConfirmation && userToDelete && (
          <>
            {/* Optional: dimmed overlay inside canvas */}
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
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                height: 300,
                borderRadius: 46,
                background: "rgba(149,149,149,0.25)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "0.3px solid rgba(255, 255, 255, 0.77)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 40,
                zIndex: 10002,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 24,
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Confirm Delete User
              </div>
              <div
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 400,
                  fontSize: 18,
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                Are you sure you want to delete <strong>{userToDelete.name}</strong> ({userToDelete.email})?
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <button
                  onClick={cancelDeleteUser}
                  style={{
                    width: 120,
                    height: 40,
                    borderRadius: 55,
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: "var(--font-roboto)",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  style={{
                    width: 120,
                    height: 40,
                    borderRadius: 55,
                    background: "#ff4444",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: "var(--font-roboto)",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}

        {/* Change Password Dialog (canvas-centered) */}
        {showChangePassword && userToChangePassword && (
          <>
            {/* Optional: dimmed overlay inside canvas */}
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
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                height: 350,
                borderRadius: 46,
                background: "rgba(149,149,149,0.25)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "0.3px solid rgba(255, 255, 255, 0.77)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 40,
                zIndex: 10002,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 24,
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Change Password for {userToChangePassword.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 400,
                  fontSize: 18,
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Enter the new password for {userToChangePassword.email}.
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                style={{
                  width: '80%',
                  height: 40,
                  padding: '0 15px',
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: 16,
                  marginBottom: 40,
                  outline: 'none'
                }}
              />
              <div style={{ display: "flex", gap: 20 }}>
                <button
                  onClick={cancelChangePassword}
                  style={{
                    width: 120,
                    height: 40,
                    borderRadius: 55,
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: "var(--font-roboto)",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChangePassword}
                  style={{
                    width: 120,
                    height: 40,
                    borderRadius: 55,
                    background: "#007bff",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    fontFamily: "var(--font-roboto)",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 