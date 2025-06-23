"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";

function ReplyToReviewRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "Course";
  const period = searchParams.get("period") || "Exam Period";
  const student = searchParams.get("student") || "Student Name";
  const requestID = searchParams.get("requestID");
  const request_message = searchParams.get("request_message") || "";
  console.log("[DEBUG] requestID:", requestID);

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectorPosition, setSelectorPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const selectActionRef = useRef<HTMLDivElement>(null);
  const [replyText, setReplyText] = useState("");
  const [replyFocused, setReplyFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

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

  const handleReply = async () => {
    setError(null);
    if (!selectedAction || !replyText.trim()) {
      setError("Please select an action and enter a reply.");
      return;
    }
    if (!requestID) {
      setError("No request ID found.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found.");
      return;
    }
    const review_status = selectedAction === "Accept" ? "pending" : "finished";
    try {
      const res = await fetch(`/api/requests/${requestID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          respond_message: replyText,
          review_status,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to reply to review request.");
      }
    } catch {
      setError("Failed to reply to review request.");
    }
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
        {/* Top Navigation Bar */}
        <div
          style={{
            position: "absolute",
            top: 70,
            left: "50%",
            transform: "translateX(-50%)",
            width: "95vw",
            maxWidth: 1340,
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
              onClick={() => router.push("/PostGrades")}
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
              onClick={() => router.push("/statistics_instructor")}
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
            top: 70 + 60 + 40, // header top + header height + spacing
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
            top: 341, // 40px below bottom of clearsky.svg
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
          {/* Only show selector, textarea, and reply button if not success */}
          {!success && (
            <>
              <div style={{
                position: "absolute",
                top: 24 + 53 + 11.5,
                left: 25,
                display: 'flex',
                flexDirection: 'row',
                gap: 16,
                zIndex: 3,
              }}>
                <div
                  ref={selectActionRef}
                  style={{
                    width: 200,
                    height: 46,
                    borderRadius: 42,
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 22,
                    color: "#fff",
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
                <div
                  style={{
                    width: 200,
                    height: 46,
                    borderRadius: 42,
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    userSelect: "none",
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 22,
                    color: "#fff",
                  }}
                  onClick={() => setShowMessageModal(true)}
                >
                  See Message
                </div>
              </div>
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
              <button
                style={{
                  position: "absolute",
                  top: 24 + 53 + 11.5 + 46 + 12 + 193 + 25,
                  left: "calc(50% + 670px - 25px - 150px)",
                  width: 150,
                  height: 36,
                  borderRadius: 42,
                  background: "rgba(255,255,255,0.18)",
                  zIndex: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  border: "none",
                  cursor: (!selectedAction || !replyText.trim()) ? "not-allowed" : "pointer",
                  opacity: (!selectedAction || !replyText.trim()) ? 0.5 : 1,
                }}
                onClick={handleReply}
                disabled={!selectedAction || !replyText.trim()}
              >
                Reply
              </button>
              {error && (
                <div style={{ color: '#f44', marginTop: 10, textAlign: 'center', fontWeight: 600 }}>{error}</div>
              )}
            </>
          )}
          {success && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              position: 'absolute',
              top: 170,
              left: 0,
              width: '100%',
              zIndex: 10,
            }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#27ae60"/>
                <path d="M18 34L28 44L46 26" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ color: '#27ae60', fontWeight: 700, fontSize: 20, marginTop: 18, textAlign: 'center' }}>
                Reply review request was successful
              </div>
            </div>
          )}
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
        {showMessageModal && createPortal(
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} onClick={() => setShowMessageModal(false)}>
            <div style={{
              background: 'rgba(128,128,128,0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '0.3px solid rgba(255, 255, 255, 0.77)',
              borderRadius: 32,
              padding: '48px 64px 40px 64px',
              minWidth: 700,
              maxWidth: 900,
              minHeight: 320,
              boxShadow: '0 2px 24px rgba(0,0,0,0.22)',
              color: '#fff',
              fontFamily: 'var(--font-roboto)',
              fontWeight: 600,
              fontSize: 20,
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }} onClick={e => e.stopPropagation()}>
              <div style={{ marginBottom: 22, fontWeight: 700, fontSize: 26, color: '#0092FA', letterSpacing: 0.5 }}>
                Review Request Message
              </div>
              <div style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 22,
                color: '#fff',
                marginBottom: 0,
                textAlign: 'left',
                maxWidth: 800,
                width: '100%',
                flex: 1,
              }}>{request_message}</div>
              <div style={{ height: 40 }} />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{
                  background: '#0092FA',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 18,
                  padding: '12px 48px',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  letterSpacing: 0.2,
                }} onClick={() => setShowMessageModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>, document.body
        )}
      </div>
    </div>
  );
}

export default function ReplyToReviewRequest() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <ReplyToReviewRequestContent />
    </Suspense>
  );
}
