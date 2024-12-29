import { HashtagIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Use useNavigate from react-router-dom v6
import { setChannelInfo } from "../features/channelSlice";

function Channel({ id, channelName }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Replace history with navigate

  const setChannel = () => {
    dispatch(
      setChannelInfo({
        channelId: id,
        channelName: channelName,
      })
    );

    // Navigate to the channel's specific page
    navigate(`/channels/${id}`); // Use navigate instead of history.push
  };

  return (
    <div
      className="font-medium flex items-center cursor-pointer hover:bg-[#3A3C43] p-1 rounded-md hover:text-white"
      onClick={setChannel} // Call setChannel on click
    >
      <HashtagIcon className="h-5 mr-2" /> {channelName}
    </div>
  );
}

export default Channel;
