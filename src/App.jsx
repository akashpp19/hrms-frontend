
import React from 'react';
import EmployeeManagement from './EmployeeManagement';
import AttendanceManagement from './AttendanceManagement';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = React.useState('employees');

  return (
    <div className="app">
      <header className="header">
        <h1>HRMS Lite</h1>
        <nav>
          <button onClick={() => setActiveTab('employees')} className={activeTab === 'employees' ? 'active' : ''}>Employee Management</button>
          <button onClick={() => setActiveTab('attendance')} className={activeTab === 'attendance' ? 'active' : ''}>Attendance Management</button>
        </nav>
      </header>
      <main>
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'attendance' && <AttendanceManagement />}
      </main>
    </div>
  );
}

export default App;