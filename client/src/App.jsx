import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginForm from './components/loginForm';
import RegisterForm from './components/registerForm';
import Home from './components/home';
import Navbar from './components/navbar';
import AboutPage from './pages/taskPages/aboutPage.jsx';
import EmployeeDashboard from './pages/employeeDashboard';
import AdminDashboard from './pages/adminDashboard';
import DepartmentPage from './pages/departmentPage';
import EmployeeManagementDashboard from './pages/employeeManagementDashboard';
import ViewEmployeesPage from './pages/viewEmployeesPage.jsx';
import ManageEmployeesPage from './pages/manageEmployeesPage.jsx';

import NewTaskAssignment from "./pages/taskPages/newTaskAssignment";
import InProgressTasksPage from './pages/taskPages/inProgressTasksPage';
import CompletedTasksPage from './pages/taskPages/completedTasksPage';
import AllTasksPage from './pages/taskPages/allTasksPage';
import TaskDetailsPage from './pages/taskPages/taskDetailsPage';
import TasksDashboard from './pages/taskPages/tasksDashboard';
import ProtectedRoute from './components/protectedRoute';
import AdminRoute from './components/adminRoute';
import NewTasksPage from './pages/taskPages/newTasksPage';
import EditTaskPage from './pages/taskPages/editTaskPage';
import TaskCalendarPage from './pages/taskPages/taskCalenderPage';
import AnalyticsPage from './pages/analyticsPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Navbar />
      <Routes>
      <Route path="/">
      <Route index element={<Home/>} />
      <Route path='login' element={<LoginForm />} />
      <Route path="register" element={<RegisterForm />} />
      <Route path="about" element={<AboutPage/>}/>
      {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
        <Route path="employeeDashboard" element={<EmployeeDashboard />} />
        <Route path='tasks/inprogress' element={<InProgressTasksPage />} /> 
        <Route path="tasks/:id" element={<TaskDetailsPage />} />
        <Route path='tasks/new' element={<NewTasksPage/>} />
        <Route path='tasks/completed' element={<CompletedTasksPage />} />
        <Route path='tasks/all' element={<AllTasksPage />} />
        <Route path='tasksDashboard' element={<TasksDashboard />} />
        <Route path="tasks/update" element={<EditTaskPage/>}/>
        <Route path="tasks/calender" element ={<TaskCalendarPage/>}/>
      </Route>
      {/* Admin routes */}
      <Route path="adminDashboard" element={<AdminDashboard />} />
      <Route path="tasks/assign" element={<NewTaskAssignment />} />
      <Route path='departmentPage' element={<DepartmentPage />} />
      <Route path='employeeManagementDashboard' element={<EmployeeManagementDashboard />} />
      <Route path="viewEmployeesPage" element={<ViewEmployeesPage></ViewEmployeesPage>}/>
      <Route path="manageEmployeesPage" element={<ManageEmployeesPage/>}/>
      <Route path="AnalyticsPage" element={<AnalyticsPage/>}/>
      </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
