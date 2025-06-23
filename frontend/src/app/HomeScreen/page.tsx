"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function HomeScreenDynamic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState("Student");
  
  useEffect(() => {
    const urlRole = searchParams.get("role");
    if (urlRole && ["Student", "Institution Manager", "Instructor"].includes(urlRole)) {
      setRole(urlRole);
    }
  }, [searchParams]);
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
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
        {/* Shift all content down to avoid cutting off navigation */}
        <div style={{ marginTop: 40 }}>
          {/* Rectangle with Welcome text and Sign Out */}
          <div style={{ position: "relative" }}>
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
              {/* Welcome Back text */}
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 23,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                }}
              >
                Welcome Back!
              </div>
              {/* Sign Out text */}
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
          </div>
          {/* Main content cards/rectangles */}
          {role === "Student" && (
            <>
              {/* My Courses */}
              <div
                onClick={() => router.push("/MyCourses")}
                style={{
                  position: "absolute",
                  left: 237,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 412,
                  height: 205,
                  borderRadius: 46,
                  background: "rgba(149,149,149,0.25)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "0.3px solid rgba(255, 255, 255, 0.77)",
                  boxSizing: "border-box",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105"
              >
                <div style={{ marginTop: 46, display: "flex", justifyContent: "center", width: "100%" }}>
                  <Image src="/book.svg" alt="Book" width={83} height={76} />
                </div>
                <div
                  style={{
                    marginTop: 5,
                    textAlign: "center",
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 25,
                    color: "#fff",
                    width: "100%",
                  }}
                >
                  My Courses
                </div>
              </div>
              {/* Statistics */}
              <div
                onClick={() => router.push("/Statistics")}
                style={{
                  position: "absolute",
                  right: 237,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 412,
                  height: 205,
                  borderRadius: 46,
                  background: "rgba(149,149,149,0.25)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "0.3px solid rgba(255, 255, 255, 0.77)",
                  boxSizing: "border-box",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105"
              >
                <div style={{ marginTop: 46, display: "flex", justifyContent: "center", width: "100%" }}>
                  <Image src="/statistics.svg" alt="Statistics" width={83} height={76} />
                </div>
                <div
                  style={{
                    marginTop: 5,
                    textAlign: "center",
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 25,
                    color: "#fff",
                    width: "100%",
                  }}
                >
                  Statistics
                </div>
              </div>
            </>
          )}
          {role === "Institution Manager" && (
            <>
              {/* Institutions */}
              <div
                onClick={() => router.push('/institutions')}
                style={{
                  position: "absolute",
                  left: 237,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 412,
                  height: 205,
                  borderRadius: 46,
                  background: "rgba(149,149,149,0.25)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "0.3px solid rgba(255, 255, 255, 0.77)",
                  boxSizing: "border-box",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105"
              >
                <div style={{ marginTop: 46, display: "flex", justifyContent: "center", width: "100%" }}>
                  <Image src="/book.svg" alt="Book" width={83} height={76} />
                </div>
                <div
                  style={{
                    marginTop: 5,
                    textAlign: "center",
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 25,
                    color: "#fff",
                    width: "100%",
                  }}
                >
                  Institutions
                </div>
              </div>
              {/* User Management */}
              <div
                onClick={() => router.push('/user_management')}
                style={{
                  position: "absolute",
                  right: 237,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 412,
                  height: 205,
                  borderRadius: 46,
                  background: "rgba(149,149,149,0.25)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "0.3px solid rgba(255, 255, 255, 0.77)",
                  boxSizing: "border-box",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105"
              >
                <div style={{ marginTop: 46, display: "flex", justifyContent: "center", width: "100%" }}>
                  <Image src="/user_management.svg" alt="User Management" width={85} height={82} />
                </div>
                <div
                  style={{
                    marginTop: 5,
                    textAlign: "center",
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 25,
                    color: "#fff",
                    width: "100%",
                  }}
                >
                  User Management
                </div>
              </div>
            </>
          )}
          {role === "Instructor" && (
            <>
              {/* Review Requests */}
              <div
                onClick={() => router.push("/ReviewRequests")}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 142,
                  transform: "translateY(-50%)",
                  width: 315,
                  height: 205,
                  borderRadius: 46,
                  background: "rgba(149,149,149,0.25)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "0.3px solid rgba(255, 255, 255, 0.77)",
                  boxSizing: "border-box",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105"
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                  <Image src="/view_review_status.svg" alt="Review Status" width={57.4} height={66.23} style={{ position: "absolute", top: 53, left: 129, display: "block" }} />
                  <div style={{ position: "absolute", top: 53 + 66.23 + 8.77, left: 62, fontFamily: "var(--font-roboto)", fontWeight: 600, fontSize: 25, color: "#fff", textAlign: "left", whiteSpace: "nowrap" }}>Review Requests</div>
                </div>
              </div>
              {/* Post Grades */}
              <div
                onClick={() => router.push('/PostGrades')}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 142 + 315 + 105.5,
                  transform: "translateY(-50%)",
                  width: 315,
                  height: 205,
                  borderRadius: 46,
                  background: "rgba(149,149,149,0.25)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "0.3px solid rgba(255, 255, 255, 0.77)",
                  boxSizing: "border-box",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105"
              >
                <Image src="/post_grades.svg" alt="Post Grades" width={55} height={73} style={{ position: "absolute", top: 44, left: 128.5, display: "block" }} />
                <div style={{ position: "absolute", top: 44 + 73 + 8.7, left: 89.5, fontFamily: "var(--font-roboto)", fontWeight: 600, fontSize: 25, color: "#fff", textAlign: "left", whiteSpace: "nowrap" }}>Post Grades</div>
              </div>
              {/* Statistics */}
              <div
                onClick={() => router.push('/statistics_instructor')}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 142 + 315 + 105.5 + 315 + 105.5,
                  transform: "translateY(-50%)",
                  width: 315,
                  height: 205,
                  borderRadius: 46,
                  background: "rgba(149,149,149,0.25)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "0.3px solid rgba(255, 255, 255, 0.77)",
                  boxSizing: "border-box",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105"
              >
                <Image src="/statistics.svg" alt="Statistics" width={82} height={75} style={{ position: "absolute", top: 44.3, left: 117, display: "block" }} />
                <div style={{ position: "absolute", top: 44.3 + 75 + 8.7, left: 105, fontFamily: "var(--font-roboto)", fontWeight: 600, fontSize: 25, color: "#fff", textAlign: "left", whiteSpace: "nowrap" }}>Statistics</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <HomeScreenDynamic />
    </Suspense>
  );
}
