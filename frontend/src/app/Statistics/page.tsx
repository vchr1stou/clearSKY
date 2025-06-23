"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { jwtDecode } from "jwt-decode";

interface Course {
  course_name: string;
  exam_period: string;
  course_id?: string;
  id?: string;
  _id?: string;
  [key: string]: unknown;
}

// Helper to extract grade distribution from courseStatsDebug
function getGradeDistribution(courseStatsDebug: Record<string, any> | null): number[] | null {
  console.log('getGradeDistribution input:', courseStatsDebug);
  
  if (!courseStatsDebug || typeof courseStatsDebug !== 'object') {
    console.log('courseStatsDebug is null or not an object');
    return null;
  }
  
  const obj = courseStatsDebug as Record<string, any>;
  console.log('Object keys:', Object.keys(obj));
  
  // Handle gradeDistribution as a JSON string
  if (typeof obj.gradeDistribution === 'string') {
    try {
      const parsed = JSON.parse(obj.gradeDistribution) as Record<string, number>;
      console.log('Parsed gradeDistribution string:', parsed);
      const arr = Array.from({ length: 11 }, (_, i) => parsed[String(i)] ?? 0);
      if (arr.length === 11 && arr.every((v) => typeof v === 'number')) {
        console.log('Returning parsed array:', arr);
        return arr;
      }
    } catch (e) {
      console.log('Failed to parse gradeDistribution string:', e);
    }
  }
  
  // Handle gradeDistribution as an object directly
  if (obj.gradeDistribution && typeof obj.gradeDistribution === 'object') {
    const gradeDist = obj.gradeDistribution as Record<string, number>;
    console.log('gradeDistribution object:', gradeDist);
    const arr = Array.from({ length: 11 }, (_, i) => gradeDist[String(i)] ?? 0);
    if (arr.length === 11 && arr.every((v) => typeof v === 'number')) {
      console.log('Returning gradeDistribution object array:', arr);
      return arr;
    }
  }
  
  if (Array.isArray(obj.distribution) && obj.distribution.every((v: unknown) => typeof v === 'number')) {
    console.log('Returning distribution array:', obj.distribution);
    return obj.distribution as number[];
  }
  
  if (Array.isArray(obj.grade_distribution) && obj.grade_distribution.every((v: unknown) => typeof v === 'number')) {
    console.log('Returning grade_distribution array:', obj.grade_distribution);
    return obj.grade_distribution as number[];
  }
  
  if (
    obj.data &&
    Array.isArray(obj.data) &&
    obj.data.length > 0 &&
    typeof obj.data[0] === 'object' &&
    obj.data[0] !== null &&
    Array.isArray((obj.data[0] as Record<string, unknown>).distribution) &&
    ((obj.data[0] as Record<string, unknown>).distribution as unknown[]).every((v) => typeof v === 'number')
  ) {
    console.log('Returning nested data[0].distribution:', (obj.data[0] as { distribution: number[] }).distribution);
    return (obj.data[0] as { distribution: number[] }).distribution;
  }
  
  if (
    obj.data &&
    Array.isArray(obj.data) &&
    obj.data.length > 0 &&
    typeof obj.data[0] === 'object' &&
    obj.data[0] !== null &&
    Array.isArray((obj.data[0] as Record<string, unknown>).grade_distribution) &&
    ((obj.data[0] as Record<string, unknown>).grade_distribution as unknown[]).every((v) => typeof v === 'number')
  ) {
    console.log('Returning nested data[0].grade_distribution:', (obj.data[0] as { grade_distribution: number[] }).grade_distribution);
    return (obj.data[0] as { grade_distribution: number[] }).grade_distribution;
  }
  
  console.log('No valid grade distribution found');
  return null;
}

export default function Statistics() {
  const router = useRouter();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectorPosition, setSelectorPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const [institutionID, setInstitutionID] = useState<string | number | undefined>(undefined);
  const [courseStatsDebug, setCourseStatsDebug] = useState<Record<string, any> | null>(null);
  const [barTooltip, setBarTooltip] = useState<{ index: number; count: number; x: number; y: number } | null>(null);
  const [passFailHovered, setPassFailHovered] = useState<'pass'|'fail'|null>(null);
  // Pie chart tooltip state (moved from inside render)
  const [pieTooltip, setPieTooltip] = useState<{ label: string; percent: number; x: number; y: number } | null>(null);
  
  // Open selector and calculate position
  const handleSelectorClick = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      // debug output removed
      return;
    }
    try {
      const decoded = jwtDecode<unknown>(token);
      let institutionID = undefined;
      if (typeof decoded === 'object' && decoded !== null) {
        if ('institutionID' in decoded && typeof (decoded as { institutionID?: unknown }).institutionID !== 'undefined') {
          institutionID = (decoded as { institutionID?: unknown }).institutionID;
        } else if ('payload' in decoded && typeof (decoded as { payload?: unknown }).payload === 'object' && (decoded as { payload?: unknown }).payload !== null && 'institutionID' in (decoded as { payload: { institutionID?: unknown } }).payload) {
          institutionID = ((decoded as { payload: { institutionID?: unknown } }).payload).institutionID;
        }
      }
      console.log('institutionID from payload:', institutionID);
    } catch (e) {
      console.log('Could not decode JWT for institutionID', e);
    }
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setSelectorPosition({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    fetch("/api/stats/myStats", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCourses(data);
          setSelectorOpen(true);
        }
      })
      .catch(() => {/* debug output removed */});
  };

  // Close selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
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

  const handleOptionSelect = async (course: Course) => {
    setSelectedOption(`${course.course_name} - ${course.exam_period}`);
    setSelectorOpen(false);

    // New API call
    const courseID = course.course_id || course.id || course._id;
    const examPeriod = encodeURIComponent(course.exam_period);
    if (!courseID || !institutionID || !examPeriod) {
      console.log('Missing courseID, institutionID, or examPeriod', { courseID, institutionID, examPeriod });
      return;
    }
    const url = `/api/stats/courseStats/${courseID}/${institutionID}/${examPeriod}`;
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log('courseStats API response:', data);
      setCourseStatsDebug(data); // Show in debug panel
      // You can set state here if you want to use the data
    } catch (err) {
      console.log('Error fetching courseStats:', err);
      setCourseStatsDebug({ error: String(err) });
    }
  };

  // Extract institutionID from JWT and update state
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setInstitutionID(undefined);
      return;
    }
    try {
      const decoded = jwtDecode<unknown>(token);
      let id = undefined;
      if (typeof decoded === 'object' && decoded !== null) {
        if ('institutionID' in decoded && typeof (decoded as { institutionID?: unknown }).institutionID !== 'undefined') {
          id = (decoded as { institutionID?: unknown }).institutionID;
        } else if ('payload' in decoded && typeof (decoded as { payload?: unknown }).payload === 'object' && (decoded as { payload?: unknown }).payload !== null && 'institutionID' in (decoded as { payload: { institutionID?: unknown } }).payload) {
          id = ((decoded as { payload: { institutionID?: unknown } }).payload).institutionID;
        }
      }
      setInstitutionID(typeof id === 'string' || typeof id === 'number' ? id : undefined);
    } catch {
      setInstitutionID(undefined);
    }
  }, []);

  // Calculate the total width: 549 (left) + 46 (gap) + 549 (right) = 1144
  // Center the group in a 1340px wide area (as used in the nav bar and selector)
  const totalRectWidth = 549 * 2 + 46;
  const containerWidth = 1340;
  const startLeft = (containerWidth - totalRectWidth) / 2 + 50; // 50 is the nav bar left offset

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
          {/* Home, My Courses, and Statistics (left) */}
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
              }}
              className="text-white transition-colors duration-200 hover:text-gray-300"
            >
              My Courses
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

        {/* Clearsky logo centered in the 85px space between nav bar and first rectangle */}
        <div
          style={{
            position: "absolute",
            top: 145, // nav bar bottom is at 170, this is the start of the 85px gap
            left: "50%",
            transform: "translateX(-50%)",
            height: 85,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <img
            src="/clearsky.svg"
            alt="Clearsky"
            style={{ maxHeight: 90, maxWidth: 400, width: "auto", height: "auto", display: "block" }}
          />
        </div>

        {/* New center rectangle, now 130px from the top (where clearsky.svg used to start) */}
        <div
          style={{
            position: "absolute",
            top: 170 + 85, // move 85px further down
            left: startLeft,
            width: 549 * 2 + 46, // span both rectangles
            height: 60,
            borderRadius: 100,
            background: "rgba(128,128,128,0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 2,
          }}
        >
          <div
            ref={selectRef}
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
              zIndex: 3,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={handleSelectorClick}
          >
            {selectedOption || "Select a course to view statistics"}
            <span style={{ marginLeft: 2, display: "flex", alignItems: "center" }}>
              <svg width="28" height="28" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 5L11 9L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
        {selectedOption && (
          <>
            <div
              style={{
                position: "absolute",
                top: 170 + 85 + 60 + 42 + 25, // 25px below the top of the left rectangle
                left: startLeft + 549 / 2 - 437 / 2, // center in the left rectangle
                width: 437,
                height: 34,
                borderRadius: 100,
                background: "rgba(255,255,255,0.18)",
                zIndex: 1001,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: 'visible',
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  textAlign: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                Grade Distribution
              </span>
              {/* Overlay bar graph */}
              {(() => {
                const dist = getGradeDistribution(courseStatsDebug);
                if (!Array.isArray(dist) || dist.length !== 11 || !dist.every((v) => typeof v === 'number')) return null;
                const max = Math.max(...dist, 1);
                return (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '100%', // directly below the Grade Distribution bar
                    marginTop: 35,
                    width: 437,
                    height: 260,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    padding: '0',
                    zIndex: 1200,
                    boxSizing: 'border-box',
                  }}>
                    {/* Y-axis */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 24,
                      width: 32,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}>
                      <span style={{ color: '#fff', fontSize: 15, opacity: 0.7, fontFamily: 'var(--font-roboto)', fontWeight: 500 }}>{max}</span>
                      {max > 1 && (
                        <span style={{ color: '#fff', fontSize: 15, opacity: 0.7, fontFamily: 'var(--font-roboto)', fontWeight: 500 }}>{Math.round(max / 2)}</span>
                      )}
                      <span style={{ color: '#fff', fontSize: 15, opacity: 0.7, fontFamily: 'var(--font-roboto)', fontWeight: 500 }}>0</span>
                    </div>
                    {/* Bars */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', width: '100%', position: 'relative', zIndex: 1 }}>
                      {dist.map((count, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, margin: '0 3px', position: 'relative' }}>
                          <div
                            style={{
                              width: 26,
                              height: `${Math.round((count / max) * 200)}px`,
                              background: '#0092FA',
                              borderRadius: 8,
                              marginBottom: 2,
                              transition: 'height 0.3s',
                              cursor: 'pointer',
                              position: 'relative',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                            }}
                            onMouseEnter={e => {
                              const rect = (e.target as HTMLElement).getBoundingClientRect();
                              setBarTooltip({ index: i, count, x: rect.left + rect.width / 2, y: rect.top });
                            }}
                            onMouseLeave={() => setBarTooltip(null)}
                          />
                          <span style={{ fontSize: 15, color: '#fff', opacity: 0.8, marginTop: 4 }}>{i}</span>
                        </div>
                      ))}
                      {/* Tooltip */}
                      {barTooltip && (
                        <div
                          style={{
                            position: 'fixed',
                            left: barTooltip.x,
                            top: barTooltip.y - 36,
                            transform: 'translate(-50%, -100%)',
                            background: '#222',
                            color: '#fff',
                            padding: '8px 18px',
                            borderRadius: 10,
                            fontSize: 17,
                            fontWeight: 600,
                            pointerEvents: 'none',
                            zIndex: 9999,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.22)'
                          }}
                        >
                          {`Count: ${barTooltip.count}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
            {/* Pass / Fail Rate rectangle only behind the title, like Grade Distribution */}
            <div
              style={{
                position: "absolute",
                top: 170 + 85 + 60 + 42 + 25, // 25px below the top of the right rectangle
                left: startLeft + 549 + 46 + 549 / 2 - 437 / 2, // center in the right rectangle
                width: 437,
                height: 34,
                borderRadius: 100,
                background: "rgba(255,255,255,0.18)",
                zIndex: 1001,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: 'visible',
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  textAlign: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                Pass / Fail Rate
              </span>
            </div>
            {/* Pie chart for pass/fail rate, below the rectangle */}
            <div
              style={{
                position: "absolute",
                top: 170 + 85 + 60 + 42 + 25 + 34 + 45, // below the rectangle, with 35px margin like Grade Distribution
                left: startLeft + 549 + 46 + (549 - 250) / 2, // center the 200px pie chart in the right rectangle
                width: 250,
                height: 250,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1001,
              }}
            >
              {(() => {
                let passRate = 0, failRate = 0;
                if (courseStatsDebug && typeof courseStatsDebug === 'object') {
                  const statsObj = courseStatsDebug as Record<string, unknown>;
                  if (typeof statsObj.passRate === 'number') passRate = statsObj.passRate;
                  else if (typeof statsObj.passRate === 'string') passRate = parseFloat(statsObj.passRate);
                  if (typeof statsObj.failRate === 'number') failRate = statsObj.failRate;
                  else if (typeof statsObj.failRate === 'string') failRate = parseFloat(statsObj.failRate);
                  // Sometimes nested in data[0]
                  if ((!passRate && !failRate) && Array.isArray(statsObj.data) && statsObj.data.length > 0 && typeof statsObj.data[0] === 'object') {
                    const nested = statsObj.data[0] as Record<string, unknown>;
                    if (typeof nested.passRate === 'number') passRate = nested.passRate;
                    else if (typeof nested.passRate === 'string') passRate = parseFloat(nested.passRate);
                    if (typeof nested.failRate === 'number') failRate = nested.failRate;
                    else if (typeof nested.failRate === 'string') failRate = parseFloat(nested.failRate);
                  }
                }
                if (passRate + failRate === 0) return <span style={{color:'#fff', opacity:0.7, fontSize:16, marginTop:12}}>No data</span>;
                // Pie chart math
                const total = passRate + failRate;
                const passPercent = passRate / total;
                const failPercent = failRate / total;
                const size = 250;
                const radius = size / 2 - 2; // leave 2px padding
                const center = size / 2;
                // Helper to describe an SVG arc (fixed for correct sweep and largeArcFlag)
                function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
                  const start = {
                    x: cx + r * Math.cos((startAngle - 90) * Math.PI / 180),
                    y: cy + r * Math.sin((startAngle - 90) * Math.PI / 180)
                  };
                  const end = {
                    x: cx + r * Math.cos((endAngle - 90) * Math.PI / 180),
                    y: cy + r * Math.sin((endAngle - 90) * Math.PI / 180)
                  };
                  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                  return [
                    `M ${cx} ${cy}`,
                    `L ${start.x} ${start.y}`,
                    `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
                    'Z'
                  ].join(' ');
                }
                // Angles for pass segment
                const passAngle = passPercent * 360;
                let passPath = null;
                let showFullGreen = false;
                if (passPercent === 1) {
                  showFullGreen = true;
                } else if (passPercent > 0) {
                  passPath = describeArc(center, center, radius, 0, passAngle);
                }
                // Handlers
                const handlePieMouseMove = (e: React.MouseEvent, label: string, percent: number) => {
                  setPieTooltip({ label, percent, x: e.clientX, y: e.clientY });
                };
                const handlePieMouseLeave = () => {
                  setPieTooltip(null);
                };
                return (
                  <div style={{position:'relative', width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <svg width={size} height={size}>
                      {/* Fail (background) segment - full filled circle */}
                      <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="#e74c3c"
                        style={{ cursor: 'pointer', filter: passFailHovered === 'fail' ? 'brightness(1.2)' : 'none' }}
                        onMouseEnter={() => setPassFailHovered('fail')}
                        onMouseMove={e => handlePieMouseMove(e, 'Fail', failPercent)}
                        onMouseLeave={() => { setPassFailHovered(null); handlePieMouseLeave(); }}
                      />
                      {/* Pass segment - filled arc or full circle if 100% */}
                      {showFullGreen && (
                        <circle
                          cx={center}
                          cy={center}
                          r={radius}
                          fill="#27ae60"
                          style={{ cursor: 'pointer', filter: passFailHovered === 'pass' ? 'brightness(1.2)' : 'none' }}
                          onMouseEnter={() => setPassFailHovered('pass')}
                          onMouseMove={e => handlePieMouseMove(e, 'Pass', passPercent)}
                          onMouseLeave={() => { setPassFailHovered(null); handlePieMouseLeave(); }}
                        />
                      )}
                      {passPath && passPercent > 0 && passPercent < 1 && (
                        <path
                          d={passPath}
                          fill="#27ae60"
                          style={{ cursor: 'pointer', filter: passFailHovered === 'pass' ? 'brightness(1.2)' : 'none' }}
                          onMouseEnter={() => setPassFailHovered('pass')}
                          onMouseMove={e => handlePieMouseMove(e, 'Pass', passPercent)}
                          onMouseLeave={() => { setPassFailHovered(null); handlePieMouseLeave(); }}
                        />
                      )}
                    </svg>
                    {/* Tooltip for pie chart */}
                    {pieTooltip && (
                      <div
                        style={{
                          position: 'fixed',
                          left: pieTooltip.x + 12,
                          top: pieTooltip.y - 12,
                          background: '#222',
                          color: '#fff',
                          padding: '8px 18px',
                          borderRadius: 10,
                          fontSize: 17,
                          fontWeight: 600,
                          pointerEvents: 'none',
                          zIndex: 9999,
                          boxShadow: '0 2px 12px rgba(0,0,0,0.22)'
                        }}
                      >
                        {pieTooltip.label}: {Math.round(pieTooltip.percent * 100)}%
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </>
        )}
        {/* Left rectangle, now centered as a pair */}
        <div
          style={{
            position: "absolute",
            top: 170 + 85 + 60 + 42,
            left: startLeft,
            width: 549,
            height: 433,
            borderRadius: 46,
            background: "rgba(128,128,128,0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 2,
          }}
        />
        {/* Right rectangle, now centered as a pair */}
        <div
          style={{
            position: "absolute",
            top: 170 + 85 + 60 + 42,
            left: startLeft + 549 + 46,
            width: 549,
            height: 433,
            borderRadius: 46,
            background: "rgba(128,128,128,0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 2,
          }}
        />
      </div>

      {/* Selector dropdown rendered at top level */}
      {selectorOpen && selectorPosition && createPortal(
        <div
          id="selector-dropdown"
          style={{
            position: "absolute",
            top: selectorPosition.top,
            left: selectorPosition.left + (selectorPosition.width / 2) - 210, // 210 = 420/2
            width: 420,
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
          {courses.length === 0 ? (
            <div style={{ color: '#fff', padding: '12px 20px', fontFamily: 'var(--font-roboto)', fontWeight: 600, fontSize: 20, textAlign: 'center' }}>No courses found.</div>
          ) : (
            courses.map((course, idx) => (
              <div
                key={course.course_name + course.exam_period + idx}
                onClick={() => handleOptionSelect(course)}
                style={{
                  padding: "12px 20px",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  cursor: "pointer",
                  borderBottom: idx < courses.length - 1 ? "0.3px solid rgba(255, 255, 255, 0.3)" : "none",
                  transition: "background-color 0.2s",
                  textAlign: 'center',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              >
                {course.course_name} - {course.exam_period}
              </div>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
} 