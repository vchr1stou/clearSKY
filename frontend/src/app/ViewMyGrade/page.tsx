"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function ViewMyGrade() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "Course";
  const period = searchParams.get("period") || "Exam Period";
  const [selectedQ, setSelectedQ] = useState("Q1");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      {/* Top Navigation Bar Rectangle (same as My Courses) */}
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
        {/* Home, My Courses, Statistics (left) */}
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
              color: "#0092FA",
              opacity: 0.7,
            }}
            className="transition-colors duration-200 hover:text-gray-300"
          >
            My Courses
          </div>
          <div
            onClick={() => router.push("/Statistics")}
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

      {/* Large blurred rectangle centered below clearsky.svg (no overlays) */}
      <div
        style={{
          position: "absolute",
          top: 30 + 60 + 40 + 131 + 40, // nav top + nav height + spacing + clearsky height + 40px
          left: "50%",
          transform: "translateX(-50%)",
          width: 1340,
          height: 450,
          borderRadius: 46,
          background: "linear-gradient(rgba(149,149,149,0.25), rgba(255,0,0,0.18))",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        {/* Inner white rectangle */}
        <div
          style={{
            position: "absolute",
            top: 25,
            left: 24,
            width: 1290,
            height: 53,
            borderRadius: 100,
            background: "rgba(255,255,255,0.18)",
            zIndex: 2,
          }}
        >
          <img
            src="/back.svg"
            alt="Back"
            width={26}
            height={25}
            style={{ position: "absolute", left: 20, top: 14, width: 26, height: 25, display: "block", cursor: "pointer" }}
            onClick={() => router.push("/MyCourses")}
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
            {course} ({period})
          </div>
        </div>

        {/* My Grades rectangle */}
        <div
          style={{
            position: "absolute",
            top: 25 + 53 + 36, // 25px (top of back rect) + 53px (height of back rect) + 36px
            left: 25,
            width: 373,
            height: 295,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 2,
          }}
        >
          {/* My Grades text overlay */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 0,
              width: "100%",
              textAlign: "center",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              color: "#fff",
              zIndex: 3,
            }}
          >
            My Grades
          </div>
          {/* Line below My Grades */}
          <div
            style={{
              position: "absolute",
              top: 34, // 7px (top) + 20px (font size) + 7px
              left: 15,
              width: 344.01,
              height: 1,
              background: "rgba(255,255,255,0.8)",
              zIndex: 3,
            }}
          />
          {/* Additional lines below the first line */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={"grades-line-" + i}
              style={{
                position: "absolute",
                top: 34 + 48 * (i + 1),
                left: 15,
                width: 344.01,
                height: 1,
                background: "rgba(255,255,255,0.8)",
                zIndex: 3,
              }}
            />
          ))}
          {/* Q1-Q5 labels vertically centered between lines */}
          {["Total:", "Q1:", "Q2:", "Q3:", "Q4:"].map((label, i) => (
            <React.Fragment key={"q-label-" + i}>
              {/* Overlay rectangle */}
              <div
                style={{
                  position: "absolute",
                  left: 291,
                  top: 34 + 48 * i + 24,
                  width: 67,
                  height: 24,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: 12,
                  transform: "translateY(-50%)",
                  zIndex: 3,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "rgba(255,255,255,1)",
                  }}
                >
                  {i + 1}
                </span>
              </div>
              {/* Label */}
              <div
                style={{
                  position: "absolute",
                  left: 15,
                  top: 34 + 48 * i + 24,
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "rgba(255, 255, 255, 0.8)",
                  zIndex: 4,
                }}
              >
                {label}
              </div>
            </React.Fragment>
          ))}
        </div>
        {/* Second large rectangle, 85px to the right of the first */}
        <div
          style={{
            position: "absolute",
            top: 25 + 53 + 36,
            left: 25 + 373 + 85,
            width: 373,
            height: 295,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 2,
          }}
        >
          {/* Title: {course} - {period} - Total */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 0,
              width: "100%",
              textAlign: "center",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              color: "#fff",
              zIndex: 3,
            }}
          >
            {course} - {period} - Total
          </div>
          {/* Line below title */}
          <div
            style={{
              position: "absolute",
              top: 34, // 7px (top) + 20px (font size) + 7px
              left: 15,
              width: 344.01,
              height: 1,
              background: "rgba(255,255,255,0.8)",
              zIndex: 3,
            }}
          />
        </div>
        {/* Third large rectangle, 85px to the right of the second */}
        <div
          style={{
            position: "absolute",
            top: 25 + 53 + 36,
            left: 25 + 373 + 85 + 373 + 85,
            width: 373,
            height: 295,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 2,
          }}
        >
          {/* Title: {course} - {period} - Q1 with chevron */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 0,
              width: "100%",
              height: 28, // covers the title bar
              textAlign: "center",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              color: "#fff",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              pointerEvents: "auto",
              transition: "background 0.2s",
            }}
            onClick={e => {
              // Only navigate if the chevron was NOT clicked
              if ((e.target as HTMLElement).closest('.chevron-dropdown')) return;
              router.push("/AskForReview");
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '';
            }}
          >
            <span>{course} - {period} - {selectedQ}</span>
            <span
              className="chevron-dropdown"
              style={{
                marginLeft: 1,
                display: "flex",
                alignItems: "center",
                userSelect: "none",
                cursor: "pointer",
                zIndex: 21,
                pointerEvents: "auto",
              }}
              onClick={e => {
                e.stopPropagation();
                setDropdownOpen((open) => !open);
              }}
            >
              {/* Right chevron SVG */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 5L11 9L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {/* Dropdown */}
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 35,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.85)",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 30,
                  minWidth: 90,
                  padding: "6px 0",
                }}
              >
                {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                  <div
                    key={q}
                    onClick={() => {
                      setSelectedQ(q);
                      setDropdownOpen(false);
                    }}
                    style={{
                      padding: "6px 18px",
                      color: "#fff",
                      fontFamily: "var(--font-roboto)",
                      fontWeight: 500,
                      fontSize: 17,
                      cursor: "pointer",
                      background: selectedQ === q ? "rgba(255,255,255,0.12)" : "none",
                      borderRadius: 6,
                      transition: "background 0.2s",
                    }}
                    onMouseDown={e => e.preventDefault()}
                  >
                    {q}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Line below title */}
          <div
            style={{
              position: "absolute",
              top: 34, // 7px (top) + 20px (font size) + 7px
              left: 15,
              width: 344.01,
              height: 1,
              background: "rgba(255,255,255,0.8)",
              zIndex: 3,
            }}
          />
        </div>
      </div>
    </div>
  );
} 