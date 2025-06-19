"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomeScreen() {
  const router = useRouter();
  
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

      {/* Second Colored Rectangle */}
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
    </div>
  );
} 