export interface LessonStudent {
  id: string;
  name: string;
  email: string;
  isDone: boolean;
}
export interface Lesson {
  description: string;
  title: string;
  creator: string;
  id: string;
  students: LessonStudent[];
  classId: string;
}

export interface StudentLesson {
  isDone: boolean;
  title: string;
  description: string;
  creator: string;
  id: string;
  classId: string;
}
