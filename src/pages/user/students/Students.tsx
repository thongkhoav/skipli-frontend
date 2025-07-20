import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { ToastError, ToastSuccess } from "~/components/Toast/Toast";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { Student } from "~/utils/types/student.type";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Students = () => {
  const axiosPrivate = useAxiosPrivate();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentRole, setNewStudentRole] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/students");
      setStudents(response?.data?.data);
    } catch (error: any) {
      ToastError(error.response.data.message);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchStudents();
  }, []);

  function openAddModal() {
    setAddModalOpen(true);
  }

  function closeAddModal() {
    setAddModalOpen(false);
  }

  const addStudentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !newStudentName ||
      !newStudentPhone ||
      !newStudentEmail ||
      !newStudentRole
    ) {
      ToastError("All fields are required.");
      return;
    }
    try {
      await axiosPrivate.post(`/addStudent`, {
        name: newStudentName,
        phone: newStudentPhone,
        email: newStudentEmail,
        role: newStudentRole,
      });
      ToastSuccess("Student added successfully.");
      setNewStudentName("");
      setNewStudentPhone("");
      setNewStudentEmail("");
      closeAddModal();
      fetchStudents();
    } catch (error: any) {
      ToastError(error.response.data.message);
    }
  };
  return (
    <div className="w-full bg-white p-6 rounded-lg flex flex-col">
      {/* Add student modal */}
      <Modal
        isOpen={addModalOpen}
        onRequestClose={closeAddModal}
        style={customStyles}
        contentLabel="Add Student"
      >
        <div className="flex flex-col items-center ">
          <h2 className="text-center text-xl font-semibold">Add Student</h2>
          <form onSubmit={addStudentSubmit} className="min-w-[400px]">
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">Name</label>
              <input
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">Phone</label>
              <input
                value={newStudentPhone}
                onChange={(e) => setNewStudentPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">Email</label>
              <input
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">Role</label>
              <input
                value={newStudentRole}
                onChange={(e) => setNewStudentRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={closeAddModal}
                className="w-full bg-gray-300 text-black font-semibold py-2 px-4 rounded hover:bg-gray-400 mb-4"
              >
                Close
              </button>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 hover:cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <h1>Manage Students</h1>
      <div className="flex justify-between items-center mb-4">
        <span>{students.length} students</span>
        <button
          onClick={openAddModal}
          className="
          bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4 w-fit ml-auto"
        >
          Add Student
        </button>
      </div>

      {/* student table */}
      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Verified</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => (
            <tr key={student.email}>
              <td className="py-2 px-4 border-b text-center">{student.name}</td>
              <td className="py-2 px-4 border-b text-center">
                {student.phone}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {student.email}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {student.studentRole}
              </td>
              <td className="py-2 px-4 border-b">
                {student.isVerified ? (
                  <FaCircleCheck color="green" className="mx-auto" size={20} />
                ) : (
                  <FaCircleXmark color="red" className="mx-auto" size={20} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
