import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [status, setStatus] = useState('Verifying...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    fetch(`http://localhost:5000/verify-email?token=${token}`)
      .then(res => res.text())
      .then(data => {
        setStatus(data);
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(() => setStatus('Verification failed. Try again later.'));
  }, []);

  return (
    <div className="p-4 text-center">
      <h1>Email Verification</h1>
      <p>{status}</p>
    </div>
  );
};

export default VerifyEmail;
