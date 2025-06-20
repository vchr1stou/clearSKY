"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ReviewRequests() {
  const router = useRouter();
  // In the future, fetch this from an API
  const reviewRequests = [
    { course: 'Physics', period: 'Spring 2025', student: 'John Appleseed' },
    { course: 'Mathematics', period: 'Fall 2024', student: 'Jane Doe' },
    { course: 'Chemistry', period: 'Spring 2024', student: 'Alice Smith' },
    { course: 'Biology', period: 'Fall 2023', student: 'Bob Johnson' },
    { course: 'Computer Science', period: 'Spring 2023', student: 'Charlie Brown' },
    { course: 'History', period: 'Fall 2022', student: 'Diana Prince' },
    { course: 'English', period: 'Spring 2022', student: 'Eve Adams' },
    { course: 'Art', period: 'Fall 2021', student: 'Frank Miller' },
    { course: 'Music', period: 'Spring 2021', student: 'Grace Hopper' },
    { course: 'Economics', period: 'Fall 2020', student: 'Henry Ford' },
    { course: 'Philosophy', period: 'Spring 2020', student: 'Ivy Lee' },
    { course: 'Geography', period: 'Fall 2019', student: 'Jack Black' },
  ];

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
          width: 900,
          height: 405,
          borderRadius: 46,
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
            top: 20,
            left: 30,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          Course Name
        </div>
        {/* Exam Period header */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 30 + 165 + 80, // 275px
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          Exam Period
        </div>
        {/* Student Name header */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 275 + 150 + 80, // 505px
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          Student Name
        </div>
        {/* Actions header */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 30,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 3,
            pointerEvents: "none",
            textAlign: "right",
          }}
        >
          Actions
        </div>
        <div
          style={{
            position: "absolute",
            top: 25 + 25 + 16, // 25 (top) + 25 (font size) + 16
            left: 30,
            width: 900 - 60,
            height: 1,
            background: "rgba(255,255,255,0.8)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
        {/* Line below Course Name */}
        <div
          style={{
            position: "absolute",
            top: 25 + 25 + 16, // 25 (top) + 25 (font size) + 16
            left: 30,
            right: 30,
            width: 'auto',
            height: 1,
            background: "rgba(255,255,255,0.8)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
        {/* Scrollable row content for courses and lines */}
        <div
          style={{
            position: "absolute",
            top: 25 + 25 + 16, // below the header line
            left: 0,
            width: 900,
            height: 57 * 5 + 1, // show 5 rows and the line under the fifth course
            overflowY: "auto",
          }}
        >
          {/* Horizontal lines as row separators, one more than the number of courses */}
          {Array.from({ length: reviewRequests.length + 1 }).map((_, i) => (
            <div
              key={"row-line-" + i}
              style={{
                position: "absolute",
                top: 57 * i,
                left: 30,
                right: 30,
                width: 'auto',
                height: 1,
                background: "rgba(255,255,255,0.8)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />
          ))}
          {/* 12 course names, vertically centered in each row */}
          {reviewRequests.map((row, i) => (
            <React.Fragment key={"review-row-" + i}>
              {/* Course Name */}
              <div
                style={{
                  position: "absolute",
                  top: 57 * i + 28.5,
                  left: 30,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  zIndex: 4,
                  transform: "translateY(-50%)",
                }}
              >
                {row.course}
              </div>
              {/* Exam Period */}
              <div
                style={{
                  position: "absolute",
                  top: 57 * i + 28.5,
                  left: 275,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  zIndex: 4,
                  transform: "translateY(-50%)",
                }}
              >
                {row.period}
              </div>
              {/* Student Name */}
              <div
                style={{
                  position: "absolute",
                  top: 57 * i + 28.5,
                  left: 505,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  zIndex: 4,
                  transform: "translateY(-50%)",
                }}
              >
                {row.student}
              </div>
              {/* Action Rectangle */}
              <div
                onClick={() => router.push(`/ReplyToReviewRequest?course=${encodeURIComponent(row.course)}&period=${encodeURIComponent(row.period)}&student=${encodeURIComponent(row.student)}`)}
                style={{
                  position: "absolute",
                  top: 57 * i + 28.5 - 16.5,
                  right: 30,
                  width: 90,
                  height: 33,
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.18)",
                  zIndex: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  cursor: "pointer",
                }}
              >
                <img
                  src="/reply.svg"
                  alt="Reply"
                  width={16}
                  height={16}
                  style={{
                    position: "absolute",
                    left: 15,
                    top: 9,
                    width: 15,
                    height: 15,
                    display: "block"
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 35,
                    top: 9,
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#fff",
                    lineHeight: "15px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Reply
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
} 