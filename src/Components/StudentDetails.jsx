import React from "react";
import { FiX } from "react-icons/fi";

const StudentDetails = ({ student, onClose }) => {
  if (!student) return null; // If no student is selected, don't render

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Student Details</h2>
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <p><strong>ID:</strong> {student.id}</p>
          <p><strong>Name:</strong> {student.fullName}</p>
          <p><strong>Class:</strong> {student.class}</p>
          <p><strong>Section:</strong> {student.section}</p>
          <p><strong>Roll Number:</strong> {student.rollNumber}</p>
          <p><strong>Date of Birth:</strong> {student.dob || "N/A"}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>Father's Name:</strong> {student.fatherName || "N/A"}</p>
          <p><strong>Mother's Name:</strong> {student.motherName || "N/A"}</p>
          <p><strong>Parent's Contact:</strong> {student.parentPhone || "N/A"}</p>
          <p><strong>Gender:</strong> {student.gender || "N/A"}</p>
        </div>

        <button
          className="mt-4 w-full bg-teal-700 text-white py-2 rounded hover:bg-teal-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StudentDetails;
