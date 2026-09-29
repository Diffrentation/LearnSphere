import React from "react";
import { FileDown, Eye } from "lucide-react";
import jsPDF from "jspdf";

export default function TestCard({ test }) {
  const { subject, chaptername, description, testpic, date, order } = test;

  // Convert image URL to Base64 for PDF
  const getBase64Image = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = (err) => reject(err);
    });
  };

  const createPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(subject || "No Subject", 10, 10);
    doc.setFontSize(14);
    doc.text(chaptername || "Untitled Chapter", 10, 20);
    doc.text(`Date: ${date || "Unknown"}`, 10, 30);
    doc.text(`Order: ${order || "-"}`, 10, 40);
    doc.text(description || "No description available", 10, 50);

    if (testpic) {
      try {
        const base64 = await getBase64Image(testpic);
        const imgProps = doc.getImageProperties(base64);
        const pdfWidth = 180;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(base64, "JPEG", 10, 60, pdfWidth, pdfHeight);
      } catch (err) {
        console.error("Image load error:", err);
      }
    }

    return doc;
  };

  const handleShowPDF = async () => {
    const doc = await createPDF();
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  };

  const handleDownloadPDF = async () => {
    const doc = await createPDF();
    doc.save(`${chaptername || "test"}.pdf`);
  };

  return (
    <div className="bg-white border border-cyan-200 shadow-md rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition duration-300 w-full max-w-md h-[440px]">
      {/* Image Section */}
      <div className="flex justify-center mb-4">
        {testpic ? (
          <img
            src={testpic}
            alt={chaptername}
            className="w-36 h-36 object-cover rounded-2xl border border-cyan-300 shadow-sm"
          />
        ) : (
          <div className="w-36 h-36 bg-cyan-100 text-cyan-600 flex items-center justify-center rounded-2xl border border-cyan-300 font-medium">
            No Image
          </div>
        )}
      </div>

      {/* Info and Buttons Section */}
      <div className="flex flex-col flex-1">
        <div className="text-left">
          <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
            {chaptername || "Untitled Test"}
          </h3>
          <p className="text-base text-gray-700 line-clamp-2 mb-2">
            {description || "No description available"}
          </p>
          <p className="text-l text-gray-600">
            <strong>Subject:</strong> {subject || "N/A"}
          </p>
          <p className="text-l text-gray-500 mt-1">
            <strong>Date:</strong> {date || "Unknown"}
          </p>
          <p className="text-l text-gray-500">
            <strong>Order:</strong> {order || "-"}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-end items-center gap-3 mt-auto pt-4">
          <button
            onClick={handleShowPDF}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition"
          >
            <Eye size={16} /> Show
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-cyan-700 text-white rounded-full hover:bg-cyan-800 transition"
          >
            <FileDown size={16} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}
