"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomeScreen() {
  const router = useRouter();
  const [role, setRole] = useState("Student");
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ minHeight: "100vh", width: "100vw" }}>
      {/* Dummy Role Switch */}
      <div
        style={{
          position: "fixed",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: 16,
          background: "rgba(128,128,128,0.3)",
          borderRadius: 30,
          padding: "8px 24px",
          border: "0.3px solid rgba(255,255,255,0.77)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          alignItems: "center",
        }}
      >
        {["Student", "Institution Manager", "Instructor"].map(option => (
          <button
            key={option}
            onClick={() => setRole(option)}
            style={{
              background: role === option ? "#0092FA" : "transparent",
              color: role === option ? "#fff" : "#222",
              border: "none",
              borderRadius: 20,
              padding: "8px 18px",
              fontWeight: 600,
              fontFamily: "var(--font-roboto)",
              fontSize: 18,
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {option}
          </button>
        ))}
      </div>
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
            Welcome Back: User
          </div>
          {/* Sign Out text */}
          <div
            onClick={() => router.push("/")}
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
            background: "linear-gradient(rgba(149,149,149,0.25), rgba(255,0,0,0.18))",
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
          {/* Book SVG centered, 46px from top */}
          <div style={{ marginTop: 46, display: "flex", justifyContent: "center", width: "100%" }}>
            <Image src="/book.svg" alt="Book" width={83} height={76} />
          </div>
          {/* My Courses text, 13px below SVG */}
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
            background: "linear-gradient(rgba(149,149,149,0.25), rgba(255,0,0,0.18))",
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

      {/* Instructor Rectangles */}
      {role === "Instructor" && (
        <>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 142,
              transform: "translateY(-50%)",
              width: 315,
              height: 205,
              borderRadius: 46,
              background: "linear-gradient(rgba(149,149,149,0.25), rgba(255,0,0,0.18))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "0.3px solid rgba(255, 255, 255, 0.77)",
              boxSizing: "border-box",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Content for first instructor rectangle */}
            <div
              style={{
                position: "absolute",
                top: 53,
                left: 129,
                width: 57.4,
                height: 66.23,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="/view_review_status.svg"
                alt="Review Status"
                width={57.4}
                height={66.23}
                style={{ display: "block" }}
              />
              <div
                style={{
                  marginTop: 8.77,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 25,
                  color: "#fff",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Review Requests
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 142 + 315 + 105.5,
              transform: "translateY(-50%)",
              width: 315,
              height: 205,
              borderRadius: 46,
              background: "linear-gradient(rgba(149,149,149,0.25), rgba(255,0,0,0.18))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "0.3px solid rgba(255, 255, 255, 0.77)",
              boxSizing: "border-box",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Content for second instructor rectangle */}
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 142 + 315 + 105.5 + 315 + 105.5,
              transform: "translateY(-50%)",
              width: 315,
              height: 205,
              borderRadius: 46,
              background: "linear-gradient(rgba(149,149,149,0.25), rgba(255,0,0,0.18))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "0.3px solid rgba(255, 255, 255, 0.77)",
              boxSizing: "border-box",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Content for third instructor rectangle */}
          </div>
        </>
      )}
    </div>
  );
} 