"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function UniMoreInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const universityName = searchParams.get("university") || "University Information";

  const institutions = [
    { name: "Athens University of Economics and Business", location: "Patision 76, Athens", id: "1000000001", type: "University", website: "http://www.aueb.gr", phone: "+30 210 8203 303 / +30 210 8203 308", email: "webmaster@aueb.gr" },
    { name: "Aristotle University of Thessaloniki", location: "Egnatia 159, Thessaloniki", id: "1000000002", type: "University", website: "https://auth.gr/en", phone: "+30 2310 996000", email: "support-web@auth.gr" },
    { name: "University of West Attica", location: "Ag. Spyridonos, Egaleo", id: "1000000003", type: "University", website: "https://www.uniwa.gr/en", phone: "+30 210 5385100", email: "esnwestattica@gmail.com" },
    { name: "Agricultural University of Athens", location: "Iera Odos 75, Athens", id: "1000000004", type: "University", website: "http://www.aua.gr", phone: "+30 210 5294841", email: "protocol@aua.gr" },
    { name: "Athens School of Fine Arts", location: "256 Peiraios Ave, Agios Ioannis Rentis", id: "1000000005", type: "University", website: "https://www.asfa.gr/en", phone: "+30 210 3816930", email: "support@asfa.gr" },
    { name: "Democritus University of Thrace", location: "University Campus, Komotini", id: "1000000006", type: "University", website: "https://www.duth.gr", phone: "+30 25310 39010", email: "protocol@duth.gr" },
    { name: "Harokopio University of Athens", location: "El. Venizelou Ave. 70, Kallithea", id: "1000000007", type: "University", website: "https://www.hua.gr/en", phone: "+30 210 9549100", email: "geosec@hua.gr" },
    { name: "Hellenic Mediterrenean University", location: "Stauromenos, Heraklion", id: "1000000008", type: "University", website: "https://hmu.gr/en", phone: "+30 2810 379200", email: "info@hmu.gr" },
    { name: "University of Ioannina", location: "University Campus, Ioannina", id: "1000000009", type: "University", website: "https://www.uoi.gr/en", phone: "+30 26510 07105", email: "igeronimaki@uoi.gr" },
    { name: "Ionian University", location: "72, Ioannou Theotoki str, Corfu", id: "1000000010", type: "University", website: "https://ionio.gr/en", phone: "+30 26610 87622", email: "dioikitiko@ionio.gr" },
    { name: "University of Macedonia", location: "156 Egnatia str, Thessaloniki", id: "1000000011", type: "University", website: "https://www.uom.gr/en", phone: "+30 2310 891101", email: "pubrel@uom.edu.gr" },
    { name: "University of Patras", location: "University Campus, Rion", id: "1000000012", type: "University", website: "https://www.upatras.gr/en", phone: "+30 2610 996683", email: "rectorate@upatras.gr" },
    { name: "University of Piraeus", location: "80, M. Karaoli & A. Dimitriou St, Piraeus", id: "1000000013", type: "University", website: "https://www.unipi.gr", phone: "+30 210 4142000", email: "info@unipi.gr" },
    { name: "Panteion University of Social and Political Sciences", location: "136, Syngrou Avenue, Athens", id: "1000000014", type: "University", website: "https://www.panteion.gr/en", phone: "+30 210 9201041", email: "koinpol@panteion.gr" },
    { name: "University of Thessaly", location: "Argonafton & Filellinon, Volos", id: "1000000015", type: "University", website: "https://www.uth.gr/en", phone: "+30 2410 685701", email: "info@uth.gr" },
    { name: "University of Western Macedonia", location: "Active Urban Planning Zone, Kozani", id: "1000000016", type: "University", website: "https://www.uowm.gr/en", phone: "+30 24610 56200", email: "info@uowm.gr" },
    { name: "University of the Peloponnese", location: "Tripoli", id: "1000000017", type: "University", website: "https://www.uop.gr/en", phone: "+30 2710 230000", email: "sourla@uop.gr" },
    { name: "University of the Aegean", location: "Mytilene", id: "1000000018", type: "University", website: "https://www.aegean.gr", phone: "N/A", email: "info@aegean.gr" },
    { name: "National and Kapodistrian University of Athens", location: "Panepistimiopolis, Zografou", id: "1000000019", type: "University", website: "https://en.uoa.gr", phone: "+30 210 7277000", email: "info@uoa.gr" },
    { name: "National Technical University of Athens", location: "Zografou Campus, Athens", id: "1000000020", type: "University", website: "https://www.ntua.gr/en", phone: "+30 210 7722241", email: "directory@ntua.gr" },
    { name: "Technical University of Crete", location: "Kounoupidiana, Chania", id: "1000000021", type: "University", website: "https://www.tuc.gr", phone: "+30 28210 37000", email: "info@tuc.gr" },
    { name: "Hellenic Open University", location: "Parodos Aristotelous 18, Patra", id: "1000000022", type: "University", website: "https://www.eap.gr/en", phone: "+30 2610 367000", email: "info@eap.gr" },
    { name: "International Hellenic University", location: "Thessaloniki", id: "1000000023", type: "University", website: "https://www.ihu.gr/en", phone: "+30 2310 807000", email: "info@ihu.gr" },
    { name: "School of Pedagogical and Technological Education", location: "Marousi, Athens", id: "1000000024", type: "University", website: "https://www.aspete.gr", phone: "+30 210 2896700", email: "info@aspete.gr" },
  ];

  // Find the university data based on the name
  const university = institutions.find(inst => inst.name === universityName);

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
          {/* Home and Institutions (left) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={() => router.push("/HomeScreen?role=Institution Manager")}
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
              Institutions
            </div>
            <div
              onClick={() => router.push("/user_management")}
              style={{
                marginLeft: 18,
                fontSize: 23,
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                cursor: "pointer",
              }}
              className="text-white transition-colors duration-200 hover:text-gray-300"
            >
              User Management
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
            top: 70 + 60 + 20, // header top + header height + reduced spacing
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
            top: 70 + 60 + 20 + 131 + 40, // moved up by reducing spacing
            left: "50%",
            transform: "translateX(-50%)",
            width: 1340,
            height: 450,
            borderRadius: 46,
            background: "rgba(149,149,149,0.25)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.3px solid rgba(255, 255, 255, 0.77)",
            boxSizing: "border-box",
            zIndex: 1,
          }}
        >
          {/* Inner white rectangle with back button and course/period info */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 25,
              width: 1290,
              height: 53,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
            }}
          >
            <img
              src="/back.svg"
              alt="Back"
              width={26}
              height={25}
              style={{ position: "absolute", left: 20, top: 14, width: 26, height: 25, display: "block", cursor: "pointer" }}
              onClick={() => router.back()}
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
              {universityName}
            </div>
          </div>
          {/* Email text positioned 15px down from the bottom of the rectangular overlay */}
          <div
            style={{
              position: "absolute",
              top: 24 + 53 + 15, // bottom of rectangular overlay + 15px spacing
              left: 25,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 3,
            }}
          >
            Email:
          </div>
          {/* Email rectangular positioned 10px under the Email text */}
          <div
            style={{
              position: "absolute",
              top: 24 + 53 + 15 + 25 + 10, // bottom of rectangular overlay + 15px + email text height + 10px spacing
              left: 25,
              width: 1290,
              height: 53,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                color: "#fff",
              }}
            >
              {university?.email || "Email not available"}
            </span>
          </div>
          {/* Website text positioned 15px down from the bottom of the email rectangular */}
          <div
            style={{
              position: "absolute",
              top: 24 + 53 + 15 + 25 + 10 + 53 + 15, // bottom of email rectangular + 15px spacing
              left: 25,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 3,
            }}
          >
            Website:
          </div>
          {/* Website rectangular positioned 10px under the Website text */}
          <div
            style={{
              position: "absolute",
              top: 24 + 53 + 15 + 25 + 10 + 53 + 15 + 25 + 10, // bottom of email rectangular + 15px + website text height + 10px spacing
              left: 25,
              width: 1290,
              height: 53,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                color: "#fff",
              }}
            >
              {university?.website || "Website not available"}
            </span>
          </div>
          {/* Telephone Number text positioned 15px down from the bottom of the website rectangular */}
          <div
            style={{
              position: "absolute",
              top: 24 + 53 + 15 + 25 + 10 + 53 + 15 + 25 + 10 + 53 + 15, // bottom of website rectangular + 15px spacing
              left: 25,
              fontFamily: "var(--font-roboto)",
              fontWeight: 600,
              fontSize: 25,
              color: "#fff",
              zIndex: 3,
            }}
          >
            Telephone Number:
          </div>
          {/* Telephone Number rectangular positioned 10px under the Telephone Number text */}
          <div
            style={{
              position: "absolute",
              top: 24 + 53 + 15 + 25 + 10 + 53 + 15 + 25 + 10 + 53 + 15 + 25 + 10, // bottom of website rectangular + 15px + telephone text height + 10px spacing
              left: 25,
              width: 1290,
              height: 53,
              borderRadius: 100,
              background: "rgba(255,255,255,0.18)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 600,
                fontSize: 20,
                color: "#fff",
              }}
            >
              {university?.phone || "Phone not available"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UniMoreInfo() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <UniMoreInfoContent />
    </Suspense>
  );
} 