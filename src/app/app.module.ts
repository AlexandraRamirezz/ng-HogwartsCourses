import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from './layouts/dashboard/dashboard.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from './core/services/users.service';
import { CoursesService } from './core/services/courses.service';
import { EnrollmentsService } from './core/services/enrollments.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DashboardModule,
    MatNativeDateModule,
    HttpClientModule,
  ],
  providers: [
    UsersService,
    CoursesService,
    EnrollmentsService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
