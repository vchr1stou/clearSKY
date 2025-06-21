"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function AddUser() {
  const router = useRouter();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectorPosition, setSelectorPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const selectTypeRef = useRef<HTMLDivElement>(null);

  // Open selector and calculate position
  const handleSelectTypeClick = () => {
    if (selectTypeRef.current) {
      const rect = selectTypeRef.current.getBoundingClientRect();
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
        selectTypeRef.current &&
        !selectTypeRef.current.contains(event.target as Node) &&
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
      {/* Large blurred rectangle 50px below clearsky.svg */}
      <div
        style={{
          position: "absolute",
          top: 30 + 60 + 40 + 131 + 30, // nav top + nav height + spacing + clearsky height + 50px
          left: "50%",
          transform: "translateX(-50%)",
          width: 1340,
          height: 470,
          borderRadius: 46,
          background: "rgba(149,149,149,0.25)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.3px solid rgba(255, 255, 255, 0.77)",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        {/* Inner white rectangle with back button */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 25,
            width: 1290,
            height: 49,
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
            style={{ position: "absolute", marginTop:-1, left: 20, top: 14, width: 26, height: 25, display: "block", cursor: "pointer" }}
            onClick={() => router.push("/user_management")}
          />
          {/* Add User text */}
          <div
            style={{
              position: "absolute",
              left: 20 + 26 + 14, // 20px from left, 26px icon, 20px gap
              top: "55%",
              transform: "translateY(-50%)",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 23,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            Add User
          </div>
        </div>
        {/* Type: text */}
        <div
          style={{
            position: "absolute",
            top: 24 + 53 + 15, // top of inner rectangle + height + 25px
            left: 25,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Type:
        </div>
        {/* User Name: text */}
        <div
          style={{
            position: "absolute",
            top: 24 + 49 + 20 + 39 + 10, // top of inner rectangle + height + 20px + Type rectangle height + 10px
            left: 25,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          User Name:
        </div>
        {/* User Name input rectangle */}
        <div
          style={{
            position: "absolute",
            top: 24 + 49 + 20 + 39 + 10 + 25 + 10, // previous position + text height + 10px
            left: 25,
            width: 1290,
            height: 39,
            borderRadius: 100,
            background: "rgba(255,255,255,0.18)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Enter User Name"
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              paddingLeft: 20,
              paddingRight: 20,
              textAlign: "left",
              borderRadius: 100,
              boxSizing: "border-box",
            }}
            autoComplete="off"
          />
        </div>
        {/* Second User Name: text */}
        <div
          style={{
            position: "absolute",
            top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10, // previous position + input height + 10px
            left: 25,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Full Name:
        </div>
        {/* Second User Name input rectangle */}
        <div
          style={{
            position: "absolute",
            top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10, // previous position + text height + 10px
            left: 25,
            width: 1290,
            height: 39,
            borderRadius: 100,
            background: "rgba(255,255,255,0.18)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Enter Full Name"
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              paddingLeft: 20,
              paddingRight: 20,
              textAlign: "left",
              borderRadius: 100,
              boxSizing: "border-box",
            }}
            autoComplete="off"
          />
        </div>
        {/* Third User Name: text */}
        <div
          style={{
            position: "absolute",
            top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10, // previous position + input height + 10px
            left: 25,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          ID:
        </div>
        {/* Third User Name input rectangle */}
        <div
          style={{
            position: "absolute",
            top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10, // previous position + text height + 10px
            left: 25,
            width: 1290,
            height: 39,
            borderRadius: 100,
            background: "rgba(255,255,255,0.18)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter ID"
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              paddingLeft: 20,
              paddingRight: 20,
              textAlign: "left",
              borderRadius: 100,
              boxSizing: "border-box",
            }}
            autoComplete="off"
            maxLength={10}
            onChange={(e) => {
              // Only allow numbers
              const val = e.target.value.replace(/[^0-9]/g, "");
              e.target.value = val;
            }}
          />
        </div>
        {/* Add User button rectangle */}
        <div
          style={{
            position: "absolute",
            top: 24 + 49 + 20 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 39 + 10 + 25 + 10 + 49 + 10, // previous position + input height + 10px
            left: 25 + 50 + 30 + 1010 , // left of Type text + width of "Type:" + 30px + Type rectangle width - Add User rectangle width
            width: 200,
            height: 39,
            borderRadius: 100,
            background: "rgba(255,255,255,0.18)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            Add User
          </div>
        </div>
        {/* Type selection rectangle */}
        <div
          ref={selectTypeRef}
          onClick={handleSelectTypeClick}
          style={{
            position: "absolute",
            top: 24 + 49 + 22, // top of inner rectangle + height + 15px
            left: 25 + 50 + 30, // left of Type text + approximate width of "Type:" + 30px
            width: 230,
            height: 35,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
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
              whiteSpace: "nowrap",
            }}
          >
            {selectedType || "Select Type"}
            {!selectedType && (
              <span style={{ marginLeft: -1, marginTop:2, display: "flex", alignItems: "center" }}>
                <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5L11 9L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Render selector dropdown */}
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
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {["Student", "Institution Manager", "Instructor"].map((option, index) => (
            <div
              key={option}
              onClick={() => {
                setSelectedType(option);
                setSelectorOpen(false);
              }}
              style={{
                padding: "12px 20px",
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                color: "#fff",
                cursor: "pointer",
                borderBottom: index < 2 ? "0.3px solid rgba(255, 255, 255, 0.3)" : "none",
                transition: "background-color 0.2s",
              }}
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