export interface InstructorChat {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  lassMessage: string;
}
