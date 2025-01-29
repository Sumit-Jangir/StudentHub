// StudentForm.js
import React from "react";

const StudentForm = ({
  isModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  setIsModalOpen,
}) => {
  return (
    isModalOpen && (
      <div className="absolute top-0 p-6 w-full flex items-center justify-center bg-black/20">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4">
            {formData.id ? "Edit Student" : "Add Student"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {[
                {
                  name: "fullName",
                  label: "Full Name",
                  type: "text",
                  required: true,
                },
                {
                  name: "class",
                  label: "Class",
                  type: "text",
                  required: true,
                },
                {
                  name: "section",
                  label: "Section",
                  type: "text",
                  required: true,
                },
                {
                  name: "rollNumber",
                  label: "Roll Number",
                  type: "text",
                  required: true,
                },
                { name: "dob", label: "Date of Birth", type: "date" },
                { name: "address", label: "Address", type: "text" },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  required: true,
                },
                {
                  name: "phone",
                  label: "Phone Number",
                  type: "text",
                  required: true,
                },
                { name: "fatherName", label: "Father's Name", type: "text" },
                { name: "motherName", label: "Mother's Name", type: "text" },
                {
                  name: "parentPhone",
                  label: "Parent's Contact Number",
                  type: "text",
                },
                {
                  name: "gender",
                  label: "Gender",
                  type: "radio",
                  options: ["Male", "Female", "Other"],
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium">
                    {field.label}
                  </label>
                  {field.type === "radio" ? (
                    <div className="flex space-x-4">
                      {field.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2"
                        >
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
                className="py-2 px-4 bg-teal-700 text-white rounded hover:bg-teal-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default StudentForm;
