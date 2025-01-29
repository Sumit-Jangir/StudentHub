// In Students.js
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import { app } from "../firebase";
import { FiEdit, FiTrash2, FiEye, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaBars } from "react-icons/fa";
import StudentDetails from "./StudentDetails";
import StudentForm from "./StudentForm"; // import the new form component
import toast from "react-hot-toast";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  const db = getFirestore(app);
  const studentsCollection = collection(db, "students");

  const navigate = useNavigate();
  const auth = getAuth(app);

  // Fetch students from Firestore
  const fetchStudents = async () => {
    const snapshot = await getDocs(studentsCollection);
    const studentList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(studentList);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form data change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Edit Student
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      fullName,
      class: studentClass,
      section,
      dob,
      address,
      fatherName,
      rollNumber,
      email,
      phone,
      parentPhone,
      gender,
      motherName,
    } = formData;

    if (
      !fullName ||
      !studentClass ||
      !section ||
      !dob ||
      !address ||
      !fatherName ||
      !rollNumber ||
      !email ||
      !phone ||
      !parentPhone ||
      !motherName ||
      !gender
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (!phonePattern.test(parentPhone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      if (formData.id) {
        const studentDoc = doc(db, "students", formData.id);
        await updateDoc(studentDoc, formData);
      } else {
        await addDoc(studentsCollection, formData);
      }

      setFormData({});
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Firestore Error:", error);
    }
  };

  const handleDelete = async (id) => {
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
    toast.success("Student deleted successfully!");
    fetchStudents();
  };

  const handleEdit = (student) => {
    setFormData(student);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Students</h1>
          <h2
            className="cursor-pointer text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars />
          </h2>
        </div>

        {/* Add Student Button */}
        <button
          className="bg-teal-700 text-white py-2 px-4 rounded hover:bg-teal-600 mb-4"
          onClick={() => {
            setFormData({});
            setIsModalOpen(true);
          }}
        >
          Add Student
        </button>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Class</th>
                <th className="border border-gray-300 px-4 py-2">Section</th>
                <th className="border border-gray-300 px-4 py-2">
                  Roll Number
                </th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">
                    {student.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.fullName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.class}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.section}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.rollNumber}
                  </td>
                  <td className="flex justify-evenly px-4 py-2">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="text-blue-500"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-green-500"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed z-50 inset-0 w-full flex  bg-transparent"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="absolute top-12 right-6 text-slate-300 min-w-36 bg-gray-200 rounded-lg p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleLogout}
              className="flex items-center text-red-500 text-xl space-x-2 hover:text-red-600"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      <StudentForm
        isModalOpen={isModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setIsModalOpen={setIsModalOpen}
      />

      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
};

export default Students;
