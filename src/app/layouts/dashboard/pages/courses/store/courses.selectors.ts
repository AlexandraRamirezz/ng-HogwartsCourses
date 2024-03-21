import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCourses from './courses.reducer';

export const selectCoursesState = createFeatureSelector<fromCourses.State>(
    fromCourses.coursesFeatureKey
);

export const selectCourses = createSelector(selectCoursesState, (state) => state.courses);