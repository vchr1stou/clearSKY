"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function Statistics() {
  const router = useRouter();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [courses, setCourses] = useState<{ course_name: string; exam_period: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectorPosition, setSelectorPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  
  // Open selector and calculate position
  const handleSelectorClick = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      // debug output removed
      return;
    }
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setSelectorPosition({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    fetch("http://localhost:3002/api/courses/myCourses", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCourses(data);
          setSelectorOpen(true);
        }
      })
      .catch(() => {/* debug output removed */});
  };

  // Close selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        document.getElementById('selector-dropdown') &&
        !(document.getElementById('selector-dropdown') as HTMLElement).contains(event.target as Node)
      ) {
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

  const handleOptionSelect = (course: { course_name: string; exam_period: string }) => {
    setSelectedOption(`${course.course_name} - ${course.exam_period}`);
    setSelectorOpen(false);
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
          ref={selectRef}
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
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onClick={handleSelectorClick}
        >
          {selectedOption || "Select a course to view statistics"}
          <span style={{ marginLeft: 2, display: "flex", alignItems: "center" }}>
            <svg width="28" height="28" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 5L11 9L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
      {/* Large blurred rectangle under the selector */}
      <div
        style={{
          position: "absolute",
          top: 130 + 85 + 60 + 42, // below the selector
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
      >
        {/* Content can be added here if needed */}
      </div>
      {/* 437x34 rectangle, 25px below the top of the large blurred rectangle, centered horizontally, always on top */}
      {selectedOption && (
        <div
          style={{
            position: "absolute",
            top: 130 + 85 + 60 + 42 + 25, // top of large blurred rectangle + 25
            left: 59 + 549 / 2 - 437 / 2, // center in the blurred rectangle
            width: 437,
            height: 34,
            borderRadius: 100,
            background: "rgba(255,255,255,0.18)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              color: "#fff",
              textAlign: "center",
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {selectedOption} - Total
          </span>
        </div>
      )}

      {/* Selector dropdown rendered at top level */}
      {selectorOpen && selectorPosition && createPortal(
        <div
          id="selector-dropdown"
          style={{
            position: "absolute",
            top: selectorPosition.top,
            left: selectorPosition.left + (selectorPosition.width / 2) - 210, // 210 = 420/2
            width: 420,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {courses.length === 0 ? (
            <div style={{ color: '#fff', padding: '12px 20px', fontFamily: 'var(--font-roboto)', fontWeight: 600, fontSize: 20, textAlign: 'center' }}>No courses found.</div>
          ) : (
            courses.map((course, idx) => (
              <div
                key={course.course_name + course.exam_period + idx}
                onClick={() => handleOptionSelect(course)}
                style={{
                  padding: "12px 20px",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  cursor: "pointer",
                  borderBottom: idx < courses.length - 1 ? "0.3px solid rgba(255, 255, 255, 0.3)" : "none",
                  transition: "background-color 0.2s",
                  textAlign: 'center',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              >
                {course.course_name} - {course.exam_period}
              </div>
            ))
          )}
        </div>,
        document.body
      )}

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
      >
        {/* 199x21 rectangle, 17px below the top, centered horizontally, only if a course is selected */}
        {selectedOption && (
          <div
            style={{
              position: "absolute",
              top: 17,
              left: "50%",
              transform: "translateX(-50%)",
              width: 199,
              height: 21,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 12,
                color: "#fff",
                textAlign: "center",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            >
              {selectedOption.replace(/ - Total$/, "").trim()} - Q1
            </span>
          </div>
        )}
      </div>
      {/* Second small right rectangle, below the first */}
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
      >
        {selectedOption && (
          <div
            style={{
              position: "absolute",
              top: 17,
              left: "50%",
              transform: "translateX(-50%)",
              width: 199,
              height: 21,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 12,
                color: "#fff",
                textAlign: "center",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            >
              {selectedOption.replace(/ - Total$/, "").trim()} - Q3
            </span>
          </div>
        )}
      </div>
      {/* Third small far right rectangle */}
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
      >
        {selectedOption && (
          <div
            style={{
              position: "absolute",
              top: 17,
              left: "50%",
              transform: "translateX(-50%)",
              width: 199,
              height: 21,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 12,
                color: "#fff",
                textAlign: "center",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            >
              {selectedOption.replace(/ - Total$/, "").trim()} - Q2
            </span>
          </div>
        )}
      </div>
      {/* Fourth small far right rectangle, below the third */}
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
      >
        {selectedOption && (
          <div
            style={{
              position: "absolute",
              top: 17,
              left: "50%",
              transform: "translateX(-50%)",
              width: 199,
              height: 21,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 12,
                color: "#fff",
                textAlign: "center",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            >
              {selectedOption.replace(/ - Total$/, "").trim()} - Q4
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 