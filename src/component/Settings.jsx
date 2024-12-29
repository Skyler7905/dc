import React from "react";

function Settings({ onClose }) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="settings-content">
        <div className="settings-category">
          <h3>Account</h3>
          <ul>
            <li>Profile</li>
            <li>Privacy & Safety</li>
            <li>Authorized Apps</li>
            <li>Connections</li>
          </ul>
        </div>
        <div className="settings-category">
          <h3>User Settings</h3>
          <ul>
            <li>My Account</li>
            <li>Appearance</li>
            <li>Accessibility</li>
            <li>Voice & Video</li>
            <li>Notifications</li>
            <li>Keybinds</li>
            <li>Language</li>
          </ul>
        </div>
        <div className="settings-category">
          <h3>App Settings</h3>
          <ul>
            <li>Text & Images</li>
            <li>Overlay</li>
            <li>Notifications</li>
            <li>Keybinds</li>
            <li>Appearance</li>
            <li>Accessibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Settings;