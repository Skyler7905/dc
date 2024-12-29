import { ChevronDownIcon, PlusIcon } from "@heroicons/react/outline";
import { MicrophoneIcon, PhoneIcon, CogIcon } from "@heroicons/react/solid";
import Channel from "./Channel";
import ServerIcon from "./ServerIcon";
import Chat from "./Chat";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { Navigate, useParams } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, addDoc } from "firebase/firestore";

function Home() {
  const [user] = useAuthState(auth);
  const { id } = useParams(); // Get the channel ID from the URL

  // Create a query for the "channels" collection and order by "channelName" (optional)
  const channelsQuery = query(collection(db, "channels"), orderBy("channelName"));

  // Fetch the channels using the useCollection hook
  const [channels, loading, error] = useCollection(channelsQuery);

  // Handle adding a new channel
  const handleAddChannel = async () => {
    const channelName = prompt("Enter a new channel name");

    if (channelName && channelName.trim() !== "") {
      try {
        await addDoc(collection(db, "channels"), {
          channelName: channelName,
        });
      } catch (error) {
        console.error("Error adding channel: ", error);
      }
    } else {
      alert("Please enter a valid channel name");
    }
  };

  if (!user) {
    return <Navigate to="/" />; // Redirect to login if no user is authenticated
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <div className="flex flex-col space-y-3 bg-[#202225] p-3 min-w-max">
        <div className="server-default hover:bg-discord_purple">
          <img src="https://preview.redd.it/g6003su6ug9e1.png?auto=webp&s=e13cb3bd1fda95d043e11869b802d17bc4148d9b " alt="Server Logo" className="h-5" />
        </div>
        <hr className="border-gray-700 border w-8 mx-auto" />
        <ServerIcon image="https://rb.gy/qidcpp" />
        <ServerIcon image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8KcPW7zH09DDgLkFV4w2TeniiHTS_YOoyaA&s" />
        <ServerIcon image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfa5jIm2fUc2M0QLq-TM8qLLthgJy2U1wLvQ&s" />
        <ServerIcon image="https://rb.gy/zxo0lz" />

        <div className="server-default hover:bg-discord_green group">
          <PlusIcon className="text-discord_green h-7 group-hover:text-white" onClick={handleAddChannel} />
        </div>
      </div>

      {/* Main Server Section */}
      <div className="bg-[#2f3136] flex flex-col min-w-max">
        <h2 className="flex text-white font-bold text-sm items-center justify-between border-b border-gray-800 p-4 hover:bg-[#34373C] cursor-pointer">
          Official NexusX Server... <ChevronDownIcon className="h-5 ml-2" />
        </h2>
        <div className="text-[#8e9297] flex-grow overflow-y-scroll scrollbar-hide">
          <div className="flex items-center p-2 mb-2">
            <ChevronDownIcon className="h-3 mr-2" />
            <h4 className="font-semibold">Channels</h4>
            <PlusIcon
              className="h-6 ml-auto cursor-pointer hover:text-white"
              onClick={handleAddChannel}
            />
          </div>
          <div className="flex flex-col space-y-2 px-2 mb-4">
            {channels?.docs.map((doc) => (
              <Channel
                key={doc.id}
                id={doc.id}
                channelName={doc.data().channelName}
              />
            ))}
          </div>
        </div>

        {/* User and Settings Section */}
        <div className="bg-[#292b2f] p-2 flex justify-between items-center space-x-8">
          <div className="flex items-center space-x-1">
            <img
              src={user?.photoURL}
              alt="User Avatar"
              className="h-10 rounded-full"
              onClick={() => auth.signOut()}
            />
            <h4 className="text-white text-xs font-medium">
              {user?.displayName}{" "}
              <span className="text-[#b9bbbe] block">
                #{user?.uid.substring(0, 4)}
              </span>
            </h4>
          </div>

          <div className="text-gray-400 flex items-center">
            <div className="hover:bg-[#3A3C43] p-2 rounded-md">
              <MicrophoneIcon className="h-5 icon" />
            </div>
            <div className="hover:bg-[#3A3C43] p-2 rounded-md">
              <PhoneIcon className="h-5 icon" />
            </div>
            <div className="hover:bg-[#3A3C43] p-2 rounded-md">
              <CogIcon className="h-5 icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-[#36393f] flex-grow">
        {id ? (
          <Chat channelId={id} /> // Render Chat component only if channelId is available
        ) : (
          <div className="text-center text-white">Select a channel to start chatting</div>
        )}
      </div>
    </div>
  );
}

export default Home;
