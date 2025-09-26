"use client";

import { useState } from "react";

export default function ImportStudentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/import-students", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">📥 Import Data Siswa</h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block"
      />

      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Upload
      </button>

      {message && <p className="mt-4">{message}</p>}

      <div className="mt-6">
        <p className="font-semibold">📌 Format Excel yang benar:</p>
        <table className="border mt-2 text-sm">
          <thead>
            <tr>
              <th className="border px-2">name</th>
              <th className="border px-2">nis</th>
              <th className="border px-2">gradeLevelOrder</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2">Budi Santoso</td>
              <td className="border px-2">2025001</td>
              <td className="border px-2">7</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
