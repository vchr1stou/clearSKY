"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";

export default function ReplyToReviewRequest() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "Course";
  const period = searchParams.get("period") || "Exam Period";
  const student = searchParams.get("student") || "Student Name";

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectorPosition, setSelectorPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const selectActionRef = useRef<HTMLDivElement>(null);
  const [replyText, setReplyText] = useState("");
  const [replyFocused, setReplyFocused] = useState(false);

  // Open selector and calculate position
  const handleSelectActionClick = () => {
    if (selectActionRef.current) {
      const rect = selectActionRef.current.getBoundingClientRect();
      setSelectorPosition({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
      setSelectorOpen((open) => !open);
    }
  };

  // Close selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectActionRef.current &&
        !selectActionRef.current.contains(event.target as Node) &&
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
          ref={selectActionRef}
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
          onClick={handleSelectActionClick}
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
        </div>
        {/* New rectangle 12px below the Select Action rectangle */}
        <div
          style={{
            position: "absolute",
            top: 24 + 53 + 11.5 + 46 + 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1285,
            height: 193,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            setReplyFocused(true);
            document.getElementById("reply-textarea")?.focus();
          }}
        >
          <textarea
            id="reply-textarea"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onFocus={() => setReplyFocused(true)}
            onBlur={() => setReplyFocused(false)}
            style={{
              width: "97%",
              height: "90%",
              resize: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#fff",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              textAlign: "left",
              zIndex: 2,
              padding: "0 0 0 14px",
              margin: 0,
              overflowY: "auto",
            }}
          />
          {(!replyText && !replyFocused) && (
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 25,
                color: "#fff",
                opacity: 0.7,
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              Add your reply here
            </span>
          )}
        </div>
        {/* New rectangle 350x49, 25px below the 1285x193 rectangle, right-aligned with 25px from the right edge of the big rectangle */}
        {/* Calculate top: 24 + 53 + 11.5 + 46 + 12 + 193 + 25 */}
        {/* Calculate left: big rectangle left + big rectangle width - 25 - 350 */}
        {/* Big rectangle: left: 50%, width: 1340, transform: translateX(-50%) */}
        {/* So left = calc(50% + 670px - 25px - 350px) = calc(50% + 295px) */}
        <div
          style={{
            position: "absolute",
            top: 24 + 53 + 11.5 + 46 + 12 + 193 + 25,
            left: `calc(50% + 295px)`,
            width: 350,
            height: 49,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            Upload Reply Attachment
          </span>
        </div>
      </div>
      {/* Render selector dropdown at the end of the main return, above all rectangles */}
      {selectorOpen && selectorPosition && createPortal(
        <div
          id="selector-dropdown"
          style={{
            position: "absolute",
            top: selectorPosition.top,
            left: selectorPosition.left,
            width: selectorPosition.width,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 1000,
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
                setSelectedAction(option);
                setSelectorOpen(false);
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
        </div>,
        document.body
      )}
    </div>
  );
} 