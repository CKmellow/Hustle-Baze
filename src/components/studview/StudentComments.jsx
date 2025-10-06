import React, { useEffect, useState } from 'react';
import './StudentComments.css';
import { FaEdit, FaSave, FaTrashAlt, FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating, editable = false }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= rating ? 'filled' : ''} ${editable ? 'clickable' : ''}`}
        onClick={() => editable && setRating(star)}
      >
        {star <= rating ? <FaStar /> : <FaRegStar />}
      </span>
    ))}
  </div>
);

const StudentComments = () => {
  const [comments, setComments] = useState([]);
  const [internshipId, setInternshipId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ comment: '', rating: 0 });
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [newComment, setNewComment] = useState({ comment: '', rating: 0 });

  const student = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchComments = async () => {
    try {
      const res = await fetch(`https://hustle-baze-backend.onrender.com/api/comments/${student._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
  try {
    const res = await fetch(`https://hustle-baze-backend.onrender.com/api/applications/check/${student._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("Check application response:", data);
    setHasApplied(data.hasApplied);
    setInternshipId(data.internshipId); // 👈 Save the internshipId
  } catch (err) {
    console.error('Error checking application status:', err);
  }
};

  useEffect(() => {
    if (student?._id) {
      fetchComments();
      checkApplicationStatus();
    }
  }, [student]);

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setForm({ comment: comment.comment || '', rating: comment.rating || 0 });
  };

  const handleSave = async () => {
    try {
      await fetch(`https://hustle-baze-backend.onrender.com/api/comments/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      await fetchComments();
      setEditingId(null);
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this comment?');
    if (!confirm) return;

    try {
      await fetch(`https://hustle-baze-backend.onrender.com/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleNewComment = async () => {
    try {
      await fetch(`https://hustle-baze-backend.onrender.com/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          internshipId, 
          studentId: student._id,
          comment: newComment.comment,
          rating: newComment.rating,
        }),
      });

      setNewComment({ comment: '', rating: 0 });
      await fetchComments();
    } catch (err) {
      console.error('Error posting new comment:', err);
    }
  };

  return (
    <div className="student-comments">
      <h3>My Internship Comments & Ratings</h3>

      {loading ? (
        <p className="loading">Loading comments...</p>
      ) : comments.length === 0 ? (
        hasApplied ? (
          <div className="comment-form">
            <h4>Leave a Comment</h4>
            <textarea
              value={newComment.comment}
              onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
              placeholder="Your feedback..."
              rows={3}
            />
            <StarRating
              rating={newComment.rating}
              setRating={(value) => setNewComment({ ...newComment, rating: value })}
              editable={true}
            />
            <button className="btn save-btn" onClick={handleNewComment}>
              Submit Comment
            </button>
          </div>
        ) : (
          <div className="no-comments">
            You haven’t submitted a comment yet.
            <br />
            Submit an application first to leave a comment.
          </div>
        )
      ) : (
        comments.map((c) => (
          <div className="comment-card" key={c._id}>
            {editingId === c._id ? (
              <div className="edit-section">
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Update your comment..."
                  rows={4}
                />
                <StarRating
                  rating={form.rating}
                  setRating={(value) => setForm({ ...form, rating: value })}
                  editable={true}
                />
                <div className="btn-group">
                  <button className="btn save-btn" onClick={handleSave}>
                    <FaSave /> Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="comment-text">{c.comment}</p>
                <p className="rating-label">
                  Rating: <StarRating rating={c.rating} editable={false} />
                </p>
                <div className="btn-group">
                  <button className="btn edit-btn" onClick={() => handleEdit(c)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="btn delete-btn" onClick={() => handleDelete(c._id)}>
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentComments;
