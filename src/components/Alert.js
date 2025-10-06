import React, { useEffect, useState } from 'react';
import './Alert.css';

const Alert = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible || !message) return null;

  return (
    <div className={`alert alert-${type}`}>
      {message}
    </div>
  );
};

export default Alert;
