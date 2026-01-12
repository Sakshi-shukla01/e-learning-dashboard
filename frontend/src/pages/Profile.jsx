import React, { useState, useEffect } from "react";
import API_URL from "../api";
import "../assets/styles.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    password: "",
    dob: "",
    education: "",
    institution: "",
    contact: "",
    country: "",
    bio: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setForm({
            name: data.name || "",
            dob: data.dob ? data.dob.substring(0, 10) : "",
            education: data.education || "",
            institution: data.institution || "",
            contact: data.contact || "",
            country: data.country || "",
            bio: data.bio || "",
            password: "",
          });
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Profile updated successfully!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        <form onSubmit={handleUpdate}>
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Email</label>
          <input value={user.email} disabled />

          <label>Date of Birth</label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} />

          <label>Education Level</label>
          <input
            type="text"
            name="education"
            placeholder="e.g., B.Tech in Computer Science"
            value={form.education}
            onChange={handleChange}
          />

          <label>Institution</label>
          <input
            type="text"
            name="institution"
            placeholder="e.g., IIT Delhi"
            value={form.institution}
            onChange={handleChange}
          />

          <label>Contact Number</label>
          <input
            type="text"
            name="contact"
            placeholder="+91 9876543210"
            value={form.contact}
            onChange={handleChange}
          />

          <label>Country</label>
          <input
            type="text"
            name="country"
            placeholder="e.g., India"
            value={form.country}
            onChange={handleChange}
          />

          <label>Bio / About Me</label>
          <textarea
            name="bio"
            placeholder="Write something about yourself..."
            value={form.bio}
            onChange={handleChange}
            rows="3"
          />

          <label>Change Password (optional)</label>
          <input
            type="password"
            name="password"
            placeholder="New password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit">💾 Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
