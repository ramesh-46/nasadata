import React, { useState } from 'react';

const NasaDataFetcher = () => {
  const [year, setYear] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => setYear(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiKey = 'LgDeD42YyF22MgE8Tz9dhLNu6P2umxG7gvSG1dki'; // Your API key

    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const response = await fetch(`https://api.nasa.gov/DONKI/RBE?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`);
      
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch data: ${errorMessage}`);
      }

      const result = await response.json();
      setData(result);
      setError(''); // Reset any previous errors
    } catch (error) {
      setError(error.message);
      setData([]); // Clear previous data on error
    }
  };

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Activity Type</th>
            <th>Start Date</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.activityType}</td>
              <td>{item.startDate}</td>
              <td>
                <a href={item.link} target="_blank" rel="noopener noreferrer">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={year} 
          onChange={handleChange} 
          placeholder="Enter Year" 
          required
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data.length > 0 && renderTable()}
    </div>
  );
};

export default NasaDataFetcher;
