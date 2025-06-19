"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
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

      {/* Textbox 1 */}
      <input
        type="text"
        placeholder="Enter your credentials"
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
      {/* Textbox 2, same spacing below first */}
      <input
        type="text"
        placeholder="Enter your credentials"
        style={{
          position: "absolute",
          top: 391 + 52 + 19,
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
