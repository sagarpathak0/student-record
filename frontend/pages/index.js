import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const router = useRouter();

  // Fetch students from backend
  useEffect(() => {
    fetch("https://student-record-api.vercel.app/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  // Delete a student by ID
  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`https://student-record-api.vercel.app/students/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStudents(students.filter((student) => student._id !== id));
      } else {
        console.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Trigger confirmation modal
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    deleteStudent(confirmDelete);
    setConfirmDelete(null);
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Student Dashboard
          </h1>
          <button
            onClick={() => router.push("/add-student")}
            className="flex items-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow space-x-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New Student</span>
          </button>
        </div>
        {students.length === 0 ? (
          <p className="text-gray-600">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={student.image || "/default-profile.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {student.address}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                        {student.subjects?.slice(0, 3).map((subject, index) => {
                          const colorStyles = [
                            { bg: "bg-purple-100", text: "text-purple-800" },
                            { bg: "bg-blue-100", text: "text-blue-800" },
                            { bg: "bg-pink-100", text: "text-pink-800" },
                            { bg: "bg-green-100", text: "text-green-800" },
                            { bg: "bg-yellow-100", text: "text-yellow-800" },
                          ];
                          const color = colorStyles[index % colorStyles.length];

                          return (
                            <span
                              key={index}
                              className={`${color.bg} ${color.text} text-sm font-medium px-2 py-1 rounded-full`}
                            >
                              {subject}
                            </span>
                          );
                        })}
                        {student.subjects?.length > 3 && (
                          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded-full">
                            +{student.subjects.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link
                          href={`/edit-student?id=${student._id}`}
                          className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(student._id)}
                          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg p-6 z-10 max-w-sm w-full">
              <h2 className="text-xl text-gray-800 font-bold mb-4">
                Confirm Delete
              </h2>
              <p className="mb-6 text-gray-800">
                Are you sure you want to delete this student?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-green-800 cursor-pointer hover:bg-green-700 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
