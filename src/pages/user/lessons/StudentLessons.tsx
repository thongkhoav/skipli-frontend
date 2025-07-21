import { useCallback, useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import Modal from "react-modal";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { ToastError, ToastSuccess } from "~/components/Toast/Toast";
import { StudentLesson } from "~/utils/types/lesson.type";
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

const StudentLessons = () => {
  const axiosPrivate = useAxiosPrivate();
  const [markDoneModalOpen, setMarkDoneModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<StudentLesson | null>(
    null
  );
  const [lessons, setLessons] = useState<StudentLesson[]>([]);

  const fetchLessons = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/myLessons");
      setLessons(response?.data?.data);
    } catch (error: any) {
      ToastError(error.response.data.message);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  function openMarkDoneModal() {
    setMarkDoneModalOpen(true);
  }

  function closeMarkDoneModal() {
    setMarkDoneModalOpen(false);
  }

  const markDoneLessonSubmit = async () => {
    try {
      if (!selectedLesson) return;
      await axiosPrivate.post(`/markLessonDone`, {
        lessonId: selectedLesson?.id,
      });
      ToastSuccess("Lesson marked as done successfully");
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === selectedLesson.id ? { ...lesson, isDone: true } : lesson
        )
      );
      closeMarkDoneModal();
      setSelectedLesson(null);
    } catch (error: any) {
      ToastError(error.response.data.message);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg flex flex-col gap-4">
      {/* Add student modal */}
      <Modal
        isOpen={markDoneModalOpen}
        onRequestClose={closeMarkDoneModal}
        style={customStyles}
        contentLabel="Add Student"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-center text-xl font-semibold">
            Mark Lesson as Done
          </h2>
          <p>
            Are you sure you want to mark lesson "{selectedLesson?.title}" as
            done?
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={closeMarkDoneModal}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={markDoneLessonSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <h1 className="text-2xl font-semibold">Your assigned Lessons</h1>

      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons?.map((lesson) => (
            <tr key={lesson.id}>
              <td className="py-2 px-4 border-b text-center">{lesson.title}</td>
              <td className="py-2 px-4 border-b text-center">
                {lesson.description}
              </td>
              <td className="py-2 px-4 border-b text-center max-w-[500px]">
                {lesson?.isDone ? (
                  <FaCircleCheck color="green" className="mx-auto" size={20} />
                ) : (
                  <button
                    onClick={() => {
                      setSelectedLesson(lesson);
                      openMarkDoneModal();
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Done
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default StudentLessons;
