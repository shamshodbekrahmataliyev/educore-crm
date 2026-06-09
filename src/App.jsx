import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EduProvider } from './context/EduContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Payments from './pages/Payments';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';

export default function App() {
  return (
    <EduProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar/>
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/students" element={<Students/>}/>
              <Route path="/courses" element={<Courses/>}/>
              <Route path="/payments" element={<Payments/>}/>
              <Route path="/attendance" element={<Attendance/>}/>
              <Route path="/reports" element={<Reports/>}/>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </EduProvider>
  );
}
