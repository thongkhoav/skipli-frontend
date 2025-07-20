import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { ToastError, ToastSuccess } from "~/components/Toast/Toast";
import { Lesson } from "~/utils/types/lesson.type";
import { Student } from "~/utils/types/student.type";
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
const Lessons = () => {
  const axiosPrivate = useAxiosPrivate();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [studentPhones, setStudentPhones] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/students");
      setStudents(response?.data?.data);
    } catch (error: any) {
      ToastError(error.response.data.message);
    }
  }, [axiosPrivate]);

  const fetchLessons = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/lessons");
      setLessons(response?.data?.data);
    } catch (error: any) {}
  }, [axiosPrivate]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  function openAddModal() {
    setAddModalOpen(true);
    fetchStudents();
  }

  function closeAddModal() {
    setAddModalOpen(false);
  }

  const addLessonSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lessonTitle || !lessonDescription) {
      ToastError("All fields are required.");
      return;
    }

    try {
      await axiosPrivate.post(`/assignLesson`, {
        title: lessonTitle,
        description: lessonDescription,
        studentPhones: studentPhones,
      });
      ToastSuccess("Lesson added successfully.");
      setLessonTitle("");
      setLessonDescription("");
      setStudentPhones([]);
      closeAddModal();
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
          <h2 className="text-center text-xl font-semibold">Add Lesson</h2>
          <form onSubmit={addLessonSubmit} className="min-w-[400px]">
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">Title</label>
              <input
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">
                Description
              </label>
              <textarea
                minLength={10}
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">Students</label>
              {/* show list of student with checkbox */}
              <div className="flex flex-col gap-2">
                {students.map((student) => (
                  <label key={student.phone} className="flex items-center">
                    <input
                      type="checkbox"
                      value={student.phone}
                      checked={studentPhones.includes(student.phone)}
                      onChange={(e) => {
                        const phone = e.target.value;
                        setStudentPhones((prev) =>
                          prev.includes(phone)
                            ? prev.filter((p) => p !== phone)
                            : [...prev, phone]
                        );
                      }}
                      className="mr-2"
                    />
                    {student.name} ({student.phone})
                  </label>
                ))}
              </div>
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
      <h1>Manage Lessons</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={openAddModal}
          className="
          bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4 w-fit ml-auto"
        >
          Add Lesson
        </button>
      </div>

      {/* lesson table */}
      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Students</th>
          </tr>
        </thead>
        <tbody>
          {lessons?.map((lesson) => (
            <tr key={lesson.id}>
              <td className="py-2 px-4 border-b text-center">{lesson.title}</td>
              <td className="py-2 px-4 border-b text-center">
                {lesson.description}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {lesson?.students?.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lessons;
