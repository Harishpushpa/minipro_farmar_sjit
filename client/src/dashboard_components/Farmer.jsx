import React, { useState, useEffect } from "react";
import "../css/farmer.css";
import { useNavigate } from "react-router-dom";

const Farmers = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [primarySort, setPrimarySort] = useState("date");
  const [reviewCart, setReviewCart] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [loading, setLoading] = useState(true);  // New: Loading state

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/farmer");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("Fetched Farmers:", data);  

        setFarmers(data);
        setSortedData(data);
        setLoading(false);  // Data fetched, stop loading
      } catch (error) {
        console.error("Error fetching farmers:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Sort data when farmers or primarySort changes
  useEffect(() => {
    if (farmers.length > 0) {
      let sorted = [...farmers];
      sorted.sort((a, b) => compare(a, b, primarySort));
      console.log("Sorted Data:", sorted);
      setSortedData(sorted);
    }
  }, [primarySort, farmers]);

  // ✅ Sorting function
  const compare = (a, b, type) => {
    switch (type) {
      case "expectedPrice":
        return a.expectedPrice - b.expectedPrice;
      case "pincode":
        return a.pincode.localeCompare(b.pincode);
      case "cropType":
        return a.cropType.localeCompare(b.cropType);
      case "date":
        return new Date(b.datePublished) - new Date(a.datePublished);
      default:
        return 0;
    }
  };

  // ✅ Add to review cart
  const addToReview = (farmer) => {
    setReviewCart((prevCart) => [...prevCart, farmer]);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Farmer Market</h2>
        <button className="logout" onClick={() => navigate("/")}>Logout</button>
      </aside>

      {/* Main Content */}
      <main className="content">
        <div className="header">
          <h1>Farmers Listings</h1>
          <div className="sort-container">
            <select className="sort-dropdown" onChange={(e) => setPrimarySort(e.target.value)}>
              <option value="date">Sort by Date</option>
              <option value="expectedPrice">Sort by Expected Price</option>
              <option value="pincode">Sort by Pincode</option>
              <option value="cropType">Sort by Crop Type</option>
            </select>
          </div>
        </div>

        {/* ✅ Show loading message if data is not yet loaded */}
        {loading ? (
          <p className="loading-text">Loading farmers...</p>
        ) : sortedData.length === 0 ? (
          <p className="no-data-text">No farmers available.</p>
        ) : (
          <div className="farmer-list">
            {sortedData.map((farmer) => (
              <div key={farmer._id} className="farmer-card" onClick={() => setSelectedFarmer(farmer)}>
                <img src={farmer.photo} alt={farmer.name} className="farmer-photo" />
                <div className="farmer-info">
                  <h3 className="farmer-name">{farmer.name}</h3>
                  <p><strong>Phone:</strong> {farmer.phone}</p>
                  <p><strong>Address:</strong> {farmer.address}</p>
                  <p><strong>Pincode:</strong> {farmer.pincode}</p>
                  <p><strong>Crop:</strong> {farmer.cropType}</p>
                  <p><strong>Quantity:</strong> {farmer.quantityAvailable} kg</p>
                  <p><strong>Expected Price:</strong> ₹{farmer.expectedPrice}</p>
                  <p><strong>Date:</strong> {new Date(farmer.datePublished).toLocaleDateString()}</p>
                  <button className="add-to-review" onClick={() => addToReview(farmer)}>Add to Review</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for farmer details */}
        {selectedFarmer && (
          <div className="modal" onClick={() => setSelectedFarmer(null)}>
            <div className="modal-content">
              <h2>{selectedFarmer.name}</h2>
              <img src={selectedFarmer.photo} alt={selectedFarmer.name} />
              <p><strong>Phone:</strong> {selectedFarmer.phone}</p>
              <p><strong>Address:</strong> {selectedFarmer.address}</p>
              <p><strong>Pincode:</strong> {selectedFarmer.pincode}</p>
              <p><strong>Crop:</strong> {selectedFarmer.cropType}</p>
              <p><strong>Quantity:</strong> {selectedFarmer.quantityAvailable} kg</p>
              <p><strong>Expected Price:</strong> ₹{selectedFarmer.expectedPrice}</p>
              <p><strong>Date:</strong> {new Date(selectedFarmer.datePublished).toLocaleDateString()}</p>
              <button onClick={() => setSelectedFarmer(null)}>Close</button>
            </div>
          </div>
        )}

        {/* Review Cart Section */}
        <div className="review-section">
          <h2>Review Cart</h2>
          {reviewCart.length > 0 ? (
            <ul className="review-list">
              {reviewCart.map((item, index) => (
                <li key={`${item._id}-${index}`} className="review-item">
                  {item.name} - {item.cropType} - ₹{item.expectedPrice}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-review">No items in the review cart.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Farmers;
