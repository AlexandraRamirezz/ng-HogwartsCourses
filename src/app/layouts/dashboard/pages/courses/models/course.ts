export interface Course {
    courseId: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    shift: string;
    modality: string;
    teacher: string;
    capacity: number;
    enrolled: number;
    status: boolean;
}