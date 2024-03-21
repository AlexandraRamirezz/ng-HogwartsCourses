import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateCourse, Course } from '../models/course';

export const CoursesActions = createActionGroup({
    source: 'Courses',
    events: {
        'Load Courses': emptyProps(),
        'Load Courses Success': props<{ data: Course[] }>(),
        'Load Courses Failure': props<{ error: unknown }>(),

        'Create Courses': props<{ data: CreateCourse }>(),
        'Create Courses Success': props<{ data: Course }>(),
        'Create Courses Failure': props<{ error: unknown }>(),

        'Delete Courses': props<{ id: string }>(),
        'Delete Courses Success': emptyProps(),
        'Delete Courses Failure': props<{ error: unknown }>(),

        'Modify Courses': props<{ id: string, data: Course }>(),
        'Modify Courses Success': props<{ data: Course }>(),
        'Modify Courses Failure': props<{ error: unknown }>(),
    }
});