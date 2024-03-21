export interface Course {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    shift: string;
    modality: string;
    teacher: string;
    courseId: number;
}

export interface CreateCourse {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    shift: string;
    modality: string;
    teacher: string;
    courseId: number;
}