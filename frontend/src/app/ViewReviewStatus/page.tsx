"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function ViewReviewStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "Course";
  const period = searchParams.get("period") || "Exam Period";
  const respond_message = searchParams.get("respond_message") || "";
  const review_status = searchParams.get("review_status") || "";

  // Determine color and label for status
  let statusColor = "rgba(255,255,255,0.18)";
  let statusLabel = "";
  if (review_status === "pending") {
    statusColor = "rgba(39, 174, 96, 0.35)"; // greenish
    statusLabel = "- Accepted";
  } else if (review_status === "finished") {
    statusColor = "rgba(231, 76, 60, 0.35)"; // reddish
    statusLabel = "- Rejected";
  }

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
        {/* Inner white rectangle with back button and course/period */}
        <div
          style={{
            position: "absolute",
            top: 25,
            left: 24,
            width: 1290,
            height: 53,
            borderRadius: 100,
            background: statusColor,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
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
          {/* Course and Exam Period text - match ViewMyGrade */}
          <div
            style={{
              marginLeft: 20 + 26 + 20, // 20px from left, 26px icon, 20px gap
              marginTop: 8,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff", // Always white
              whiteSpace: "nowrap",
            }}
          >
            Review Request Status - {course} ({period}) {statusLabel}
          </div>
        </div>
        {/* New rectangle for review request content */}
        <div
          style={{
            position: "absolute",
            top: 25 + 53 + 29.5, // 25 (header top) + 53 (header height) + 29.5
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1285,
            height: 300,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <div style={{
            color: '#fff',
            fontFamily: 'var(--font-roboto)',
            fontWeight: 600,
            fontSize: 22,
            width: '90%',
            textAlign: 'left',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            marginTop: 18,
            marginLeft: 32,
          }}>{respond_message || 'No response yet.'}</div>
        </div>
      </div>
    </div>
  );
}

export default function ViewReviewStatus() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <ViewReviewStatusContent />
    </Suspense>
  );
}
