"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      {/* Background image */}
      <Image
        src="/homepage.png"
        alt="Homepage background"
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        priority
      />

      {/* Clearsky image */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 111,
          zIndex: 1,
        }}
      >
        <Image
          src="/clearsky.svg"
          alt="Clearsky"
          width={300}
          height={97.5}
          priority
        />
      </div>

      {/* Grades in Sight, Futures Bright! text */}
      <div
        style={{
          position: "absolute",
          top: 377 + 80, // clearsky top + new clearsky height + margin
          left: 115,
          zIndex: 2,
        }}
        className="font-bold text-[30px] text-white"
      >
        Grades in Sight, Futures Bright!
      </div>

      {/* Login text */}
      <div
        style={{
          position: "absolute",
          top: 310,
          left: 111 + 400 + 350 + 30,
          zIndex: 2,
        }}
        className="font-bold text-[44px] text-white"
      >
        Login
      </div>

      {/* Username input */}
      <input
        type="text"
        placeholder="Enter your username"
        style={{
          position: "absolute",
          top: 391,
          left: 111 + 400 + 350 + 30,
          width: 356,
          height: 49,
          borderRadius: 55,
          background: "rgba(255,255,255,0.2)",
          zIndex: 2,
          paddingLeft: 32,
          fontSize: 18,
          color: "#FFFFFF",
          border: "none",
          outline: "none",
        }}
        className="shadow-md font-bold"
      />
      
      {/* Password input container */}
      <div
        style={{
          position: "absolute",
          top: 391 + 52 + 19,
          left: 111 + 400 + 350 + 30,
          width: 356,
          height: 49,
          borderRadius: 55,
          background: "rgba(255,255,255,0.2)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
        }}
        className="shadow-md"
      >
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            paddingLeft: 32,
            paddingRight: 60,
            fontSize: 18,
            color: "#FFFFFF",
            borderRadius: 55,
            fontWeight: "bold",
          }}
        />
        {/* Eye icon */}
        <div
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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

      {/* Button: Continue, same spacing below second input box */}
      <button
        style={{
          position: "absolute",
          top: 391 + 52 + 19 + 49 + 19, // second input top + height + spacing
          left: (111 + 400 + 350 + 30) + (356 / 2) - (180 / 2), // center under input boxes
          width: 180,
          height: 40,
          borderRadius: 55,
          background: "#0092FA",
          color: "#fff",
          fontSize: 18,
          fontWeight: 700,
          border: "none",
          outline: "none",
          zIndex: 2,
          cursor: "pointer",
        }}
        className="shadow-md font-bold"
        onClick={() => router.push("/HomeScreen")}
      >
        Continue
      </button>
    </div>
  );
}
