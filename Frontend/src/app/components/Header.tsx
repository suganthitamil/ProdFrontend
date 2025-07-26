'use client';

import Link from "next/link";

export default function Header() {
  const downloadReport = async () => {
    try {
      const response = await fetch("http://34.102.80.30:4000/api/statistics/download", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download report.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download the report.");
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md rounded-b-lg transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center px-6 py-5">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3 font-bold text-2xl text-white tracking-wide">
            <span>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="url(#paint0_linear)" />
                <path d="M10 20C10 15 22 15 22 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="13" cy="14" r="2" fill="white"/>
                <circle cx="19" cy="14" r="2" fill="white"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" />
                    <stop offset="1" stopColor="#A21CAF" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span>NovaMart</span>
          </Link>
          <nav className="space-x-6">
            <Link href="/" className="text-white text-lg font-medium hover:underline transition-all">Home</Link>
            <Link href="/products.html" className="text-white text-lg font-medium hover:underline transition-all">Products</Link>
          </nav>
        </div>

        {/* Download Report Button */}
        <button
          onClick={downloadReport}
          className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded hover:bg-indigo-50 transition-all"
        >
          Download Report
        </button>
      </div>
    </header>
  );
}
