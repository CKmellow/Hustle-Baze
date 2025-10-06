import React, { useEffect, useState } from 'react';


const ManageComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('https://hustle-baze-backend.onrender.com/api/comments');
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://hustle-baze-backend.onrender.com/api/comments/${id}`, {
        method: 'DELETE'
      });

      const result = await res.json();
      if (result.success) {
        alert("Comment deleted successfully");
        setComments(prev => prev.filter(comment => comment._id !== id));
      } else {
        alert(result.message || "Failed to delete comment.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting comment.");
    }
  };

  return (
    <div className="manage-comments">
      <h2>Student Comments</h2>
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Internship ID</th>
              <th>Student ID</th>
              <th>Comment</th>
              <th>Rating</th>
              <th>Posted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment._id}>
                <td>{comment.internshipId}</td>
                 <td>{comment.studentID || "Unknown"}</td>
                <td>{comment.comment}</td>
                <td>{comment.rating ?? '-'}</td>
                <td>{new Date(comment.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(comment._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageComments;
