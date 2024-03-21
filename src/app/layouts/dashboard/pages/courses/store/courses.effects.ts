import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of, Subject } from 'rxjs';
import { CoursesService } from '../../../../../core/services/courses.service';
import { CoursesActions } from './courses.actions';

@Injectable()
export class CoursesEffects {
    loadCoursesS$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CoursesActions.loadCourses),
            concatMap(() =>
                this.coursesService.getCourses().pipe(
                    map(data => CoursesActions.loadCoursesSuccess({ data })),
                    catchError(error => of(CoursesActions.loadCoursesFailure({ error }))))
            )
        );
    });

    createCourse$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CoursesActions.createCourses),
            concatMap((action) => {
                return this.coursesService.addCourses(action.data).pipe(
                    map((resp) => CoursesActions.createCoursesSuccess({ data: resp })),
                    catchError((error) => of(CoursesActions.createCoursesFailure({ error })))
                );
            })
        );
    });

    modifyCourse$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CoursesActions.modifyCourses),
            concatMap((action) => {
                return this.coursesService.updateCourses(action.id, action.data).pipe(
                map((resp) => CoursesActions.modifyCoursesSuccess({  data: resp })),
                catchError((error) => of(CoursesActions.modifyCoursesFailure({ error })))
                );
            })
        );
    });

    deleteCourse$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CoursesActions.deleteCourses),
            concatMap((action) => {
                return this.coursesService.deleteCoursesByID(action.id).pipe(
                    map(() => CoursesActions.deleteCoursesSuccess()),
                    catchError((error) => of(CoursesActions.deleteCoursesFailure({ error })))
                );
            })
        );
    });

    createCourseSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CoursesActions.createCoursesSuccess),
            map(() => CoursesActions.loadCourses())
        )
    })

    deleteCourseSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CoursesActions.deleteCoursesSuccess),
            map(() => CoursesActions.loadCourses())
        )
    })

    modifyCourseSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CoursesActions.modifyCoursesSuccess),
            map(() => CoursesActions.loadCourses())
        )
    })

    constructor(private actions$: Actions, private coursesService: CoursesService) {}
}