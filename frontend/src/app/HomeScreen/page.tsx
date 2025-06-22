"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function HomeScreen() {
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
    <div className="relative min-h-screen w-full overflow-hidden" style={{ minHeight: "100vh", width: "100vw" }}>
      {/* Background image */}
      <Image
        src="/background_home.png"
        alt="Home background"
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        priority
      />
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
            WebkitBackdropFilter: "blur(10px)", // For Safari support
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

      {/* First Colored Rectangle */}
      {role === "Student" && (
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
          WebkitBackdropFilter: "blur(10px)", // For Safari support
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box", // Ensures border is drawn inside
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer", // Add pointer cursor to indicate clickability
          transition: "transform 0.2s ease", // Add smooth hover effect
        }}
        className="hover:scale-105"
      >
          {/* Overlay: Book icon and My Courses text */}
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
      )}

      {/* Second Colored Rectangle */}
      {role === "Student" && (
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
          WebkitBackdropFilter: "blur(10px)", // For Safari support
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box", // Ensures border is drawn inside
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer", // Add pointer cursor to indicate clickability
          transition: "transform 0.2s ease", // Add smooth hover effect
        }}
        className="hover:scale-105"
      >
        {/* Statistics SVG centered, 46px from top */}
        <div style={{ marginTop: 46, display: "flex", justifyContent: "center", width: "100%" }}>
          <Image src="/statistics.svg" alt="Statistics" width={83} height={76} />
        </div>
        {/* Statistics text, 5px below SVG */}
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
      )}

      {/* Institution Manager Rectangles (same as Student, but without top overlays) */}
      {role === "Institution Manager" && (
        <>
          <div
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
            onClick={() => router.push('/institutions')}
          >
            {/* Overlay: Book icon and Institutions text for Institution Manager only */}
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
            <img
              src="/user_management.svg"
              alt="User Management"
              width={84.67}
              height={81.86}
              style={{
                position: "absolute",
                top: 45,
                left: 172.92,
                display: "block"
              }}
            />
            <div
              style={{
                marginTop: 5,
                textAlign: "center",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 25,
                color: "#fff",
                width: "100%",
                position: "absolute",
                top: 48.8 + 70,
                left: 0,
                whiteSpace: "nowrap",
              }}
            >
              User Management
            </div>
          </div>
        </>
      )}

      {/* Instructor Rectangles */}
      {role === "Instructor" && (
        <>
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
            {/* Content for first instructor rectangle */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src="/view_review_status.svg"
                alt="Review Status"
                width={57.4}
                height={66.23}
                style={{
                  position: "absolute",
                  top: 53,
                  left: 129,
                  display: "block"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 53 + 66.23 + 8.77,
                  left: 62,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 25,
                  color: "#fff",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                Review Requests
              </div>
            </div>
          </div>
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
            {/* Content for second instructor rectangle */}
            <img
              src="/post_grades.svg"
              alt="Post Grades"
              width={55}
              height={73}
              style={{
                position: "absolute",
                top: 44,
                left: 128.5,
                display: "block"
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 44 + 73 + 8.7,
                left: 89.5,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 25,
                color: "#fff",
                textAlign: "left",
                whiteSpace: "nowrap",
              }}
            >
              Post Grades
            </div>
          </div>
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
            {/* Content for third instructor rectangle */}
            <img
              src="/statistics.svg"
              alt="Statistics"
              width={82}
              height={75}
              style={{
                position: "absolute",
                top: 44.3,
                left: 117,
                display: "block"
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 44.3 + 75 + 8.7,
                left: 105,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 25,
                color: "#fff",
                textAlign: "left",
                whiteSpace: "nowrap",
              }}
            >
              Statistics
            </div>
          </div>
        </>
      )}
    </div>
  );
} 