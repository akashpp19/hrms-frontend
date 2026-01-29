import React, { useEffect, useState } from "react";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees");
    }
  };

  // ✅ Add employee
  const addEmployee = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://127.0.0.1:8000/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });

      fetchEmployees();
    } catch (err) {
      setError("Failed to add employee");
    }
  };

  // ✅ Delete employee
  const deleteEmployee = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/employees/${id}`, {
        method: "DELETE",
      });

      fetchEmployees();
    } catch (err) {
      setError("Failed to delete employee");
    }
  };

  return (
    <div className="section">
      <h2>Employee Management</h2>

      {error && <p className="error">{error}</p>}

      {/* ✅ Add Employee Form */}
      <form onSubmit={addEmployee} className="form">
        <input
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          required
        />

        <input
          placeholder="Full name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <select
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          required
        >
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
        </select>

        <button type="submit">Add Employee</button>
      </form>

      {/* ✅ View All Employees */}
      <h3>All Employees</h3>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.employee_id}</td>
                <td>{emp.full_name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Delete Employee Section */}
      <h3>Delete an Employee</h3>
      {employees.length === 0 ? (
        <p>No employees available to delete.</p>
      ) : (
        <ul>
          {employees.map((emp) => (
            <li key={emp.employee_id}>
              {emp.full_name} ({emp.employee_id}){" "}
              <button
                onClick={() => deleteEmployee(emp.employee_id)}
                style={{ background: "red", color: "white", marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EmployeeManagement;
