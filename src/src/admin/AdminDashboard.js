// AdminDashboard.js

import React, { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref as databaseRef, onValue, set, update } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const AdminDashboard = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState([]);
  const [seatStatus, setSeatStatus] = useState({
    seat1: false,
    seat2: false,
    seat3: false,
    seat4: false,
    seat5: false,
    seat6: false,
    seat7: false,
    seat8: false,
    seat9: false,
    seat10: false,
  });
  const timeOptions = [
    { value: '10:00 AM - 11:00 AM', label: '10:00 AM - 11:00 AM' },
    { value: '11:00 AM - 12:00 PM', label: '11:00 AM - 12:00 PM' },
    { value: '12:00 PM - 1:00 PM', label: '12:00 AM - 1:00 PM' },
    { value: '1:00 PM - 2:00 PM', label: '1:00 PM - 2:00 PM' },
    { value: '2:00 PM - 3:00 PM', label: '2:00 AM - 3:00 PM' },
    { value: '3:00 PM - 4:00 PM', label: '3:00 PM - 4:00 PM' },
    { value: '4:00 PM - 5:00 PM', label: '4:00 AM - 5:00 PM' },
    { value: '5:00 PM - 6:00 PM', label: '5:00 PM - 6:00 PM' },
    

    // Add more options as needed
  ];
  const [editingProfile, setEditingProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    description: '',
    place: '',
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const db = getDatabase();
        const adminRef = databaseRef(db, `admin/${user.uid}`);

        onValue(adminRef, (snapshot) => {
          const adminUserData = snapshot.val();
          setAdminUser(adminUserData);

          const userSeatsRef = databaseRef(db, `userSeats/${user.uid}`);
          onValue(userSeatsRef, (seatsSnapshot) => {
            const seatsData = seatsSnapshot.val();
            if (seatsData) {
              setSeatStatus(seatsData);
            }
            if (seatsData && seatsData.timeRanges) {
              setSelectedTimeRanges(seatsData.timeRanges);
            }
          });
        });

        const timeRangesRef = databaseRef(db, `timeranges/${user.uid}`);
        onValue(timeRangesRef, (snapshot) => {
          const timeRangesData = snapshot.val();

          if (timeRangesData) {
            // Convert the object to an array of options for react-select
            const timeRangesArray = Object.values(timeRangesData).map((value) => ({
              value,
              label: value,
            }));

            setSelectedTimeRanges(timeRangesArray);
          }
        });

      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/Home-admin');
  };

  const handleScannerButtonClick = () => {
    window.open('http://127.0.0.1:5000', '_blank');
  };

  const handleSeatStatusChange = (seatNumber) => {
    setSeatStatus((prevStatus) => ({
      ...prevStatus,
      [seatNumber]: !prevStatus[seatNumber],
    }));
  };

  const handleSubmitSeatStatus = () => {
    const { uid } = auth.currentUser;
    const db = getDatabase();

    const userSeatsRef = databaseRef(db, `userSeats/${uid}`);
    set(userSeatsRef, { ...seatStatus, timeRanges: selectedTimeRanges })
      .then(() => {
        alert('Seat status submitted successfully!');
      })
      .catch((error) => {
        console.error('Error updating seat status:', error.message);
      });
  };

  const handleSubmitTimeRanges = () => {
    const { uid } = auth.currentUser;
    const db = getDatabase();

    const timeRangesObject = selectedTimeRanges.reduce((acc, timeRange, index) => {
      acc[index] = timeRange.value; // Assuming 'value' contains the time range string
      return acc;
    }, {});

    const timeRangesRef = databaseRef(db, `timeranges/${uid}`);
    set(timeRangesRef, timeRangesObject)
      .then(() => {
        alert('Time ranges submitted successfully!');
      })
      .catch((error) => {
        console.error('Error updating time ranges:', error.message);
      });
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setNewProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    const { uid } = auth.currentUser;
    const db = getDatabase();

    const adminRef = databaseRef(db, `admin/${uid}`);
    update(adminRef, newProfile)
      .then(() => {
        alert('Profile updated successfully!');
        setEditingProfile(false);
      })
      .catch((error) => {
        console.error('Error updating profile:', error.message);
      });
  };

  const handleCancelEditProfile = () => {
    setEditingProfile(false);
    setNewProfile({
      name: adminUser ? adminUser.name : '',
      description: adminUser ? adminUser.description : '',
      place: adminUser ? adminUser.place : '',
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h2>Welcome to the Admin Dashboard</h2>
        {adminUser && (
          <div>
            <p>Email: {adminUser.email}</p>
            <p>UID: {auth.currentUser.uid}</p>
            <p>Role: {adminUser.role}</p>
            {editingProfile ? (
              <div>
                <h3>Edit Profile</h3>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={newProfile.name}
                    onChange={handleProfileChange}
                  />
                </label>
                <br />
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={newProfile.description}
                    onChange={handleProfileChange}
                  />
                </label>
                <br />
                <label>
                  Place:
                  <input
                    type="text"
                    name="place"
                    value={newProfile.place}
                    onChange={handleProfileChange}
                  />
                </label>
                <br />
                <button type="button" onClick={handleSaveProfile}>
                  Save
                </button>
                <button type="button" onClick={handleCancelEditProfile}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p>Name: {adminUser.name}</p>
                <p>Description: {adminUser.description}</p>
                <p>Place: {adminUser.place}</p>
                <button type="button" onClick={handleEditProfile}>
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}
        <label>
          Select Time Ranges:
          <Select
            isMulti
            options={timeOptions}
            value={selectedTimeRanges}
            onChange={(selectedOptions) => {
              setSelectedTimeRanges(selectedOptions);
            }}
          />
        </label>
        <button type="button" onClick={handleSubmitTimeRanges}>Submit Time Ranges</button>

        <div>
          <h3>Seat Status</h3>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {[1, 2, 3, 4, 5].map((seatNumber) => (
              <div key={`seat${seatNumber}`} style={{ marginRight: '10px' }}>
                <label>
                  Seat {seatNumber}:
                  <input
                    type="checkbox"
                    checked={seatStatus[`seat${seatNumber}`]}
                    onChange={() => handleSeatStatusChange(`seat${seatNumber}`)}
                  />
                </label>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {[6, 7, 8, 9, 10].map((seatNumber) => (
              <div key={`seat${seatNumber}`} style={{ marginRight: '10px' }}>
                <label>
                  Seat {seatNumber}:
                  <input
                    type="checkbox"
                    checked={seatStatus[`seat${seatNumber}`]}
                    onChange={() => handleSeatStatusChange(`seat${seatNumber}`)}
                  />
                </label>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleSubmitSeatStatus}>Submit Seat Status</button>
        </div>
        <button type="button" onClick={handleScannerButtonClick}>Scanner</button>
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
