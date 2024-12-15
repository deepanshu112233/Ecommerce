import React, { useState, useEffect } from 'react';
import Navbar from '../../components/user/navbar/navbar';

const Track = () => {
  const [userEmail, setUserEmail] = useState(''); // This should be set to the logged-in user's email
  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the user is logged in and retrieve email from localStorage
    const loggedInUserEmail = localStorage.getItem('userEmail');
    if (loggedInUserEmail) {
      setUserEmail(loggedInUserEmail);
    } else {
      setError('Please log in to view your orders.');
    }
  }, []); // Only run once when the component mounts

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch('https://ecommercebackend-8gx8.onrender.com/get-orders');
      const data = await response.json();

      // Find all orders by the logged-in user's email
      const userOrders = data.orders.filter(order => order.email === userEmail);

      if (userOrders.length > 0) {
        setOrderDetails(userOrders);
        setError('');
      } else {
        setError('No orders found for the provided email.');
        setOrderDetails([]);
      }
    } catch (err) {
      setError('Failed to fetch order details. Please try again later.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchOrderDetails();
    }
  }, [userEmail]); // Re-fetch orders whenever userEmail changes

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-6">
            Track Your Orders
          </h1>

          {error && (
            <div className="mt-4 text-red-600 font-semibold">{error}</div>
          )}
          {userEmail ? (
            <>
              <p className="text-gray-600 font-semibold">
                <strong>Logged In As: </strong>{userEmail}
              </p>
              
            </>
          ) : (
            <></>
          )}

          
          {orderDetails.length > 0 ? (
            orderDetails.map((order, index) => (
              <div key={index} className="mt-6 border-t pt-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order Details
                </h2>
                <p className="text-gray-600">
                  <strong>Order ID:</strong> {order.orderId}
                </p>
                <p className="text-gray-600">
                  <strong>Tracking ID:</strong> {order.trackingId}
                </p>
                <p className="text-gray-600">
                  <strong>Status: </strong> 
                  <span className="text-green-600 font-bold">
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'][
                      Math.floor(Math.random() * 5)
                    ]}
                  </span>

                </p>
                <p className="text-gray-600">
                  <strong>Customer Name:</strong> {order.name}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {order.email}
                </p>
                <p className="text-gray-600">
                  <strong>Shipping Address:</strong> {order.address}
                </p>
                <p className="text-gray-600">
                  <strong>Ordered On:</strong> {order.date} at {order.time}
                </p>
                <p className="text-gray-600">
                  <strong>Total Price:</strong> ${order.price}
                </p>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </>
  );
};

export default Track;
