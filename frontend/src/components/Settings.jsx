import React, { useEffect, useCallback, useState, useRef } from "react";
import { FaPencilAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Notification from "./Notification";
import "../styles/Settings.css";

const DEFAULT_USER_ICON =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Profile and Cover images
  const [profileImg, setProfileImg] = useState(
    "https://randomuser.me/api/portraits/men/32.jpg"
  );
  const [coverImg, setCoverImg] = useState(DEFAULT_COVER);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  // Password values
  // const [currentPassword, setCurrentPassword] = useState("Scott@123");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Eye toggle states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handlers
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file));
      setIsProfileModalOpen(false);
    }
  };
  const handleRemoveProfile = () => {
    setProfileImg(DEFAULT_USER_ICON);
    setIsProfileModalOpen(false);
  };
  
/* ============ PROFILE SAVE / CANCEL ============ */
  const handleSaveProfile = () => {
    setError("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // TODO: call update profile API here
  };

  const handleCancelProfile = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
  
    setAddress("");
    setBio("");
    setError("");
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");

/* ============ PASSWORD SAVE / CANCEL ============ */
  const handleSavePass = () => {
  setError("");

  if (!currentPassword || !newPassword || !confirmPassword) {
    setError("All password fields are required");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("New Password and Confirm Password must match");
    return;
  }

  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");

  setSaved(true);
  setTimeout(() => setSaved(false), 2000);

  //Api form backend
};
const handleCancelPass = () => {
  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");
  setError("");
};

  return (
    <div className="settings-page">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <div className="settings-content">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <div className="settings-header">
          <div className="header-left">
            <h2>Settings</h2>
            <p>Welcome to your data insights hub</p>
          </div>
          <Notification />
        </div>

        {/* PROFILE CARD */}
        <div className="profile-card">
          <div
            className="profile-cover"
            style={{ backgroundImage: `url(${coverImg})` }}
          >

          </div>

          <div className="profile-info">
            <div
              className="profile-img-wrapper"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <img src={profileImg} className="profile-img" alt="profile" />
            </div>
            
            <div className="profile-text">
              <h4>Scott Mcdaniel</h4>
              <p>scott.mcdaniel@sm.com</p>
            </div>

            <div className="profile-progress">
              <span>Profile Completion</span>
              <div className="progress-bar">
                <div className="progress-fill" />
              </div>
              <span className="percent">90%</span>
            </div>
          </div>
        </div>

        {/* PROFILE IMAGE MODAL */}
        {isProfileModalOpen && (
          <div className="image-modal">
            <div className="modal-content">
              <div className="profile-preview-wrapper">
                <img src={profileImg} alt="Profile Preview" className="profile-preview" />
              </div>
              <div className="modal-actions">
                <input
                  type="file"
                  id="uploadProfile"
                  hidden
                  accept="image/*"
                  onChange={handleProfileChange}
                />
                <label htmlFor="uploadProfile" className="modal-btn modal-upload">
                  Upload
                </label>
                <button
                  className="modal-btn modal-remove"
                  onClick={handleRemoveProfile}
                >
                  Remove
                </button>
                <button
                  className="modal-btn modal-close"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="spacerv"></div>

        {/* PERSONAL INFORMATION */}
        <div className="settings-card">

          <fieldset className="profile-fieldset">
              <legend>Profile Information</legend>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input placeholder="Enter Last Name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input placeholder="Enter Phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}/>
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input placeholder="Enter Address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}/>
              </div>

              <div className="form-group">
                <label>Bio (Optional)</label>
                <textarea placeholder="Enter Bio" 
                value={bio}
                onChange={(e) => setBio(e.target.value)}/>
              </div>
            </fieldset>

              {/* {error && <p className="error-msg">{error}</p>} */}

          <div className="save-btn-wrapper">
            <button className="primary-btn" onClick={handleSaveProfile}>
              Save Changes
            </button>
            <div className="spacer"></div>
            <button type="button" className="cancel-btn" onClick={handleCancelProfile}>
              Cancel
            </button>

          </div>

          {/* {saved && <p className="save-msg">✔ Changes saved successfully</p>} */}
          <div className="spacerv"></div>

          
           {saved && <p className="save-msg">✔ Changes saved successfully</p>}
            {error && <p className="error-msg">{error}</p>}
          

        </div>

        <div className="spacerv"></div>
        
        {/* PASSWORD============================================ */}
        <div className="settings-card">
          <fieldset className="profile-fieldset">
            <legend>Change Password</legend>

            <div className="form-group password-group">
              <label>Current Password</label>
              <div className="password-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  // readOnly
                />
                <button
                  type="button"
                  className="settings-pw-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <i
                    className={
                      showCurrentPassword ? "fa fa-eye" : "fa fa-eye-slash"
                    }
                  />
                </button>
              </div>
            </div>

            <div className="form-group password-group">
              <label>New Password</label>
              <div className="password-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="settings-pw-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <i
                    className={
                      showNewPassword ? "fa fa-eye" : "fa fa-eye-slash"
                    }
                  />
                </button>
              </div>
            </div>

            <div className="form-group password-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="settings-pw-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <i
                    className={
                      showConfirmPassword ? "fa fa-eye" : "fa fa-eye-slash"
                    }
                  />
                </button>
              </div>
            </div>
          </fieldset>
          
          <div className="save-btn-wrapper">
            <button className="primary-btn" onClick={handleSavePass}>
              Update
            </button>
            <div className="spacer"></div>
            <button type="button" className="cancel-btn" onClick={handleCancelPass}>
              Cancel
            </button>

          </div>
          
          <div className="spacerv"></div>
          </div>
           <div className="spacerv"></div>
           
        {/* DELETE ACCOUNT ================================ */}
          <div className="settings-card">
            <h3><b>Delete Account</b></h3>
            <hr style={{marginTop:"-15px"}}/>
            <p>
              if you wish to no longer use our services, you can delete your account permanently.
            </p>
          <button 
          className="delete-account-btn"
          onClick={() => setShowDeletePopup(true)}
          >Delete Account</button>
          </div>

          {showDeletePopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3><b>Delete Account</b></h3>
              <hr />
              <p>
                Are you sure you want to delete your account linked to<br />
                <b><u>scott.mcdaniel@sm.com</u></b>? 
              </p>

              <div className="popup-actions">
                <button className="cancel-btn" onClick={() => setShowDeletePopup(false)}>
                  Cancel
                </button>

                <button 
                  className="confirm-delete-btn"
                  onClick={() => {
                    deleteAcc();
                    setShowDeletePopup(false);
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;
