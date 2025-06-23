"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  email?: string;
  sub?: string;
  role?: string;
}

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Background image */}
      <Image
        src="/homepage.png"
        alt="Homepage background"
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        priority
      />
      {/* Centered scalable login container */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="flex flex-col items-center justify-center bg-white/10 rounded-2xl shadow-2xl px-8 py-12"
          style={{ minWidth: "340px", maxWidth: "90vw", width: "400px" }}
        >
          {/* Clearsky logo */}
          <Image
            src="/clearsky.svg"
            alt="Clearsky"
            width={220}
            height={72}
            priority
            className="mb-4"
          />
          {/* Subtitle */}
          <div className="font-bold text-xl text-white mb-8 text-center drop-shadow">
            Grades in Sight, Futures Bright!
          </div>
          {/* Login title */}
          <div className="font-bold text-3xl text-white mb-8 text-center drop-shadow">
            Login
          </div>
          {/* Email input */}
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full h-12 rounded-full bg-white/20 shadow-md font-bold text-white placeholder-white/80 pl-8 pr-4 mb-5 text-base outline-none border-none"
            style={{ fontSize: "1.1rem" }}
          />
          {/* Password input */}
          <div className="w-full h-12 rounded-full bg-white/20 shadow-md flex items-center mb-7 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full h-full bg-transparent border-none outline-none pl-8 pr-10 text-white font-bold rounded-full"
              style={{ fontSize: "1.1rem" }}
            />
            {/* Eye icon */}
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          {/* Continue button */}
          <button
            className="w-44 h-10 rounded-full bg-blue-500 text-white text-lg font-bold shadow-md mb-4 transition hover:bg-blue-600"
            onClick={async () => {
              setError("");
              try {
                const res = await fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password }),
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.token) {
                    localStorage.setItem("authToken", data.token);
                    // Decode JWT to get email and role
                    let decoded: JwtPayload;
                    try {
                      decoded = jwtDecode(data.token);
                    } catch {
                      setError("Invalid token");
                      return;
                    }
                    // Get role from decoded JWT and navigate accordingly
                    let roleParam = decoded.role;
                    if (roleParam === "STUDENT") roleParam = "Student";
                    else if (roleParam === "INSTRUCTOR") roleParam = "Instructor";
                    else if (roleParam === "INSTITUTION_REPRESENTATIVE" || roleParam === "INSTITUTION MANAGER") roleParam = "Institution Manager";
                    router.push(`/HomeScreen?role=${encodeURIComponent(roleParam || "Student")}`);
                    return;
                  }
                } else {
                  setError("Wrong email or password");
                }
              } catch {
                setError("Wrong email or password");
              }
            }}
          >
            Continue
          </button>
          {/* Error message */}
          {error && (
            <div className="w-full text-center text-red-400 font-bold text-base bg-black/40 rounded-lg py-2 px-4 mt-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
