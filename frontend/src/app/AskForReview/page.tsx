"use client";
import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

function AskForReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "Course";
  const period = searchParams.get("period") || "Exam Period";
  const courseID = searchParams.get("courseID") || "N/A";
  const instructorID = searchParams.get("instructorID") || "N/A";
  const fullName = searchParams.get("fullName") || "";
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitRequest = async () => {
    if (!requestMessage.trim()) {
      setError("Please enter a review request message");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Extract studentID from JWT token
      const decoded = jwtDecode<{ studentID?: number; student_id?: number }>(token);
      const studentID = decoded.studentID || decoded.student_id;
      
      if (!studentID) {
        throw new Error("Student ID not found in token");
      }

      console.log("📤 Submitting Review Request:");
      console.log("Course ID:", courseID);
      console.log("Instructor ID:", instructorID);
      console.log("Student ID:", studentID);
      console.log("Request Message:", requestMessage);

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseID: parseInt(courseID),
          studentID: studentID,
          instructorID: parseInt(instructorID),
          request_message: requestMessage.trim(),
          course_name: course,
          exam_period: period,
          FullName: fullName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to submit review request");
      }

      console.log("✅ Review request submitted successfully:", data);
      setIsSubmitted(true);

    } catch (err) {
      console.error("❌ Error submitting review request:", err);
      setError(err instanceof Error ? err.message : "Failed to submit review request");
    } finally {
      setIsLoading(false);
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

      {/* Large blurred rectangle centered below clearsky.svg */}
      <div
        style={{
          position: "absolute",
          top: 30 + 60 + 40 + 131 + 40, // nav top + nav height + spacing + clearsky height + 40px margin
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
          {/* Course and Exam Period text - match ViewMyGrade */}
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
            New Review Request - {course} ({period}) {fullName && `- ${fullName}`}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              position: "absolute",
              top: 25 + 53 + 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 1285,
              borderRadius: 20,
              background: "rgba(255,0,0,0.2)",
              border: "1px solid rgba(255,0,0,0.5)",
              padding: "15px",
              zIndex: 2,
            }}
          >
            <div style={{ color: "#fff", fontFamily: "var(--font-roboto)", fontSize: 18, textAlign: "center" }}>
              ❌ {error}
            </div>
          </div>
        )}

        {/* Success State */}
        {isSubmitted ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              width: 400,
              minHeight: 300,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#27ae60",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#27ae60"/>
                <path d="M18 34L28 44L46 26" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div
              style={{
                color: '#27ae60',
                fontWeight: 700,
                fontSize: 22,
                marginTop: 8,
                textAlign: 'center',
                fontFamily: 'var(--font-roboto)',
              }}
            >
              Review request was sent successfully
            </div>
          </div>
        ) : (
          /* Review request textarea */
          <textarea
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            style={{
              position: "absolute",
              top: 25 + 53 + 29.5 + (error ? 60 : 0), // Adjust position if error is shown
              left: '50%',
              transform: 'translateX(-50%)',
              width: 1285,
              height: 229,
              borderRadius: 42,
              background: "rgba(255,255,255,0.18)",
              zIndex: 2,
              color: '#fff',
              fontFamily: 'var(--font-roboto)',
              fontSize: 22,
              fontWeight: 400,
              padding: 32,
              outline: 'none',
              border: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
            placeholder="Write your review request here..."
          />
        )}

        {/* Submit Request button rectangle */}
        {!isSubmitted && (
          <div
            onClick={isLoading ? undefined : handleSubmitRequest}
            style={{
              position: "absolute",
              top: 25 + 53 + 29.5 + 229 + 25 + (error ? 60 : 0), // Adjust position if error is shown
              left: 24 + 1030, // left edge of big rect + 1060px
              width: 255,
              height: 45,
              borderRadius: 38,
              background: isLoading ? "rgba(200,200,200,0.35)" : "rgba(255,255,255,0.18)",
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                color: "#fff",
                width: '100%',
                textAlign: 'center',
              }}
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AskForReview() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <AskForReviewContent />
    </Suspense>
  );
}
