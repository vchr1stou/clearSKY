import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-8">Homepage</h1>
      <Link href="/login">
        <button className="px-8 py-3 bg-blue-500 text-white rounded-full text-lg font-bold shadow-md">Go to Login</button>
      </Link>
    </div>
  );
}
