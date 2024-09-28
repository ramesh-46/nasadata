import React, { useState } from 'react';
import './NasaDataFetcher.css'; // Import your CSS file

const NasaDataFetcher = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiKey = 'Sgigj3EX7D8Eh9oe6mjPO8a0UK5IyAJ3d6dnLiNv';

    setLoading(true);
    setData([]);
    setError('');

    try {
      const fetchedData = [];
      const startDate = new Date(year, month === 'entire' ? 0 : month - 1, 1);
      const endDate = new Date(year, month === 'entire' ? 11 : month - 1, 28);

      for (let d = startDate; d <= endDate && fetchedData.length < 100; d.setDate(d.getDate() + 1)) {
        const date = d.toISOString().split('T')[0];
        const apodResponse = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
        if (!apodResponse.ok) {
          const errorText = await apodResponse.text();
          throw new Error(`Failed to fetch APOD data for ${date}: ${errorText}`);
        }
        const apodResult = await apodResponse.json();
        fetchedData.push(apodResult);
      }

      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const renderTable = () => {
    if (data.length === 0) {
      return <p></p>;
    }

    return (
      <table className="nasa-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Type</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.title || item.name}</td>
              <td>{item.date || item.close_approach_data?.[0]?.close_approach_date}</td>
              <td>{item.media_type ? 'APOD' : 'Unknown'}</td>
              <td>
                <button onClick={() => handleLinkClick(item)}>Show Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div className="header-image">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj7cyiblt27C0oBPY7_380M2xNSNuWkX0PJA&s"
          alt="NASA"
          className="cropped-image" 
        />
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Select Year:
          <input 
            type="number" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            required 
          />
        </label>
        <label>
          Select Month:
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="entire">Entire Year</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </label>
        <button type="submit">Fetch Data</button>
      </form>

      {loading && <p class="loading" >Fetching data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderTable()}

      {showPopup && selectedItem && (
        <div className="popup-container">
          <div className="popup-content">
            <h2>{selectedItem.title || 'Details'}</h2>
            <p>Date: {selectedItem.date || selectedItem.close_approach_data?.[0]?.close_approach_date}</p>
            {selectedItem.url && (
              <img 
                src={selectedItem.url} 
                alt="APOD" 
                style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }} 
              />
            )}
            <p>{selectedItem.explanation || 'No additional explanation.'}</p>
            <button onClick={handleClosePopup} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NasaDataFetcher;
