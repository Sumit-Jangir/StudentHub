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
import { FaBars, FaCog, FaUser } from "react-icons/fa";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingStudentId, setEditingStudentId] = useState(null);
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

    // Ensure required fields are filled and valid
    const { studentId, fullName, class: studentClass, section, rollNumber, email, phone } = formData;
    if (!studentId || !fullName || !studentClass || !section || !rollNumber || !email || !phone) {
      alert("Please fill all required fields.");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      if (editingStudentId) {
        const studentDoc = doc(db, "students", editingStudentId);
        await updateDoc(studentDoc, formData);
      } else {
        await addDoc(studentsCollection, formData);
      }

      setFormData({});
      setEditingStudentId(null);
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Firestore Error:", error);
    }
  };


  // Delete Student
  const handleDelete = async (id) => {
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
    fetchStudents();
  };

  // Open Modal for Editing
  const handleEdit = (student) => {
    setFormData(student);
    setEditingStudentId(student.id);
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
        <h2 className="cursor-pointer" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><FaBars /></h2>
      </div>

      {/* Add Student Button */}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
        onClick={() => {
          setFormData({});
          setEditingStudentId(null);
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
              <th className="border border-gray-300 px-4 py-2">Roll Number</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
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
                <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                  <button
                    className="text-blue-500"
                    onClick={() => console.log("View student", student)}
                  >
                    <FiEye />
                  </button>
                  <button
                    className="text-green-500"
                    onClick={() => handleEdit(student)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(student.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute top-0 p-6 w-full flex items-center justify-center bg-black/20">
       <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingStudentId ? "Edit Student" : "Add Student"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {[
                  { name: "studentId", label: "Student ID", type: "text", required: true },
                  { name: "fullName", label: "Full Name", type: "text", required: true },
                  { name: "class", label: "Class", type: "text", required: true },
                  { name: "section", label: "Section", type: "text", required: true },
                  { name: "rollNumber", label: "Roll Number", type: "text", required: true },
                  { name: "dob", label: "Date of Birth", type: "date" },
                  { name: "address", label: "Address", type: "text" },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "phone", label: "Phone Number", type: "text", required: true },
                  { name: "parentName", label: "Parent's Name", type: "text" },
                  { name: "parentPhone", label: "Parent's Contact Number", type: "text" },
                  { name: "gender", label: "Gender", type: "radio", options: ["Male", "Female", "Other"] },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium">{field.label}</label>
                    {field.type === "radio" ? (
                      <div className="flex space-x-4">
                        {field.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="gender"
                              value={option}
                              checked={formData.gender === option}
                              onChange={handleInputChange}
                              className="form-radio"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
         </div>
      )}

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
              className="flex items-center text-red-500 space-x-2 hover:text-red-600" 
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Students;
