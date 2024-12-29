import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase"; // Ensure the Firebase auth and provider are correctly set up

function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();

    signInWithPopup(auth, provider)
      .then(() => navigate("/channels")) // After successful sign-in, navigate to /channels
      .catch((error) => {
        // Handle errors properly
        console.error("Sign-in Error:", error.message);
        alert("Error signing in: " + error.message);
      });
  };

  return (
    <header className="bg-discord_blue flex items-center justify-between py-4 px-6">
      <a href="/">
        <img
          src="https://preview.redd.it/g6003su6ug9e1.png?auto=webp&s=e13cb3bd1fda95d043e11869b802d17bc4148d9b"
          className="w-36 h-14 object-contain bg-blue-700 border-2 border-transparent rounded-full"
          alt="Discord Logo"
        />
      </a>
      <div>
        {user ? (
          <button onClick={() => auth.signOut()} className="text-white">
            Sign Out
          </button>
        ) : (
          <button onClick={signIn} className="text-white">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
