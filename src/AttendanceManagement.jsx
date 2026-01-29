import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL;


function AttendanceManagement() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    date: "",
    status: "Present",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}employees`);
      const data = await res.json();
      setEmployees(data);
    } catch {
      setError("Failed to load employees");
    }
  };

  // Fetch attendance for selected employee
  const fetchAttendance = async (emp) => {
    console.log("emp::", emp);
    if (!emp) return;
    setLoading(true);
    setError("");
console.log("Fetching attendance for emp:", emp);
    try {
      const res = await fetch(
        `${API_URL}employees/${emp}/attendance`
      );
      const data = await res.json();
      setAttendance(data);
    } catch {
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  // Mark attendance
  const markAttendance = async (emp) => {
    // e.preventDefault();

    if (!emp || !form.date) {
      setError("Employee and date required");
      return;
    }
console.log("Marking attendance for emp:", emp, "with data:", form);
    try {
      await fetch(`${API_URL}employees/${emp}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: emp,
          ...form,
        }),
      });

      fetchAttendance(emp);
      setForm({ date: "", status: "Present" });
    } catch {
      setError("Failed to mark attendance");
    }
  };

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendance(selectedEmployee);
    }
  }, [selectedEmployee]);
  console.log("employees:", employees);

  return (
    <div className="section">
      <h2>Attendance Management</h2>
      <p>Admin can mark attendance and view records for each employee.</p>

      {error && <p className="error">{error}</p>}

      {/* Select Employee */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Select Employee:{" "}
          <select
            value={selectedEmployee}
            onChange={(e) => {
              setSelectedEmployee(e.target.value);
              fetchAttendance(e.target.value);
            }}
          >
            <option value="">--Select Employee--</option>
            {employees.map((emp) => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mark Attendance Form */}
      {selectedEmployee && (
        <>
          <h3>Mark Attendance</h3>
          <form onSubmit={(e) => {e.preventDefault(); markAttendance(selectedEmployee)}} className="form">
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              required
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Mark Attendance"}
            </button>
          </form>

          {/* Attendance Records Table */}
          <h3>Attendance Records</h3>
          {loading && <p>Loading...</p>}
          {attendance.length === 0 && !loading && (
            <p>No attendance records found.</p>
          )}

          {attendance.length > 0 && (
            <table border="1" cellPadding="10" style={{ margin: "0 auto" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((rec, i) => (
                  <tr key={i}>
                    <td>{rec.date}</td>
                    <td>{rec.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default AttendanceManagement;
