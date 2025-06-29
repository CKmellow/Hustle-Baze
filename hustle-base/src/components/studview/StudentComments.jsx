import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentComments.css';

const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''} ${editable ? 'clickable' : ''}`}
          onClick={() => editable && setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const StudentComments = () => {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ comment: '', rating: 0 });

  const student = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!student?._id) return;

    fetch(`http://localhost:5000/api/comments/${student._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [student]);

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setForm({ comment: comment.comment || '', rating: comment.rating || 0 });
  };

  const handleSave = async () => {
    await fetch(`http://localhost:5000/api/comments/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const res = await fetch(`http://localhost:5000/api/comments/${student._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updated = await res.json();
    setComments(updated);
    setEditingId(null);
  };

  return (
    <div className="student-comments">
      <h3>📝 My Internship Comments & Ratings</h3>

      {comments.length === 0 ? (
        <div className="no-comments animated-warning">
          ❗You haven't commented on any internship yet.
          <br />
          Submit an application first to leave a comment.
        </div>
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
                <button className="btn save-btn" onClick={handleSave}>💾 Save</button>
              </div>
            ) : (
              <>
                <p className="comment-text">{c.comment}</p>
                <p className="rating-label">
                  Rating: <StarRating rating={c.rating} editable={false} />
                </p>
                <button className="btn edit-btn" onClick={() => handleEdit(c)}>✏️ Edit</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentComments;
