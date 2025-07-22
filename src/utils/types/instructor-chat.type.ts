export interface InstructorChat {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  lastMessage: string;
}
