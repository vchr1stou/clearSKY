"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const courses = [
  { course: "Physics", period: "Spring 2025" },
  { course: "Mathematics", period: "Fall 2024" },
  { course: "Chemistry", period: "Spring 2024" },
  { course: "Biology", period: "Fall 2023" },
  { course: "Computer Science", period: "Spring 2023" },
  { course: "History", period: "Fall 2022" },
];

export default function MyCourses() {
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
        {/* Home and My Courses (left) */}
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
            style={{
              marginLeft: 18,
              color: "#0092FA",
              opacity: 0.7,
              fontSize: 23,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
            }}
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

      {/* Large blurred rectangle centered below clearsky.svg */}
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
        {/* Overlayed Course Name text */}
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 30,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Course Name
        </div>
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 270.67,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Exam Period
        </div>
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 511.33,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Grade Status
        </div>
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 752,
            fontFamily: "var(--font-roboto)",
            fontWeight: 600,
            fontSize: 25,
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Actions
        </div>
        <div
          style={{
            position: "absolute",
            top: 20.5 + 25 + 16, // header top + header height (approx) + 16px
            left: 30,
            width: 1280,
            height: 1,
            background: "rgba(255,255,255,0.8)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Scrollable row content */}
        <div
          style={{
            position: "absolute",
            top: 20.5 + 25 + 16, // below the header line
            left: 0,
            width: 1340,
            height: 450 - (20.5 + 25 + 16) - 20, // leave some padding at the bottom
            overflowY: "auto",
          }}
        >
          {courses.map((row, i) => (
            <div
              key={"course-" + i}
              style={{
                position: "absolute",
                top: 57 * i + 57 / 2 - 18.5,
                left: 30,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 25,
                color: "#fff",
                zIndex: 2,
                pointerEvents: "none",
              }}
            >
              {row.course}
            </div>
          ))}
          {courses.map((row, i) => (
            <div
              key={"period-" + i}
              style={{
                position: "absolute",
                top: 57 * i + 57 / 2 - 18.5,
                left: 270.67,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 25,
                color: "#fff",
                zIndex: 2,
                pointerEvents: "none",
              }}
            >
              {row.period}
            </div>
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={"open-" + i}
              style={{
                position: "absolute",
                top: 57 * i + 57 / 2 - 18.5,
                left: 511.33,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 25,
                color: "#fff",
                zIndex: 2,
                pointerEvents: "none",
              }}
            >
              Open
            </div>
          ))}
          {courses.map((row, i) => (
            <div
              key={"action-rect-" + i}
              onClick={() => router.push(`/ViewMyGrade?course=${encodeURIComponent(row.course)}&period=${encodeURIComponent(row.period)}`)}
              style={{
                position: "absolute",
                top: 57 * i + 57 / 2 - 13.5,
                left: 752,
                width: 162,
                height: 33,
                borderRadius: 100,
                background: "rgba(255,255,255,0.18)",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ position: "absolute", left: 16.5, top: "50%", transform: "translateY(-50%)" }}>
                <img src="/view_my_grades.svg" alt="View My Grades" width={15} height={18} style={{ width: 15, height: 18, display: "block" }} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 35.5, // 16.5 + 13 + 6
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                View My Grades
              </div>
            </div>
          ))}
          {courses.map((row, i) => (
            <div
              key={"action-rect-2-" + i}
              onClick={() => router.push(`/AskForReview?course=${encodeURIComponent(row.course)}&period=${encodeURIComponent(row.period)}`)}
              style={{
                position: "absolute",
                top: 57 * i + 57 / 2 - 13.5,
                left: 935,
                width: 162,
                height: 33,
                borderRadius: 100,
                background: "rgba(255,255,255,0.18)",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ position: "absolute", left: 16.5, top: "50%", transform: "translateY(-50%)" }}>
                <img src="/ask_for_review.svg" alt="Ask For Review" width={15} height={18} style={{ width: 15, height: 18, display: "block" }} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 35.5, // 16.5 + 13 + 6
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                Ask For Review
              </div>
            </div>
          ))}
          {courses.map((row, i) => (
            <div
              key={"action-rect-3-" + i}
              onClick={() => router.push(`/ViewReviewStatus?course=${encodeURIComponent(row.course)}&period=${encodeURIComponent(row.period)}`)}
              style={{
                position: "absolute",
                top: 57 * i + 57 / 2 - 13.5,
                left: 1118,
                width: 192,
                height: 33,
                borderRadius: 100,
                background: "rgba(255,255,255,0.18)",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ position: "absolute", left: 16.5, top: "50%", transform: "translateY(-50%)" }}>
                <img src="/view_review_status.svg" alt="View Review Status" width={15} height={18} style={{ width: 15, height: 18, display: "block" }} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 35.5, // 16.5 + 13 + 6
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                View Review Status
              </div>
            </div>
          ))}
          {/* 7 horizontal lines as row separators */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={"row-line-" + i}
              style={{
                position: "absolute",
                top: 20.5 + 25 + 16 + 57 * i,
                left: 30,
                width: 1280,
                height: 1,
                background: "rgba(255,255,255,0.8)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content will be added here */}
    </div>
  );
} 