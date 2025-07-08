// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import './clientcss.css'; // Import your CSS file

// ClientDashboard component
const ClientDashboard = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [allUserSeats, setAllUserSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [adminDetails, setAdminDetails] = useState({});
  const [selectedAdminPlace, setSelectedAdminPlace] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showdetails, setShowdetails] = useState(false);
  const [showselected, setShowselected] = useState(false);
  const [timeRanges, setTimeRanges] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

  const toggleShowdetails = () => {
    setShowdetails(true);
    setShowselected(false);
  };
  const toggleShowselected = () => {
    setShowdetails(false);
    setShowselected(true);
  }

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        // Fetch user details from Realtime Database
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          setUserData(userData);

          // Populate profile information
          if (userData) {
            setMobileNumber(userData.mobileNumber || '');
            setAddress(userData.address || '');
            setCarNumber(userData.carNumber || '');
          }
        });

        // Fetch all seat information from userSeats data path
        const userSeatsRef = ref(db, 'userSeats');
        onValue(userSeatsRef, (seatsSnapshot) => {
          const seatsData = seatsSnapshot.val();
          if (seatsData) {
            setAllUserSeats(seatsData);
          }
        });
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);
  
  useEffect(() => {
    toggleShowdetails();
  }, []);

  useEffect(() => {
    // Fetch admin details based on admin UID
    const fetchAdminDetails = async (adminUid) => {
      const db = getDatabase();
      const adminRef = ref(db, `admin/${adminUid}`);
      onValue(adminRef, (snapshot) => {
        const adminData = snapshot.val();
        setAdminDetails((prevDetails) => ({
          ...prevDetails,
          [adminUid]: adminData,
        }));
      });
    };

    // Fetch admin details for each admin UID in allUserSeats
    Object.keys(allUserSeats).forEach((adminUid) => {
      fetchAdminDetails(adminUid);
    });
  }, [allUserSeats]);

  useEffect(() => {
    // Fetch time ranges based on selectedAdminPlace and admin UID
    const fetchTimeRanges = async () => {
      if (selectedAdminPlace && adminDetails[selectedAdminPlace]) {
        const adminUid = selectedAdminPlace;
        const db = getDatabase();
        const timeRangesRef = ref(db, `timeranges/${adminUid}`);
        onValue(timeRangesRef, (snapshot) => {
          const timeRangesData = snapshot.val();
          if (timeRangesData) {
            setTimeRanges(timeRangesData);
          }
        });
      }
    };

    fetchTimeRanges();
  }, [selectedAdminPlace, adminDetails]);

  const handleSeatToggle = (adminUid, seatId) => {
    // Check if the seat is unoccupied
    if (allUserSeats[adminUid] && allUserSeats[adminUid][seatId] === false) {
      // Toggle the selected status of the seat
      setSelectedSeats((prevSeats) => {
        const seatIndex = prevSeats.findIndex((seat) => seat.adminUid === adminUid && seat.seatId === seatId);

        if (seatIndex !== -1) {
          // Seat is already selected, so deselect it
          const updatedSeats = [...prevSeats];
          updatedSeats.splice(seatIndex, 1);
          return updatedSeats;
        } else {
          // Seat is not selected, so select it
          return [{ adminUid, seatId }];
        }
      });
    }
  };

  const handleTimeRangeSelect = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };

  const isSubmitButtonDisabled = !(selectedSeats.length === 1 && selectedTimeRange);

  const handleSubmitSeats = async () => {
    // Generate a unique QR code based on selected seats
    const clientInfo = {
      adminUid: selectedSeats.length > 0 ? selectedSeats[0].adminUid : null,
      name: userData.name,
      email: user.email,
      id: userData.userId,
      seats: selectedSeats.map(({ seatId }) => seatId),
      timeRange: selectedTimeRange,
    };
    const qrCodeData = JSON.stringify(clientInfo);
    setQrCode(qrCodeData);

    // Update the userSeats data path with the selected seats
    const db = getDatabase();
    const userSeatsRef = ref(db, 'userSeats');
    const updatedSeats = { ...allUserSeats };

    selectedSeats.forEach(({ adminUid, seatId }) => {
      updatedSeats[adminUid][seatId] = true; // Mark the seat as occupied
    });

    await set(userSeatsRef, updatedSeats);

    // Clear the selected seats and time range after submission
    setSelectedSeats([]);
    setSelectedTimeRange(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/Home-client');
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    // Update the user profile information in the Realtime Database
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);
    await set(userRef, {
      ...userData,
      mobileNumber,
      address,
      carNumber,
    });

    setIsEditingProfile(false);
  };

  console.log('Rendering ClientDashboard');

  return (
    <>
    <input type="checkbox" id="nav-toggle"/>
    <section className="sidebar">

        <div className="sidebar-menu">
            <ul>
                <li>
                    <a href="#" onClick={toggleShowdetails}>
                    <span><i class="bi bi-person-circle" style={{fontSize:"19px"}}></i></span>
                        <span>Profile</span>
                    </a>
                </li>
                <li>
                    <a href="#" onClick={toggleShowselected}>
                    <span><i class="bi bi-ticket-perforated" style={{fontSize:"19px"}}></i></span>
                        <span>Slots</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="active"onClick={handleLogout}> 
                    <span><i class="bi bi-box-arrow-right" style={{fontSize:"19px"}}></i></span>
                        <span>Logout</span> 
                    </a>
                </li>
                
    
                
            </ul>
        </div>
    </section>
    
    <div className='main-content'>
    <header>

      <div className="header-title">
          <h2>  
            <label htmlFor="nav-toggle">
              <i class="bi bi-list"></i>
              </label>
              Welcome to the <span className='name-span'> Client Dashboard </span>
          </h2>
      </div>
      </header>
    <main>
    {showdetails && (
    <div className='cards'>

    <div className="card-single">
      <h2 style={{color:"#FF416C"}}>Details</h2>
      {user && (
        <div>
          <p><span>Email:&nbsp; </span>{user.email}</p>
          {userData && (
            <div>
              <p><span>Name:&nbsp; </span>{userData.name}</p>
              <p><span>ID: &nbsp;</span>{userData.userId}</p>
              <p><span>Role:&nbsp; </span> {userData.role}</p>
            </div>
          )}
          
          <div className="dashboard-page">
            <h3 style={{color:"#FF416C"}}>Profile Information</h3>
            {isEditingProfile ? (
              <>
                <label htmlFor="mobileNumber"><span>Mobile Number:</span></label>
                <input
                  type="text"
                  id="mobileNumber"
                  class="form-control"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
                <br />
                <label htmlFor="address"><span>Address:</span></label>
                <input type="text" id="address" class="form-control"value={address} onChange={(e) => setAddress(e.target.value)} />
                <br />
                <label htmlFor="carNumber"><span>Car Number:</span></label>
                <input type="text" id="carNumber"class="form-control" value={carNumber} onChange={(e) => setCarNumber(e.target.value)} />
                <br />
                <button type="button" class="btn btn-primary" onClick={handleSaveProfile}>
                  Save Profile
                </button>
              </>
            ) : (
              <>
                <p>Mobile Number: {mobileNumber}</p>
                <p>Address: {address}</p>
                <p>Car Number: {carNumber}</p>
                <button type="button" class="btn btn-primary" onClick={handleEditProfile}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
         
        </div>
      )}
    </div>
    </div>
    )}

{showselected &&(
            <>
          <div className='card-single'>
            <label htmlFor="adminPlace">Select Admin Place:</label>
            <select id="adminPlace" class= "form-control" onChange={(e) => setSelectedAdminPlace(e.target.value)}>
              <option value="">Select...</option>
              {Object.keys(adminDetails).map((adminUid) => (
                <option key={adminUid} value={adminUid}>
                  {adminDetails[adminUid] && adminDetails[adminUid].place}
                </option>
              ))}
            </select>
          </div>
          {selectedAdminPlace && (
            <div className="card-single" style={{marginTop:"12px"}}>
              {/* Fetch admin information based on selectedAdminPlace */}
              {adminDetails[selectedAdminPlace] && (
                <>
                  <p>Admin Name: {adminDetails[selectedAdminPlace].name}</p>
                  <p>Admin Description: {adminDetails[selectedAdminPlace].description}</p>
                  <p>Admin Place: {adminDetails[selectedAdminPlace].place}</p>
                  <p>Time Ranges:</p>
                  <ul>
                    {timeRanges.map((timeRange, index) => (
                      <li
                        key={index}
                        onClick={() => handleTimeRangeSelect(timeRange)}
                        className={selectedTimeRange === timeRange ? 'selected' : ''}
                      >
                        {timeRange}
                      </li>
                    ))}
                  </ul>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Seat ID</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(allUserSeats[selectedAdminPlace]).map(([seatId, status]) => (
                        <tr key={seatId}>
                          <td>{seatId}</td>
                          <td>{status ? 'Occupied' : 'Not Occupied'}</td>
                          <td>
                            {status === false && (
                              <button type="button" class="btn btn-light" onClick={() => handleSeatToggle(selectedAdminPlace, seatId)}>
                                {selectedSeats.find(
                                  (seat) => seat.adminUid === selectedAdminPlace && seat.seatId === seatId
                                )
                                  ? 'Deselect'
                                  : 'Select'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}
          {selectedSeats.length === 1 && selectedTimeRange && (
            <div className="card-single" style={{marginTop:"12px"}}>
              <h3>Selected Seat and Time Range:</h3>
              <p>
                Admin UID: {selectedSeats[0].adminUid}, Seat ID: {selectedSeats[0].seatId}, Time Range: {selectedTimeRange}
              </p>
              <button type="button"  class="btn btn-primary" onClick={handleSubmitSeats} disabled={isSubmitButtonDisabled}>
                Submit Seat
              </button>
            </div>
          )}
          {qrCode && (
            <div className="dashboard-page">
              <h3>QR Code:</h3>
              <QRCode value={qrCode} />
            </div>
          )}
          </>
          )}
    </main>
    </div>
    </>
  );
};

export default ClientDashboard;
