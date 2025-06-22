"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type CourseData = {
  course_name: string;
  exam_period: string;
  grading_status: string;
  total_grade: number;
  question_grades: Record<string, number>;
};

export default function ViewMyGrade() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "Course";
  const period = searchParams.get("period") || "Exam Period";
  const [selectedQ, setSelectedQ] = useState("Q1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

        const response = await fetch("http://localhost:3002/api/courses/myCourses", {
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
  
  // Generate question labels for dropdown
  const questionLabels = questionKeys.map(key => key.toUpperCase());

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

      {/* Large blurred rectangle centered below clearsky.svg (no overlays) */}
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
        {/* Inner white rectangle */}
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
            top: 25 + 53 + 36, // 25px (top of back rect) + 53px (height of back rect) + 36px
            left: 25,
            width: 373,
            height: 295,
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
                left: 15,
                width: 344.01,
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
                  left: 15,
                  width: 344.01,
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
                  left: 291,
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
                  left: 15,
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
                    left: 291,
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
                    left: 15,
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
        {/* Second large rectangle, 85px to the right of the first */}
        <div
          style={{
            position: "absolute",
            top: 25 + 53 + 36,
            left: 25 + 373 + 85,
            width: 373,
            height: 295,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 2,
          }}
        >
          {/* Title: {course} - {period} - Total */}
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
            {course} - Total
          </div>
          {/* Line below title */}
          <div
            style={{
              position: "absolute",
              top: 34, // 7px (top) + 20px (font size) + 7px
              left: 15,
              width: 344.01,
              height: 1,
              background: "rgba(255,255,255,0.8)",
              zIndex: 3,
            }}
          />
        </div>
        {/* Third large rectangle, 85px to the right of the second */}
        <div
          style={{
            position: "absolute",
            top: 25 + 53 + 36,
            left: 25 + 373 + 85 + 373 + 85,
            width: 373,
            height: 295,
            borderRadius: 42,
            background: "rgba(255,255,255,0.18)",
            zIndex: 2,
            overflow: "hidden", // Make it scrollable if needed
          }}
        >
          {/* Title: {course} - {period} - Q1 with chevron */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 0,
              width: "100%",
              height: 28, // covers the title bar
              textAlign: "center",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              color: "#fff",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              pointerEvents: "auto",
              transition: "background 0.2s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '';
            }}
          >
            <span 
              onClick={() => setDropdownOpen((open) => !open)}
              style={{ cursor: "pointer" }}
            >
              {course} - {selectedQ}
            </span>
            <span
              className="chevron-dropdown"
              style={{
                marginLeft: 1,
                display: "flex",
                alignItems: "center",
                userSelect: "none",
                cursor: "pointer",
                zIndex: 21,
                pointerEvents: "auto",
              }}
              onClick={e => {
                e.stopPropagation();
                setDropdownOpen((open) => !open);
              }}
            >
              {/* Right chevron SVG */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 5L11 9L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {/* Dropdown */}
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 35,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.85)",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 30,
                  minWidth: 90,
                  padding: "6px 0",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {questionLabels.map((q) => (
                  <div
                    key={q}
                    onClick={() => {
                      setSelectedQ(q);
                      setDropdownOpen(false);
                    }}
                    style={{
                      padding: "6px 18px",
                      color: "#fff",
                      fontFamily: "var(--font-roboto)",
                      fontWeight: 500,
                      fontSize: 17,
                      cursor: "pointer",
                      background: selectedQ === q ? "rgba(255,255,255,0.12)" : "none",
                      borderRadius: 6,
                      transition: "background 0.2s",
                    }}
                    onMouseDown={e => e.preventDefault()}
                  >
                    {q}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Line below title */}
          <div
            style={{
              position: "absolute",
              top: 34, // 7px (top) + 20px (font size) + 7px
              left: 15,
              width: 344.01,
              height: 1,
              background: "rgba(255,255,255,0.8)",
              zIndex: 3,
            }}
          />
        </div>
      </div>
    </div>
  );
} 