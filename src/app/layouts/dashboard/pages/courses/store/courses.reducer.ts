import { createFeature, createReducer, on } from '@ngrx/store';
import { CoursesActions } from './courses.actions';
import { Course } from '../models/course';

export const coursesFeatureKey = 'courses';

export interface State {
    courses: Course[];
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    courses: [],
    loading: false,
    error: null,
};

export const reducer = createReducer(
    initialState,
    on(CoursesActions.loadCourses, state => ({ ...state, loading: true })),
    on(CoursesActions.loadCoursesSuccess, (state, action) => ({ ...state, loading: false, courses: action.data })),
    on(CoursesActions.loadCoursesFailure, (state, action) => ({ ...state, loading: false, error: action.error })),
);

export const coursesFeature = createFeature({
    name: coursesFeatureKey,
    reducer,
});