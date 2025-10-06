import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faUser, faSpinner, faDownload } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Analytics.css';

const COLORS = ['#0077b6', '#00b4d8', '#90e0ef', '#f72585'];

const ViewAnalytics = () => {
  const [applicationData, setApplicationData] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetch(`https://hustle-baze-backend.onrender.com/api/applications/analytics?range=${timeRange}`)
      .then(res => res.json())
      .then(data => {
        const formatted = Object.entries(data).map(([status, count]) => ({
          status,
          count
        }));
        setApplicationData(formatted);
        setLoading(false);
      });
  }, [timeRange]);

  useEffect(() => {
    fetch('https://hustle-baze-backend.onrender.com/api/analytics/user-roles', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const total = data.data.reduce((sum, item) => sum + item.count, 0);
          const formatted = data.data.map((item, i) => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.count,
            fill: COLORS[i % COLORS.length]
          }));
          setRoleData(formatted);
          setTotalUsers(total);
        }
      });
  }, []);

  const exportPDF = () => {
    const input = document.querySelector('.analytics-container');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("analytics-report.pdf");
    });
  };

  return (
    <motion.div className="analytics-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div className="analytics-header">
        <motion.h2 className="analytics-title" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <FontAwesomeIcon icon={faChartBar} /> Application Status Overview
        </motion.h2>

        <div className="analytics-controls">
          <button onClick={() => setTimeRange('month')} className={timeRange === 'month' ? 'active' : ''}>This Month</button>
          <button onClick={() => setTimeRange('all')} className={timeRange === 'all' ? 'active' : ''}>All Time</button>
          <button onClick={exportPDF}><FontAwesomeIcon icon={faDownload} /> Export PDF</button>
        </div>
      </div>

      <motion.div className="analytics-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" /> Loading...
          </div>
        ) : applicationData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, 'Applications']} />
              <Bar dataKey="count" fill="#0077b6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available.</p>
        )}
      </motion.div>

      <motion.h2 className="analytics-title" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
        <FontAwesomeIcon icon={faUser} /> App Usage by User Type
      </motion.h2>

      <motion.div className="analytics-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
        {roleData ? (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, value }) =>
                  `${name} (${((value / totalUsers) * 100).toFixed(1)}%)`
                }
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} users`, `${name}`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Loading user role breakdown...</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ViewAnalytics;
