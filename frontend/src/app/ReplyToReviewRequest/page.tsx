"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function ReplyToReviewRequest() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "Course";
  const period = searchParams.get("period") || "Exam Period";
  const student = searchParams.get("student") || "Student Name";

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
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
        {/* Home, Review Requests, Post Grades, Statistics (left) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            onClick={() => router.push("/HomeScreen?role=Instructor")}
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
            style={{
              marginLeft: 18,
              color: "#0092FA",
              opacity: 0.7,
              fontSize: 23,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
            }}
          >
            Review Requests
          </div>
          <div
            onClick={() => {}}
            style={{
              marginLeft: 18,
              fontSize: 23,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              cursor: "pointer",
            }}
            className="text-white transition-colors duration-200 hover:text-gray-300"
          >
            Post Grades
          </div>
          <div
            onClick={() => {}}
            style={{
              marginLeft: 18,
              fontSize: 23,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              cursor: "pointer",
            }}
            className="text-white transition-colors duration-200 hover:text-gray-300"
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

      {/* Centered rectangle below clearsky.svg */}
      <div
        style={{
          position: "absolute",
          top: 301, // 40px below bottom of clearsky.svg
          left: "50%",
          transform: "translateX(-50%)",
          width: 1340,
          height: 450,
          borderRadius: 46,
          background: "rgba(128,128,128,0.3)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      >
        {/* Inner white rectangle with back button and course/period info */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 25,
            width: 1290,
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
            onClick={() => router.back()}
          />
          {/* Course and Exam Period text */}
          <div
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
            {`Reply To Review Request - ${course} (${period}) - ${student}`}
          </div>
        </div>
        {/* New rectangle 11.5px below the inner white rectangle, 30px from the left edge of the big rectangle */}
        <div
          ref={selectorRef}
          style={{
            position: "absolute",
            top: 24 + 53 + 11.5,
            left: 25,
            width: 200,
            height: 46,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setSelectorOpen((open) => !open)}
        >
          {selectedAction ? (
            <span
              style={{
                width: '100%',
                textAlign: 'center',
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 22,
                color: "#fff",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedAction}
            </span>
          ) : (
            <span
              style={{
                marginLeft: 25,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 22,
                color: "#fff",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
              }}
            >
              Select Action
              <span style={{ marginLeft: 1, marginTop: 1, display: "flex", alignItems: "center" }}>
                <svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5L11 9L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </span>
          )}
          {/* Dropdown selector */}
          {selectorOpen && (
            <div
              style={{
                position: "absolute",
                top: 46 + 8, // 8px gap below the rectangle
                left: 0,
                width: 200,
                borderRadius: 42,
                background: "rgba(255,255,255,0.18)",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "none",
              }}
            >
              {['Accept', 'Reject'].map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setSelectorOpen(false);
                    setTimeout(() => setSelectedAction(option), 0);
                  }}
                  style={{
                    height: 46,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 22,
                    color: "#fff",
                    background: "rgba(255,255,255,0.18)",
                    cursor: "pointer",
                    borderBottom: option === 'Accept' ? "1px solid rgba(255,255,255,0.12)" : "none",
                    transition: "background 0.2s",
                  }}
                  onMouseDown={e => e.preventDefault()}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 