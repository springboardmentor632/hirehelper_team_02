import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Settings.css";
import Notification from "./Notification";
import API from "../api";

const DEFAULT_USER_ICON =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470";

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  /* ================= USER ================= */
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [profilePhoto, setProfilePhoto] = useState(
    user.profileImage || DEFAULT_USER_ICON
  );

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phoneNumber || "");
  const [bio, setBio] = useState(user.bio || "");
  const [selectedFile, setSelectedFile] = useState(null);

  /* ================= PROFILE COMPLETION ================= */
  const [profilePercent, setProfilePercent] = useState(0);

  const passwordUpdatedAt = user.passwordUpdatedAt;

  const [showChangePassword, setShowChangePassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [originalUser, setOriginalUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });


  useEffect(() => {
    let completed = 0;
    if (firstName) completed++;
    if (lastName) completed++;
    if (email) completed++;
    if (phone) completed++;
    if (bio) completed++;
    if (profilePhoto && profilePhoto !== DEFAULT_USER_ICON) completed++;

    const percent = Math.round((completed / 6) * 100);
    setProfilePercent(percent);
  }, [firstName, lastName, email, phone, bio, profilePhoto]);

  /* ================= SYNC ================= */
  useEffect(() => {
    const refresh = () => {
      const u = JSON.parse(localStorage.getItem("user")) || {};
      setUser(u);
      setProfilePhoto(u.profileImage || DEFAULT_USER_ICON);
      setFirstName(u.firstName || "");
      setLastName(u.lastName || "");
      setEmail(u.email || "");
      setPhone(u.phoneNumber || "");
      setBio(u.bio || "");
    };
    window.addEventListener("profileUpdated", refresh);
    return () => window.removeEventListener("profileUpdated", refresh);
  }, []);

  /* ================= IMAGE ================= */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setProfilePhoto(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setProfilePhoto(DEFAULT_USER_ICON);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phoneNumber", phone);
      formData.append("bio", bio);

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const res = await API.put("/auth/update-profile", formData);
      const updatedUser = res.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("profileUpdated"));

      setProfilePhoto(updatedUser.profileImage || DEFAULT_USER_ICON);
      setBio(updatedUser.bio || "");
      setSelectedFile(null);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Profile update failed");
    }
  };
  const handleCancel = () => {
    setFirstName(originalUser.firstName || "");
    setLastName(originalUser.lastName || "");
    setEmail(originalUser.email || "");
    setPhone(originalUser.phoneNumber || "");
    setBio(originalUser.bio || "");
    setProfilePhoto(originalUser.profileImage || DEFAULT_USER_ICON);
    setSelectedFile(null);
  };

  const getTimeAgo = (date) => {
    if (!date) return "Never updated";
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };
  const handlePasswordChange = async () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const res = await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      // 🔥 Update password timestamp in localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        passwordUpdatedAt: res.data.passwordUpdatedAt,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);


      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSaved(true);

      setTimeout(() => {
        setPasswordSaved(false);
        setShowChangePassword(false);
      }, 2000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Password update failed"
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await API.delete("/auth/delete-account", {
        data: {
          password: deletePassword,   // input from popup
        },
      });

      alert("Account deleted successfully");

      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Account deletion failed");
    }
  };



  return (
 <div className="settings-layout settings-page">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <div className="settings-content">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>

        <div className="settings-header">
          <div>
            <h2>Settings</h2>
            <p>Manage your profile and account preferences</p>
          </div>
          <Notification />
        </div>

        {/* ===== PROFILE CARD ===== */}
        <div className="profile-card">
          <div
            className="profile-cover"
            style={{ backgroundImage: `url(${DEFAULT_COVER})` }}
          />

          <div className="profile-info">
            <div className="profile-img-wrapper" style={{ width: "110px", height: "110px" }}>
              <img src={profilePhoto} alt="profile" />
            </div>

            <div className="profile-text">
              <div className="profile-actions">
                <button className="profile-action-btn" onClick={() => fileInputRef.current.click()}>
                  Change Photo
                </button>
                <button className="profile-action-btn remove" onClick={handleRemovePhoto}>
                  Remove
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handlePhotoChange}
              />

              <h4>{firstName} {lastName}</h4>
              <p>{email}</p>
              {phone && <p className="profile-sub">📞 {phone}</p>}
              {bio && <p className="profile-bio">“{bio}”</p>}
            </div>

            <div className="profile-progress">
              <span>Profile Completion</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${profilePercent}%` }}
                />
              </div>
              <span className="percent">{profilePercent}%</span>
            </div>
          </div>
        </div>

        {/* ===== PROFILE FORM ===== */}
        <div className="settings-card">
          <h3>Profile Information</h3>

          <div className="form-row name-row">
            <div className="form-group">
              <label>First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Bio (Optional)</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="save-btn-wrapper">
            <button className="primary-btn" onClick={handleSave}>
              Save Changes
            </button>
            <button
                className="cancel-btn"
                onClick={() => handleCancel(false)}
              >
                Cancel
              </button>
          </div>

          {saved && <p className="save-msg">✔ Changes saved successfully</p>}


        </div>
        {/* ===== ACCOUNT SECURITY CARD ===== */}
        <div className="settings-card security-card">
          <h3 style={{ fontWeight: "700" }}>Account Security</h3>


          <div className="security-row-box">
            <div>
              <p className="security-title">Password</p>
              <p className="security-sub">
                Last updated {getTimeAgo(passwordUpdatedAt)}
              </p>

            </div>

            <button
              className="security-action-btn"
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </button>

          </div>
        </div>
        {showChangePassword && (
          <div className="settings-card change-password-card">
            <h3 className="change-password-title">Change Password</h3>

            {/* CURRENT PASSWORD (NO EYE) */}
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            {/* NEW PASSWORD */}
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
                  <i className={showNewPassword ? "fa fa-eye" : "fa fa-eye-slash"} />
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group password-group">
              <label>Re-enter New Password</label>
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={showConfirmPassword ? "fa fa-eye" : "fa fa-eye-slash"} />
                </button>
              </div>
            </div>

            {passwordError && <p className="error-msg">{passwordError}</p>}
            {passwordSaved && <p className="save-msg">✔ Password updated</p>}

            <div className="save-btn-wrapper">
              <button className="primary-btn" onClick={handlePasswordChange}>
                Update Password
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </button>
            </div>
          </div>

        )}
        {/* ===== DELETE ACCOUNT CARD ===== */}
        <div className="settings-card delete-account-card">
          <h3 style={{ fontWeight: "700", color: "#b91c1c" }}>Delete Account</h3>
          <p className="delete-text">
            If you wish to no longer use our services, you can delete your account permanently.
          </p>

          <button
            className="delete-account-btn"
            onClick={() => setShowDeletePopup(true)}
          >
            Delete Account
          </button>
        </div>

        {showDeletePopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Delete Account</h3>
              <p>
                Are you sure you want to delete your account linked to
                <b> {user.email}</b>?
              </p>
              <input
                type="password"
                placeholder={`Enter password for ${user?.email || "your account"}`}
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />



              {deleteError && <p className="error-msg">{deleteError}</p>}

              <div className="popup-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowDeletePopup(false);
                    setDeletePassword("");
                    setDeleteError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="confirm-delete-btn"
                  onClick={async () => {
                    if (!deletePassword) {
                      setDeleteError("Password is required");
                      return;
                    }

                    try {
                      await API.delete("/auth/delete-account", {
                        data: { password: deletePassword },
                      });

                      localStorage.clear();
                      window.location.href = "/login";
                    } catch (err) {
                      setDeleteError(
                        err.response?.data?.message || "Delete failed"
                      );
                    }
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
