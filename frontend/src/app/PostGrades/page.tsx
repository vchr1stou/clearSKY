"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

export default function PostGrades() {
  const router = useRouter();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectorPosition, setSelectorPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const selectPhaseRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New state for file upload and API response
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [apiResponse, setApiResponse] = useState<{
    course_name?: string;
    course_id?: string;
    exam_period?: string;
    grade_count?: number;
    temp_file?: string;
    parse_range?: number;
    format?: {
      isDetailed: boolean;
      hasWeights: boolean;
      questionCount: number;
      questionColumns: string[];
      weightColumns: string[];
    };
    validation?: {
      columns: string[];
      extraColumns: string[];
      totalRows: number;
      isValid: boolean;
    };
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Open selector and calculate position
  const handleSelectPhaseClick = () => {
    if (selectPhaseRef.current) {
      const rect = selectPhaseRef.current.getBoundingClientRect();
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
        selectPhaseRef.current &&
        !selectPhaseRef.current.contains(event.target as Node) &&
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

  // Handle file upload to API
  const uploadFileToAPI = async (file: File) => {
    try {
      setUploadStatus('uploading');
      setErrorMessage('');

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/grades/upload/preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setApiResponse(result.data);
        setUploadStatus('success');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setApiResponse(null);
    }
  };

  // Handle submit grades
  const handleSubmitGrades = async () => {
    try {
      if (!apiResponse || !apiResponse.temp_file) {
        setErrorMessage('No file has been uploaded successfully');
        return;
      }

      if (!selectedPhase) {
        setErrorMessage('Please select a grading phase');
        return;
      }

      setSubmitStatus('submitting');
      setErrorMessage('');

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/grades/upload/confirm', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          temp_file: apiResponse.temp_file,
          grading_status: selectedPhase
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        // Show success message
        alert(`Grades submitted successfully! Processed ${result.data.processed_count} grades.`);
        // Reset the form
        setUploadStatus('idle');
        setApiResponse(null);
        setSelectedPhase(null);
        setErrorMessage('');
        setSubmitStatus('idle');
      } else {
        throw new Error(result.error || 'Submit failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Submit failed');
    }
  };

  // Handle click to open file dialog
  const handleRectClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.name.endsWith('.xlsx')) {
        uploadFileToAPI(file);
      } else {
        setErrorMessage('Please upload an XLSX file');
        setUploadStatus('error');
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.name.endsWith('.xlsx')) {
        uploadFileToAPI(file);
      } else {
        setErrorMessage('Please upload an XLSX file');
        setUploadStatus('error');
      }
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
              onClick={() => router.push("/ReviewRequests")}
              style={{
                marginLeft: 18,
                fontSize: 23,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                cursor: "pointer",
              }}
              className="text-white transition-colors duration-200 hover:text-gray-300"
            >
              Review Requests
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
        {/* Rectangle 350x48.35, 25px under the bottom of the clearsky.svg */}
        <div
          ref={selectPhaseRef}
          style={{
            position: "absolute",
            top: 70 + 60 + 40 + 131 + 25,
            left: "49.94%",
            transform: "translateX(-50%)",
            width: 380,
            height: 45.35,
            borderRadius: 46,
            background: "rgba(149,149,149,0.25)",
            border: "1.4px solid rgba(255,255,255,0.3)",
            boxSizing: "border-box",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={handleSelectPhaseClick}
        >
          {selectedPhase ? (
            <span
              style={{
                width: '100%',
                textAlign: 'center',
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                color: "#fff",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              {selectedPhase}
            </span>
          ) : (
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 25,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              Select Grading Phase
              <span style={{ marginLeft: 0, marginTop:2, display: "flex", alignItems: "center" }}>
                <svg width="25" height="25" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5L11 9L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </span>
          )}
        </div>
        {/* Rectangle 548x347, 34.65px below the Select Grading Phase rectangle, 130px from the left edge */}
        <div
          style={{
            position: "absolute",
            top: 70 + 60 + 40 + 131 + 25 + 48.35 + 30.65,
            left: 130,
            width: 548,
            height: 300,
            borderRadius: 46,
            background: dragActive ? "rgba(149,149,149,0.35)" : "rgba(149,149,149,0.25)",
            border: dragActive ? "2.2px solid #0092FA" : "1.4px solid rgba(255,255,255,0.3)",
            boxSizing: "border-box",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            zIndex: 2,
            cursor: uploadStatus === 'uploading' ? 'wait' : 'pointer',
          }}
          onClick={uploadStatus !== 'uploading' ? handleRectClick : undefined}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          
          {/* Show checkmark when upload is successful */}
          {uploadStatus === 'success' && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "#4CAF50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 15,
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                File uploaded successfully
              </span>
            </div>
          )}

          {/* Show loading when uploading */}
          {uploadStatus === 'uploading' && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: "4px solid rgba(255,255,255,0.3)",
                  borderTop: "4px solid #fff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: 15,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 18,
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                Uploading...
              </span>
            </div>
          )}
        </div>
        {/* Second rectangle 548x347, 84px to the right of the first */}
        <div
          style={{
            position: "absolute",
            top: 70 + 60 + 40 + 131 + 25 + 48.35 + 30.65,
            left: 130 + 548 + 84,
            width: 548,
            height: 300,
            borderRadius: 46,
            background: "rgba(149,149,149,0.25)",
            border: "1.4px solid rgba(255,255,255,0.3)",
            boxSizing: "border-box",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            zIndex: 2,
          }}
        >
          {/* Show error message if upload failed */}
          {uploadStatus === 'error' && (
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
                background: "rgba(255, 0, 0, 0.1)",
                borderRadius: 20,
                border: "1px solid rgba(255, 0, 0, 0.3)",
                padding: 20,
                overflow: "auto",
                zIndex: 5,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 18,
                  color: "#ff6b6b",
                  display: "block",
                  marginBottom: 10,
                }}
              >
                Upload Error:
              </span>
              <span
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 400,
                  fontSize: 14,
                  color: "#fff",
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}
              >
                {errorMessage}
              </span>
            </div>
          )}

          {/* Show course info when upload is successful */}
          {uploadStatus === 'success' && apiResponse && (
            <>
          {/* Overlay text: Course: */}
          <span
            style={{
              position: "absolute",
              left: 34,
              top: 25,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 3,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            Course:
          </span>
          {/* Rectangle below Course: */}
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 25 + 25 + 7,
              width: 480,
              height: 39,
              borderRadius: 42,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 18,
                color: "#fff",
                marginLeft: 12,
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
                  {apiResponse.course_name || 'N/A'}
                </span>
              </div>
              {/* Period Title and Rectangle below Course */}
              <span
                style={{
                  position: "absolute",
                  left: 34,
                  top: 25 + 25 + 7 + 39 + 8,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 25,
                  color: "#fff",
                  zIndex: 3,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Period:
              </span>
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  top: 25 + 25 + 7 + 39 + 8 + 25 + 7,
                  width: 480,
                  height: 39,
                  borderRadius: 42,
                  background: "rgba(255,255,255,0.18)",
                  zIndex: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 18,
                    color: "#fff",
                    marginLeft: 12,
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  {apiResponse.exam_period || 'N/A'}
                </span>
              </div>
              {/* Number Of Grades Title and Rectangle below Period */}
              <span
                style={{
                  position: "absolute",
                  left: 34,
                  top: 25 + 25 + 7 + 39 + 8 + 25 + 7 + 39 + 8,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 25,
                  color: "#fff",
                  zIndex: 3,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Number Of Grades
              </span>
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  top: 25 + 25 + 7 + 39 + 8 + 25 + 7 + 39 + 8 + 25 + 7,
                  width: 480,
                  height: 39,
                  borderRadius: 42,
                  background: "rgba(255,255,255,0.18)",
                  zIndex: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 18,
                    color: "#fff",
                    marginLeft: 12,
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  {apiResponse.grade_count || 'N/A'}
                </span>
              </div>
            </>
          )}

          {/* Show default content when no upload has been made */}
          {uploadStatus === 'idle' && (
            <>
              {/* Overlay text: Course: */}
              <span
                style={{
                  position: "absolute",
                  left: 34,
                  top: 25,
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 25,
                  color: "#fff",
                  zIndex: 3,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Course:
              </span>
              {/* Rectangle below Course: */}
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  top: 25 + 25 + 7,
                  width: 480,
                  height: 39,
                  borderRadius: 42,
                  background: "rgba(255,255,255,0.18)",
                  zIndex: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-roboto)",
                    fontWeight: 600,
                    fontSize: 18,
                    color: "#fff",
                    marginLeft: 12,
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  {/* Blank - no text */}
            </span>
          </div>
          {/* Period Title and Rectangle below Course */}
          <span
            style={{
              position: "absolute",
              left: 34,
              top: 25 + 25 + 7 + 39 + 8,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 3,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            Period:
          </span>
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 25 + 25 + 7 + 39 + 8 + 25 + 7,
              width: 480,
              height: 39,
              borderRadius: 42,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 18,
                color: "#fff",
                marginLeft: 12,
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
              >
                {/* Blank - no text */}
            </span>
          </div>
          {/* Number Of Grades Title and Rectangle below Period */}
          <span
            style={{
              position: "absolute",
              left: 34,
              top: 25 + 25 + 7 + 39 + 8 + 25 + 7 + 39 + 8,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 3,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            Number Of Grades
          </span>
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 25 + 25 + 7 + 39 + 8 + 25 + 7 + 39 + 8 + 25 + 7,
              width: 480,
              height: 39,
              borderRadius: 42,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
                <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 18,
                    color: "#fff",
                    marginLeft: 12,
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    userSelect: "none",
              }}
                >
                  {/* Blank - no text */}
                </span>
          </div>
            </>
          )}
        </div>
        {/* Rectangle same as Select Grading Phase, centered, 35px below the bottom of the two rectangles */}
        <div
          style={{
            position: "absolute",
            top: 70 + 60 + 40 + 131 + 25 + 48.35 + 30.65 + 307 + 25,
            left: "50%",
            transform: "translateX(-50%)",
            width: 380,
            height: 45.35,
            borderRadius: 46,
            background: "rgba(149,149,149,0.25)",
            border: "1.4px solid rgba(255,255,255,0.3)",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            cursor: uploadStatus === 'success' && selectedPhase && submitStatus !== 'submitting' ? 'pointer' : 'default',
          }}
          onClick={uploadStatus === 'success' && selectedPhase && submitStatus !== 'submitting' ? handleSubmitGrades : undefined}
        >
          {/* Overlay: Select Submit Grades + checkmark */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: uploadStatus === 'success' && selectedPhase && submitStatus !== 'submitting' ? "#fff" : "rgba(255,255,255,0.5)",
              width: "100%",
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            {submitStatus === 'submitting' ? 'Submitting...' : 'Select Submit Grades'}
            <img
              src="/checkmark.svg"
              alt="Checkmark"
              style={{ marginLeft: 8, marginTop:-2, width: 19, height: 18, display: submitStatus === 'submitting' ? 'none' : 'inline-block' }}
            />
          </span>
        </div>
        {/* Upload icon centered, 65px down from the top of the first rectangle */}
        {uploadStatus !== 'success' && (
        <div
          style={{
            position: "absolute",
            top: 70 + 60 + 40 + 131 + 25 + 48.35 + 30.65 + 65,
            left: 130 + (548 - 95) / 2,
            width: 95,
            height: 83.43,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
          }}
        >
          <img
            src="/upload.svg"
            alt="Upload"
            width={132.66}
            height={116.51}
            style={{ display: "block" }}
          />
        </div>
        )}
        {/* Text below the upload icon */}
        {uploadStatus !== 'success' && (
        <div
          style={{
            position: "absolute",
            top: 70 + 60 + 40 + 131 + 25 + 48.35 + 30.65 + 65 + 83.43 + 15, // icon top + icon height + 20px
            left: 130,
            width: 548,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            Drag and drop or click here
          </span>
        </div>
        )}
        {/* Text below the drag and drop text */}
        {uploadStatus !== 'success' && (
        <div
          style={{
            position: "absolute",
            top: 70 + 60 + 40 + 131 + 25 + 48.35 + 30.65 + 65 + 83.43 + 15 + 30, // previous text top + previous text height (25)
            left: 130,
            width: 548,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 20,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            to upload your XLSX file
          </span>
        </div>
        )}
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
            {['Initial', 'Final'].map((option) => (
              <div
                key={option}
                onClick={() => {
                  setSelectedPhase(option);
                  setSelectorOpen(false);
                }}
                style={{
                  height: 48.35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 600,
                  fontSize: 22,
                  color: "#fff",
                  background: "rgba(255,255,255,0.18)",
                  cursor: "pointer",
                  borderBottom: option === 'Initial' ? "1px solid rgba(255,255,255,0.12)" : "none",
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
        {/* Table area intentionally left empty as requested */}
      </div>
    </div>
  );
} 