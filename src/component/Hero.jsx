import React from 'react';

function Hero() {
  return (
    <div className="bg-discord_blue pb-8 md:pb-0">
      <div className="p-7 py-9 h-screen md:h-[83vh] md:flex relative">
        <div className="flex flex-col gap-7 md:max-w-md lg:max-w-none lg:justify-center">
          <h1 className="text-5xl text-white font-bold leading-tight">
            Your place to talk
          </h1>
          <h2 className="text-white text-lg font-light tracking-wide lg:max-w-3xl w-full">
            Whether you’re part of a school club, gaming group, worldwide art
            community, or just a handful of friends that want to spend time
            together, NexusX makes it easy to talk every day and hang out more
            often. <a href="http://localhost:3000">call</a>
          </h2>
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row md:items-start sm:items-center gap-6">
            <button className="bg-white w-60 font-medium flex items-center justify-center rounded-full p-4 text-lg hover:shadow-2xl hover:text-discord_blurple focus:outline-none transition duration-200 ease-in-out">
              Download NexusX
            </button>
            <button className="bg-gray-900 text-white w-72 font-medium flex items-center justify-center rounded-full p-4 text-lg hover:shadow-2xl hover:bg-gray-800 focus:outline-none transition duration-200 ease-in-out">
              Open NexusX in your browser
            </button>
          </div>
        </div>
        <div className="flex-grow relative mt-16 md:mt-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Ex6GvUYPfLnjISog_qNSkmqNArljchTkCg&s"
            alt="Discord illustration"
            className="absolute left-1/2 transform -translate-x-1/2 md:hidden"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Ex6GvUYPfLnjISog_qNSkmqNArljchTkCg&s"
            alt="Discord illustration"
            className="hidden md:inline absolute right-0 top-0"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;