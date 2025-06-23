"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type ReviewRequestAPI = {
  course_name: string;
  exam_period: string;
  FullName: string;
  requestID: number;
  request_message: string;
  // add other fields if needed
};

export default function ReviewRequests() {
  const router = useRouter();
  const [reviewRequests, setReviewRequests] = useState<{ course: string; period: string; student: string; requestID: number; request_message: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }
      let instructorID: number | undefined = undefined;
      try {
        const decoded = jwtDecode<{ sub?: string | number; instructorID?: number; instructor_id?: number }>(token);
        // Debug: log the decoded token
        console.log('Decoded JWT:', decoded);
        // Prefer instructorID or instructor_id from the token, fallback to sub
        instructorID = decoded.instructorID || decoded.instructor_id;
        if (instructorID === undefined) {
          instructorID = decoded.sub ? Number(decoded.sub) : undefined;
        }
        console.log('Instructor ID:', instructorID, 'Type:', typeof instructorID);
      } catch {
        setError("Invalid token");
        setLoading(false);
        return;
      }
      if (!instructorID || isNaN(instructorID)) {
        setError(`No valid instructor ID found in token.`);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/requests/instructor/${instructorID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch review requests");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Map API data to expected row format
          setReviewRequests(
            data.data.map((req: ReviewRequestAPI) => ({
              course: req.course_name,
              period: req.exam_period,
              student: req.FullName,
              requestID: req.requestID,
              request_message: req.request_message,
            }))
          );
          console.log('[DEBUG] API data:', data.data);
          console.log('[DEBUG] reviewRequests state:', data.data.map((req: ReviewRequestAPI) => ({
            course: req.course_name,
            period: req.exam_period,
            student: req.FullName,
            requestID: req.requestID,
            request_message: req.request_message,
          })));
        } else {
          setReviewRequests([]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch review requests");
        } else {
          setError("Failed to fetch review requests");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Calculate the number of rows to display (at least 5)
  const minRows = 5;
  const numRows = Math.max(reviewRequests.length, minRows);

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 100 }}>{error}</div>;

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
        {/* Shift all content down to avoid cutting off navigation */}
        <div style={{ marginTop: 40 }}>
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
                onClick={() => router.push('/PostGrades')}
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
                onClick={() => router.push('/statistics_instructor')}
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
          {/* Centered rectangle below clearsky.svg */}
          <div
            style={{
              position: "absolute",
              top: 341, // 40px below bottom of clearsky.svg
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
                height: 405 - (25 + 25 + 16),
                overflowY: "auto",
              }}
            >
              {reviewRequests.length === 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#fff',
                  fontSize: 22,
                  fontFamily: 'var(--font-roboto)',
                  fontWeight: 600,
                  opacity: 0.7,
                }}>
                  No review requests found.
                </div>
              ) : (
                <>
                  {/* Render rows with data */}
                  {reviewRequests.map((row, i) => (
                    <React.Fragment key={"review-row-" + i}>
                      {/* Row separator line */}
                      <div
                        style={{
                          position: "absolute",
                          top: 57 * i,
                          left: 30,
                          right: 30,
                          height: 1,
                          background: "rgba(255,255,255,0.8)",
                          zIndex: 3,
                        }}
                      />
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
                        onClick={() => router.push(`/ReplyToReviewRequest?course=${encodeURIComponent(row.course)}&period=${encodeURIComponent(row.period)}&student=${encodeURIComponent(row.student)}&requestID=${row.requestID}&request_message=${encodeURIComponent(row.request_message)}`)}
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
                  {/* Final line at the bottom */}
                  <div
                    style={{
                      position: "absolute",
                      top: 57 * reviewRequests.length,
                      left: 30,
                      right: 30,
                      height: 1,
                      background: "rgba(255,255,255,0.8)",
                      zIndex: 3,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 