"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type Course = {
  course_name: string;
  exam_period: string;
  grading_status: string;
  courseID: number;
  instructorID: number;
};

type ReviewRequest = {
  requestID: number;
  courseID: number;
  studentID: number;
  instructorID: number;
  request_message: string;
  respond_message: string | null;
  course_name: string;
  exam_period: string;
  FullName: string;
  review_status: string;
  created_at: string;
  updated_at: string;
};

export default function MyCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [fullName, setFullName] = useState<string>("");
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    let role: string | undefined = undefined;
    let decodedFullName: string | undefined = undefined;
    let studentID: number | undefined = undefined;
    try {
      const decoded = jwtDecode<{ role?: string; FullName?: string; studentID?: number; student_id?: number }>(token);
      role = decoded.role;
      decodedFullName = decoded.FullName;
      studentID = decoded.studentID || decoded.student_id;
    } catch {
      return;
    }
    if (decodedFullName) setFullName(decodedFullName);
    if (role === "STUDENT") {
      fetch("/api/courses/myCourses", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          const data = await res.json();
          if (Array.isArray(data)) setCourses(data);
        })
        .catch(() => {});
      // Fetch review requests for this student
      if (studentID) {
        fetch(`/api/requests/student/${studentID}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
          .then(async (res) => {
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) setReviewRequests(data.data);
          })
          .catch(() => {});
      }
    }
  }, []);
  
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
        {/* Large blurred rectangle centered below clearsky.svg */}
        <div
          style={{
            position: "absolute",
            top: 70 + 60 + 40 + 131 + 40, // nav top + nav height + spacing + clearsky height + 40px
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
            {courses.length === 0 ? (
              <div style={{ color: '#fff', fontSize: 22, marginLeft: 30, marginTop: 30 }}>No courses found.</div>
            ) : (
              courses.map((row, i) => {
                // Normalize grading_status for display and logic
                const statusRaw = row.grading_status || '';
                const status = statusRaw.trim().toLowerCase() === 'closed' ? 'Closed' : 'Open';
                // Find review request for this course/period
                const reviewReq = reviewRequests.find(
                  (r) => r.course_name === row.course_name && r.exam_period === row.exam_period
                );
                const reviewStatus = reviewReq ? reviewReq.review_status : null;
                const isReviewStatusDisabled = !reviewStatus || reviewStatus === 'none';
                return (
                  <React.Fragment key={row.course_name + row.exam_period}>
                    <div
                      style={{
                        position: "absolute",
                        top: 57 * i + 57 / 2 - 10,
                        left: 30,
                        fontFamily: "var(--font-roboto)",
                        fontWeight: 600,
                        fontSize: 20,
                        color: "#fff",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    >
                      {row.course_name}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 57 * i + 57 / 2 - 10,
                        left: 270.67,
                        fontFamily: "var(--font-roboto)",
                        fontWeight: 600,
                        fontSize: 20,
                        color: "#fff",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    >
                      {row.exam_period}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 57 * i + 57 / 2 - 10,
                        left: 511.33,
                        fontFamily: "var(--font-roboto)",
                        fontWeight: 600,
                        fontSize: 20,
                        color: "#fff",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    >
                      {status}
                    </div>
                    {/* Actions column: View My Grades */}
                    <div
                      key={"action-rect-" + i}
                      onClick={() => router.push(`/ViewMyGrade?course=${encodeURIComponent(row.course_name)}&period=${encodeURIComponent(row.exam_period)}`)}
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
                    {/* Actions column: Ask For Review */}
                    <div
                      key={"action-rect-2-" + i}
                      onClick={status === 'Closed' ? undefined : () => {
                        let nameToPass = fullName;
                        if (!nameToPass) {
                          try {
                            const token = localStorage.getItem("authToken");
                            if (token) {
                              const decoded = jwtDecode<{ FullName?: string }>(token);
                              nameToPass = decoded.FullName || "";
                            }
                          } catch {}
                        }
                        router.push(`/AskForReview?course=${encodeURIComponent(row.course_name)}&period=${encodeURIComponent(row.exam_period)}&courseID=${row.courseID}&instructorID=${row.instructorID}&fullName=${encodeURIComponent(nameToPass)}`)
                      }}
                      style={{
                        position: "absolute",
                        top: 57 * i + 57 / 2 - 13.5,
                        left: 935,
                        width: 162,
                        height: 33,
                        borderRadius: 100,
                        background: status === 'Closed' ? "rgba(200,200,200,0.35)" : "rgba(255,255,255,0.18)",
                        zIndex: 3,
                        display: "flex",
                        alignItems: "center",
                        cursor: status === 'Closed' ? "not-allowed" : "pointer",
                        opacity: status === 'Closed' ? 0.5 : 1,
                      }}
                    >
                      <div style={{ position: "absolute", left: 16.5, top: "50%", transform: "translateY(-50%)" }}>
                        <img src="/ask_for_review.svg" alt="Ask For Review" width={15} height={18} style={{ width: 15, height: 18, display: "block", filter: status === 'Closed' ? 'grayscale(1)' : 'none' }} />
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
                          color: '#fff',
                          whiteSpace: "nowrap",
                        }}
                      >
                        Ask For Review
                      </div>
                    </div>
                    {/* Actions column: View Review Status */}
                    <div
                      key={"action-rect-3-" + i}
                      onClick={isReviewStatusDisabled ? undefined : () => router.push(`/ViewReviewStatus?course=${encodeURIComponent(row.course_name)}&period=${encodeURIComponent(row.exam_period)}&respond_message=${encodeURIComponent(reviewReq?.respond_message || "")}&review_status=${encodeURIComponent(reviewReq?.review_status || "")}`)}
                      style={{
                        position: "absolute",
                        top: 57 * i + 57 / 2 - 13.5,
                        left: 1118,
                        width: 192,
                        height: 33,
                        borderRadius: 100,
                        background: isReviewStatusDisabled ? "rgba(200,200,200,0.35)" : "rgba(255,255,255,0.18)",
                        zIndex: 3,
                        display: "flex",
                        alignItems: "center",
                        cursor: isReviewStatusDisabled ? "not-allowed" : "pointer",
                        opacity: isReviewStatusDisabled ? 0.5 : 1,
                      }}
                    >
                      <div style={{ position: "absolute", left: 16.5, top: "50%", transform: "translateY(-50%)" }}>
                        <img src="/view_review_status.svg" alt="View Review Status" width={15} height={18} style={{ width: 15, height: 18, display: "block", filter: isReviewStatusDisabled ? 'grayscale(1)' : 'none' }} />
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
                  </React.Fragment>
                );
              })
            )}
            {/* Row separators: one per course plus header */}
            {Array.from({ length: Math.max(1, courses.length) }).map((_, i) => (
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
      </div>
    </div>
  );
} 