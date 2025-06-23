"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type CourseData = {
  course_name: string;
  exam_period: string;
  grading_status: string;
  total_grade: number;
  question_grades: Record<string, number>;
};

function ViewMyGradeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "Course";
  const period = searchParams.get("period") || "Exam Period";
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch("/api/courses/myCourses", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Find the specific course and period
          const matchingCourse = data.find((c: CourseData) => 
            c.course_name === course && c.exam_period === period
          );
          
          if (matchingCourse) {
            setCourseData(matchingCourse);
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [course, period, router]);

  // Extract question grades from the data
  const questionGrades = courseData?.question_grades || {};
  const totalGrade = courseData?.total_grade ? Number(courseData.total_grade) : 0;
  
  // Get all question keys and filter to prioritize Q0i format over Qi format
  const allQuestionKeys = Object.keys(questionGrades);
  const q0iKeys = allQuestionKeys.filter(key => /^Q0\d+$/.test(key)).sort();
  const qiKeys = allQuestionKeys.filter(key => /^Q\d+$/.test(key) && !/^Q0\d+$/.test(key)).sort();
  
  // Use Q0i keys if available, otherwise fall back to Qi keys
  const questionKeys = q0iKeys.length > 0 ? q0iKeys : qiKeys;

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
        <div style={{ color: '#fff', fontSize: 24 }}>Loading...</div>
      </div>
    );
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
        {/* Top Navigation Bar Rectangle */}
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
        {/* Large blurred rectangle centered below clearsky.svg (no overlays) */}
        <div
          style={{
            position: "absolute",
            top: 70 + 60 + 40 + 131 + 40, // nav top + nav height + spacing + clearsky height + 40px
            left: "50%",
            transform: "translateX(-50%)",
            width: 700, // smaller width
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
          {/* Inner white rectangle */}
          <div
            style={{
              position: "absolute",
              top: 25,
              left: 25,
              width: 650, // smaller width
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
              {course} ({period})
            </div>
          </div>

          {/* My Grades rectangle */}
          <div
            style={{
              position: "absolute",
              top: 25 + 53 + 20, // move 20px up
              left: '50%',
              transform: 'translateX(-50%)',
              width: 610, // slightly bigger
              height: 315, // slightly bigger
              borderRadius: 42,
              background: "rgba(255,255,255,0.18)",
              zIndex: 2,
              overflow: "hidden", // Container for scrolling
            }}
          >
            {/* Scrollable content area */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflowY: "auto",
                paddingTop: 34, // Account for the title area
              }}
            >
              {/* My Grades text overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: 0,
                  width: "100%",
                  textAlign: "center",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  zIndex: 3,
                }}
              >
                My Grades
              </div>
              {/* Line below My Grades */}
              <div
                style={{
                  position: "absolute",
                  top: 34, // 7px (top) + 20px (font size) + 7px
                  left: (610 - 570) / 2, // center the line horizontally
                  width: 570, // 610px width minus 2*20px margin
                  height: 1,
                  background: "rgba(255,255,255,0.8)",
                  zIndex: 3,
                }}
              />
              {/* Additional lines below the first line */}
              {Array.from({ length: Math.max(4, questionKeys.length) }).map((_, i) => (
                <div
                  key={"grades-line-" + i}
                  style={{
                    position: "absolute",
                    top: 34 + 48 * (i + 1),
                    left: (610 - 570) / 2, // center the line horizontally
                    width: 570, // 610px width minus 2*20px margin
                    height: 1,
                    background: "rgba(255,255,255,0.8)",
                    zIndex: 3,
                  }}
                />
              ))}
              {/* Total grade row */}
              <React.Fragment>
                {/* Overlay rectangle for total */}
                <div
                  style={{
                    position: "absolute",
                    left: 600 - 67 - 15, // align to the right edge minus margin
                    top: 34 + 24,
                    width: 67,
                    height: 24,
                    background: "rgba(255,255,255,0.3)",
                    borderRadius: 12,
                    transform: "translateY(-50%)",
                    zIndex: 3,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      fontFamily: "var(--font-roboto)",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "rgba(255,255,255,1)",
                    }}
                  >
                    {totalGrade.toFixed(1)}
                  </span>
                </div>
                {/* Total label */}
                <div
                  style={{
                    position: "absolute",
                    left: 17,
                    top: 34 + 24,
                    transform: "translateY(-50%)",
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "rgba(255, 255, 255, 0.8)",
                    zIndex: 4,
                  }}
                >
                  Total:
                </div>
              </React.Fragment>
              {/* Question grades rows */}
              {questionKeys.map((questionKey, i) => (
                <React.Fragment key={"q-grade-" + i}>
                  {/* Overlay rectangle */}
                  <div
                    style={{
                      position: "absolute",
                      left: 600 - 67 - 15, // align to the right edge minus margin
                      top: 34 + 48 * (i + 1) + 24,
                      width: 67,
                      height: 24,
                      background: "rgba(255,255,255,0.3)",
                      borderRadius: 12,
                      transform: "translateY(-50%)",
                      zIndex: 3,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        fontFamily: "var(--font-roboto)",
                        fontWeight: 600,
                        fontSize: 15,
                        color: "rgba(255,255,255,1)",
                      }}
                    >
                      {Number(questionGrades[questionKey] || 0).toFixed(1)}
                    </span>
                  </div>
                  {/* Label */}
                  <div
                    style={{
                      position: "absolute",
                      left: 17,
                      top: 34 + 48 * (i + 1) + 24,
                      transform: "translateY(-50%)",
                      fontFamily: "var(--font-roboto)",
                      fontWeight: 700,
                      fontSize: 20,
                      color: "rgba(255, 255, 255, 0.8)",
                      zIndex: 4,
                    }}
                  >
                    {questionKey.toUpperCase()}:
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewMyGrade() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <ViewMyGradeContent />
    </Suspense>
  );
} 