import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { ToastError, ToastSuccess } from "~/components/Toast/Toast";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { Student } from "~/utils/types/student.type";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { LuAsterisk } from "react-icons/lu";

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [studentCreating, setStudentCreating] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentAddress, setNewStudentAddress] = useState("");
  const [editStudentId, setEditStudentId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [isStudentDeleting, setIsStudentDeleting] = useState(false);

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

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditStudentId(student?.id);
    setEditName(student?.name);
    setEditAddress(student?.address || "");
    setEditModalOpen(true);
  };

  const openDeleteModal = (student: Student) => {
    setDeleteStudent(student);
    setDeleteModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setNewStudentName("");
    setNewStudentPhone("");
    setNewStudentEmail("");
    setNewStudentAddress("");
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditName("");
    setEditAddress("");
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteStudent(null);
  };

  const addStudentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newStudentName || !newStudentPhone || !newStudentEmail) {
      ToastError("Please fill in required fields.");
      return;
    }
    try {
      setStudentCreating(true);
      await axiosPrivate.post(`/addStudent`, {
        name: newStudentName,
        phone: `+1${newStudentPhone}`,
        email: newStudentEmail,
        address: newStudentAddress,
      });
      ToastSuccess("Student added successfully.");
      setNewStudentName("");
      setNewStudentPhone("");
      setNewStudentEmail("");
      setNewStudentAddress("");
      closeAddModal();
      fetchStudents();
    } catch (error: any) {
      ToastError(error.response.data.message);
    } finally {
      setStudentCreating(false);
    }
  };

  const editStudentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editName) {
      ToastError("Please fill in the name.");
      return;
    }
    try {
      await axiosPrivate.put(`/student/${editStudentId}`, {
        name: editName,
        address: editAddress,
      });
      ToastSuccess("Student updated successfully.");
      setEditName("");
      setEditAddress("");
      closeAddModal();
      setStudents((prev) =>
        prev.map((student) =>
          student?.id === editStudentId
            ? { ...student, name: editName, address: editAddress }
            : student
        )
      );
      setEditModalOpen(false);
    } catch (error: any) {
      ToastError(error.response.data.message);
    }
  };

  const deleteStudentHandler = async () => {
    if (!deleteStudent || !deleteStudent?.id) {
      ToastError("No student selected.");
      return;
    }
    try {
      setIsStudentDeleting(true);
      await axiosPrivate.delete(`/student/${deleteStudent?.id}`);
      ToastSuccess("Student deleted successfully.");
      closeDeleteModal();
      setStudents((prev) =>
        prev.filter((student) => student?.id !== deleteStudent?.id)
      );
      setDeleteModalOpen(false);
      setDeleteStudent(null);
      setIsStudentDeleting(false);
    } catch (error: any) {
      ToastError(error.response.data.message);
    }
  };

  const onChangeNewStudentPhone = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/\D/g, "");
    setNewStudentPhone(value);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg flex flex-col">
      {/* Delete student */}
      <Modal
        isOpen={deleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customStyles}
        contentLabel="Delete Student"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-center text-xl font-semibold">Delete Student</h2>
          <p>
            Are you sure you want to delete student "
            <b>{deleteStudent?.name}</b>"?
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={closeDeleteModal}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={deleteStudentHandler}
              disabled={isStudentDeleting}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
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
              <label className=" mb-2 font-semibold shad flex items-center">
                Name <LuAsterisk color="red" />
              </label>
              <input
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className=" mb-2 font-semibold shad flex items-center">
                Phone <LuAsterisk color="red" />
              </label>
              <input
                value={newStudentPhone}
                onChange={onChangeNewStudentPhone}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className=" mb-2 font-semibold shad flex items-center">
                Email <LuAsterisk color="red" />
              </label>
              <input
                type="email"
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className=" mb-2 font-semibold shad flex items-center">
                Address
              </label>
              <input
                value={newStudentAddress}
                onChange={(e) => setNewStudentAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
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
                disabled={studentCreating}
                className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit student */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        style={customStyles}
        contentLabel="Edit Student"
      >
        <div className="flex flex-col items-center ">
          <h2 className="text-center text-xl font-semibold">Edit Student</h2>
          <form onSubmit={editStudentSubmit} className="min-w-[400px]">
            <div className="mb-4">
              <label className=" mb-2 font-semibold shad flex items-center">
                Name <LuAsterisk color="red" />
              </label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">Address</label>
              <input
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={closeEditModal}
                className="w-full bg-gray-300 text-black font-semibold py-2 px-4 rounded hover:bg-gray-400 mb-4"
              >
                Close
              </button>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 hover:cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          Manage Students ({students.length})
        </h1>
        <button
          onClick={openAddModal}
          className="
          bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4 w-fit ml-auto hover:cursor-pointer"
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
            <th className="py-2 px-4 border-b">Verified</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => (
            <tr key={student?.email}>
              <td className="py-2 px-4 border-b text-center">
                {student?.name}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {student?.phone.replace(/\+1/, "")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {student?.email}
              </td>
              <td className="py-2 px-4 border-b">
                {student?.isVerified ? (
                  <FaCircleCheck color="green" className="mx-auto" size={20} />
                ) : (
                  <FaCircleXmark color="red" className="mx-auto" size={20} />
                )}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  className="text-white bg-blue-700 px-2 py-1 rounded hover:bg-blue-800 mr-2 hover:cursor-pointer"
                  onClick={() => openEditModal(student)}
                >
                  Edit
                </button>
                <button
                  className="text-white bg-red-700 px-2 py-1 rounded hover:bg-red-800 hover:cursor-pointer"
                  onClick={() => openDeleteModal(student)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
