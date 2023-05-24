import React from "react";

export default function Login() {
  const handleClick = async () => {
    const client_id = "4faa024196a04619909ee397298b0f43";
    const redirect_uri = "http://localhost:3000/";
    const api_uri = "https://accounts.spotify.com/authorize";
    const scope = [
      "user-read-private",
      "user-read-email",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-top-read",
    ];
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
      " "
    )}&response_type=token&show_dialog=true`;
  };

  return (
    <div className="flex justify-center items-center flex-col h-screen w-screen bg-green-500 gap-3">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png"
        alt="spotify"
        className="h-14"
      />
      <button
        onClick={handleClick}
        className="px-6 py-3 rounded-full bg-gray-900 text-green-500 text-lg border-none cursor-pointer"
      >
        Connect Spotify
      </button>
    </div>
  );
}