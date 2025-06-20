"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Statistics() {
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
        {/* Home, My Courses, and Statistics (left) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            onClick={() => router.push("/HomeScreen")}
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
            onClick={() => router.push("/MyCourses")}
            style={{
              marginLeft: 18,
              fontSize: 23,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              cursor: "pointer",
            }}
            className="text-white transition-colors duration-200 hover:text-gray-300"
          >
            My Courses
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
            Statistics
          </div>
        </div>
        {/* Sign Out button (rightmost) */}
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

      {/* Clearsky logo centered in the 85px space between nav bar and first rectangle */}
      <div
        style={{
          position: "absolute",
          top: 105, // nav bar bottom is at 130, this is the start of the 85px gap
          left: "50%",
          transform: "translateX(-50%)",
          height: 85,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <img
          src="/clearsky.svg"
          alt="Clearsky"
          style={{ maxHeight: 90, maxWidth: 400, width: "auto", height: "auto", display: "block" }}
        />
      </div>

      {/* New center rectangle, now 130px from the top (where clearsky.svg used to start) */}
      <div
        style={{
          position: "absolute",
          top: 130 + 85, // move 85px further down
          left: "50%",
          transform: "translateX(-50%)",
          width: 1340,
          height: 60,
          borderRadius: 100,
          background: "rgba(128,128,128,0.3)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 2,
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
            zIndex: 3,
          }}
        >
          Select a course to view statistics
          <span style={{ marginLeft: 2, display: "flex", alignItems: "center" }}>
            <svg width="28" height="28" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 5L11 9L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* New left rectangle 42px below the bottom of the center rectangle, 59px from the left edge */}
      <div
        style={{
          position: "absolute",
          top: 130 + 85 + 60 + 42, // move 85px further down
          left: 59,
          width: 549,
          height: 433,
          borderRadius: 46,
          background: "rgba(128,128,128,0.3)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      />

      {/* New right rectangle 46px to the right of the left rectangle, aligned to its top */}
      <div
        style={{
          position: "absolute",
          top: 130 + 85 + 60 + 42, // move 85px further down
          left: 59 + 549 + 46, // right edge of left rectangle + 46px
          width: 357,
          height: 209,
          borderRadius: 46,
          background: "rgba(128,128,128,0.3)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      />

      {/* New bottom right rectangle 10px below the small right rectangle */}
      <div
        style={{
          position: "absolute",
          top: 130 + 85 + 60 + 42 + 209 + 10, // move 85px further down
          left: 59 + 549 + 46, // same as small right rectangle
          width: 357,
          height: 209,
          borderRadius: 46,
          background: "rgba(128,128,128,0.3)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      />

      {/* New far right rectangle 35px to the right of the first small right rectangle */}
      <div
        style={{
          position: "absolute",
          top: 130 + 85 + 60 + 42, // move 85px further down
          left: 59 + 549 + 46 + 357 + 18, // right edge of first small right rectangle + 18px
          width: 357,
          height: 209,
          borderRadius: 46,
          background: "rgba(128,128,128,0.3)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      />

      {/* New bottom far right rectangle 10px below the far right rectangle */}
      <div
        style={{
          position: "absolute",
          top: 130 + 85 + 60 + 42 + 209 + 10, // move 85px further down
          left: 59 + 549 + 46 + 357 + 18, // same as far right rectangle
          width: 357,
          height: 209,
          borderRadius: 46,
          background: "rgba(128,128,128,0.3)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      />

      {/* Content will be added here */}
    </div>
  );
} 