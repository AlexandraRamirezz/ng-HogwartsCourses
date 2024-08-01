# ✨ HogwartsCourses

HogwartsCourses is a comprehensive administrative platform built with Angular, designed to manage users, courses, and enrollments with a magical twist inspired by Hogwarts. Users can log in with their credentials and perform actions based on their assigned roles (admin, teacher, student).

## 📝 Features
### 🎯 Authentication
- **Login**: Secure login using json server credentials, in the toolbar you can see the user name and component name.
  ![Login](./src/assets/images/execution/login.gif)

- **Role-Based Access Control:**: Different roles grant access to specific functionalities and sections.

## 📝 Roles and permissions
  - **Admin**:
    - Full access to manage users, courses, and enrollments.
    - Can create, edit, and delete users and courses.
    - Can create and delete enrollments.
  - **Teacher**:
    - Can view and create courses.
    - Can view other teachers, students, and enrollments.
  - **Student**:
    - Can view courses and the student list.
    - Can create enrollments.

## 📝 Usage
  1. Clone the repository:
```bash
  git clone https://github.com/AlexandraRamirezz/ng-HogwartsCourses.git
```
  2. Navigate to the project directory:
```bash
  cd ng-HogwartsCourses
```
  3. Install dependencies:
```bash
  npm install
```
  4. Start the application:
```bash
  npm ng serve
```
  5. Run the JSON-server:
```bash
  json-server --watch db.json
```

## 📝 Sections and execution
### Administrator view
#### 🎯 Users
     Full access to create, view, edit and delete any user.
  ![Users](./src/assets/images/execution/users.gif)

#### 🎯 Courses
     Full access to create, view, edit and delete any course.
  ![Courses](./src/assets/images/execution/courses.gif)

#### 🎯 Enrollments
     Full access to create, view, edit and delete any enrollment.
  ![Enrollments](./src/assets/images/execution/enrollments.gif)
