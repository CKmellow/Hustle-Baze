import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ViewAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

 useEffect(() => {
    fetch('http://localhost:5000/api/applications/analytics')
      .then(res => res.json())
      .then(data => {
        // Convert data to array format for Recharts
        const formattedData = Object.entries(data).map(([status, count]) => ({
          status,
          count
        }));
        setAnalyticsData(formattedData);
      })
      .catch(err => {
        console.error('Error fetching analytics:', err);
      });
  }, []);


  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Application Status Analytics</h2>
      {analyticsData ? (
        <ResponsiveContainer>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default ViewAnalytics;
