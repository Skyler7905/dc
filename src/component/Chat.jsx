import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { HashtagIcon, SearchIcon } from "@heroicons/react/outline";
import {
  BellIcon,
  ChatIcon,
  UsersIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  PlusCircleIcon,
  GiftIcon,
  EmojiHappyIcon,
  MicrophoneIcon,
  PhoneIcon,
  CogIcon,
  VolumeOffIcon,
} from "@heroicons/react/solid";
import { selectChannelId, selectChannelName } from "../features/channelSlice";
import { auth, db } from "../../firebase";
import Message from "./Message";
import { collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import Picker from "emoji-picker-react";
import Settings from "./Settings";

function Chat() {
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  const [user] = useAuthState(auth);
  const inputRef = useRef("");
  const chatRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [image, setImage] = useState(null);

  const messagesQuery = channelId
    ? query(collection(db, "channels", channelId, "messages"), orderBy("timestamp", "asc"))
    : null;

  const [messages] = useCollection(messagesQuery);

  const scrollToBottom = () => {
    chatRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (inputRef.current.value !== "" || image) {
      await addDoc(collection(db, "channels", channelId, "messages"), {
        timestamp: serverTimestamp(),
        message: inputRef.current.value,
        name: user?.displayName,
        photoURL: user?.photoURL,
        email: user?.email,
        image: image,
      });
    }

    inputRef.current.value = "";
    setImage(null);
    scrollToBottom();
  };

  const onEmojiClick = (event, emojiObject) => {
    inputRef.current.value += emojiObject.emoji;
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    const audio = new Audio(isMuted ? "/unmute-sound.mp3" : "/mute-sound.mp3");
    audio.play();
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between space-x-5 border-b border-gray-800 p-4 -mt-1">
        <div className="flex items-center space-x-1">
          <HashtagIcon className="h-6 text-[#72767d]" />
          <h4 className="text-white font-semibold">{channelName}</h4>
        </div>
        <div className="flex space-x-3">
          <BellIcon className="icon" />
          <ChatIcon className="icon" onClick={() => setShowFriends(true)} />
          <UsersIcon className="icon" />
          <div className="flex bg-[#202225] text-xs p-1 rounded-md">
            <input
              type="text"
              placeholder="Search"
              className="bg-[#202225] focus:outline-none text-white pl-1 placeholder-[#72767d]"
            />
            <SearchIcon className="h-4 text-[#72767d] mr-1" />
          </div>
          <InboxIcon className="icon" />
          <QuestionMarkCircleIcon className="icon" onClick={() => setShowCard(true)} />
          <CogIcon className="icon" onClick={() => setShowSettings(true)} />
        </div>
      </header>
      <main className="flex-grow overflow-y-scroll scrollbar-hide">
        {messages?.docs.map((doc) => {
          const { message, timestamp, name, photoURL, email, image } = doc.data();

          return (
            <Message
              key={doc.id}
              id={doc.id}
              message={message}
              timestamp={timestamp}
              name={name}
              email={email}
              photoURL={photoURL}
              image={image}
            />
          );
        })}
        <div ref={chatRef} className="pb-16" />
      </main>
      <div className="flex items-center p-2.5 bg-[#40444b] mx-5 mb-7 rounded-lg">
        <PlusCircleIcon className="icon mr-4" onClick={() => document.getElementById('imageInput').click()} />
        <form className="flex-grow" onSubmit={sendMessage}>
          <input
            type="text"
            disabled={!channelId}
            placeholder={
              channelId ? `Message #${channelName}` : "Select a channel"
            }
            className="bg-transparent focus:outline-none text-[#dcddde] w-full placeholder-[#72767d] text-sm"
            ref={inputRef}
          />
          <button hidden type="submit">
            Send
          </button>
        </form>
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <GiftIcon className="icon mr-2" />
        <EmojiHappyIcon className="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
        {showEmojiPicker && (
          <Picker
            onEmojiClick={onEmojiClick}
            pickerStyle={{ position: "absolute", bottom: "60px", right: "20px" }}
          />
        )}
        {isMuted ? (
          <VolumeOffIcon className="h-6 text-gray-400 cursor-pointer" onClick={toggleMute} />
        ) : (
          <MicrophoneIcon className="h-6 text-gray-400 cursor-pointer" onClick={toggleMute} />
        )}
        <a href="http://localhost:3000">
          <PhoneIcon className="h-6 text-gray-400 cursor-pointer" />
        </a>
      </div>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showCard && (
        <div className="card-details">
          <h2 >Himanshu Singh</h2>
          <p>MCA 3rd Sem</p>
          <p>This is my full stack project This is the project made by Himanshu Singh by using the Mern & other libraries </p>
          <button onClick={() => setShowCard(false)}>Close</button>
        </div>
      )}
      {showFriends && (
        <div className="friends-panel">
          <h2>Friends</h2>
          <div className="friend-card">
            <p>Mamata Singh</p>
            <p>Last message: Testing !</p>
          </div>
          <div className="friend-card">
            <p>Himanshu Singh</p>
            <p>Last message: sdfailjdsfksdj</p>
          </div>
          <div className="friend-card">
            <p>Piyush Testing</p>
            <p>Gadha server work kroo</p>
          </div>
          <div className="friend-card">
            <p>Bot</p>
            <p>Last message: testing working </p>
          </div>
          <button onClick={() => setShowFriends(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Chat;