import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          setUsers(response.data.filter(u => u.role !== 'careerOfficer'));
        }
      })
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error deleting user.");
    } finally {
      closeModal();
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('User List Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const tableColumn = ["First Name", "Last Name", "Email", "Role"];
    const tableRows = users.map(user => [
      user.fname,
      user.lname,
      user.email,
      user.role
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30
    });

    doc.save('user_list.pdf');
  };

  return (
    <div className="manage-users">
      <div className="header-row">
        <h2>Manage Users</h2>
        <button className="export-btn" onClick={exportToPDF}>
          <FontAwesomeIcon icon={faDownload} /> Export PDF
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.fname}</td>
              <td>{user.lname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => openModal(user)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="custom-modal">
          <div className="modal-content slide-up">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{selectedUser?.fname} {selectedUser?.lname}</strong>?</p>
            <div className="modal-actions">
              <button onClick={handleConfirmDelete} className="btn-confirm">Yes, Delete</button>
              <button onClick={closeModal} className="btn-cancel">Cancel</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
