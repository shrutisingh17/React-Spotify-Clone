import putWithToken from "../../utilities/putWithToken";
import axios from "axios";

export function loadScript() {
    const script = document.createElement("script");

    script.id = "spotify-player";
    script.type = "text/javascript";
    script.async = "async";
    script.defer = "defer";
    script.src = "https://sdk.scdn.co/spotify-player.js";

    document.body.appendChild(script);
  }
  
  export function playerInit(player, token, setMessage, setConnectTip, setPlayInfo, setPlayback, setPlaybackState) {
    // console.log("player init");
    player = new window.Spotify.Player({
      name: "Spotify Clone Player",
      getOAuthToken: (cb) => {
        cb(token);
      },
    });

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      setMessage(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      setMessage(message);
    });
    player.addListener("account_error", ({ message }) => {
      setMessage(message);
    });
    player.addListener("playback_error", ({ message }) => {
      setMessage(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", (state) => {
      // console.log(state);
      try {
        const {
          duration,
          position,
          paused,
          shuffle,
          repeat_mode,
          track_window,
        } = state;
        const { current_track } = track_window;

        setPlayInfo(current_track);
        setPlayback(position / duration);
        setPlaybackState((state) => ({
          ...state,
          play: !paused,
          shuffle: shuffle,
          repeat: repeat_mode !== 0,
          progress: position,
          total_time: duration,
        }));
      } catch (error) {
        console.log(error);
      }
    });

    // Ready
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      const tipAccess = localStorage.getItem("tipAccess");
      if (!tipAccess) {
        localStorage.setItem("tipAccess", "true");
        setConnectTip(true);
      }
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    // Connect to the player!
    player.connect();
  }

  export async function apiUpdate(timerRef, token, setMessage, setPlayback, setPlaybackState, setPlayInfo, setVolume, updateState, setConnectTip) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const cancelSource = axios.CancelToken.source();
  
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        },
        cancelToken: cancelSource.token

      });
  
      if (response.status === 200) {
        const {
          repeat_state,
          shuffle_state,
          is_playing,
          progress_ms,
          item,
          device,
        } = response.data;
  
        setPlayback(progress_ms / item.duration_ms);
  
        timerRef.current = setTimeout(() => {
          updateState();
        }, item.duration_ms - progress_ms + 10);
  
        setVolume(device.volume_percent / 100);
        setPlaybackState((state) => ({
          ...state,
          play: is_playing,
          shuffle: shuffle_state,
          repeat: repeat_state !== "off",
          progress: progress_ms,
          total_time: item.duration_ms,
        }));
        setPlayInfo(item);

      } else if (response.status === 204) {
        setMessage("Player is not working, select a device to start listening");
        setConnectTip(true);

      } else {
        setMessage(`ERROR: server response with ${response}. Player feature is unavailable!`);
      }
    } catch (error) {
      console.log(error);
    }
    return cancelSource.cancel;
  }
  
  export function togglePlay(token, source, setMessage, playbackState, setPlaybackState, updateState) {
    const togglePlayLogic = () => {
        const url = playbackState.play
      ? "https://api.spotify.com/v1/me/player/pause"
      : "https://api.spotify.com/v1/me/player/play";
      const request = putWithToken(url, token, source);
      request()
        .then((response) => {
          if (response.status !== 204) {
            setMessage(
              `ERROR: Something went wrong! Server response: ${response}`
            );
          } else {
            setPlaybackState((state) => ({ ...state, play: !state.play }));
            updateState();
          }
        })
        .catch((error) => setMessage(`ERROR: ${error}`));
    };
  
    togglePlayLogic();
  }
  
  export function toggleShuffle(token, source, setMessage, playbackState, setPlaybackState, updateState) {
    const toggleShuffleLogic = () => {
      const request = putWithToken(
        `https://api.spotify.com/v1/me/player/shuffle?state=${!playbackState.shuffle}`,
        token,
        source
      );
      request()
        .then((response) => {
          if (response.status === 204) {
            setMessage(`Shuffle ${playbackState.shuffle ? "Off" : "On"}`);
            setPlaybackState((state) => ({ ...state, shuffle: !state.shuffle }));
            updateState();
          } else {
            setMessage(
              `ERROR: Something went wrong! Server response: ${response.status}`
            );
          }
        })
        .catch((error) => setMessage(`ERROR: ${error}`));
    };
  
    toggleShuffleLogic();
  }
  
  export function toggleRepeat(token, source, setMessage,playbackState, setPlaybackState, updateState) {
    const toggleRepeatLogic = () => {
      const url = playbackState.repeat
        ? "https://api.spotify.com/v1/me/player/repeat?state=off"
        : "https://api.spotify.com/v1/me/player/repeat?state=track";
  
      const request = putWithToken(url, token, source);
      request()
        .then((response) => {
          if (response.status === 204) {
            setMessage(`Repeat Track ${playbackState.repeat ? "Off" : "On"}`);
            setPlaybackState((state) => ({ ...state, repeat: !state.repeat }));
            updateState();
          } else {
            setMessage(
              `ERROR: Something went wrong! Server response: ${response.status}`
            );
          }
        })
        .catch((error) => setMessage(`ERROR: ${error}`));
    };
  
    toggleRepeatLogic();
  }
  
  export function skipNext(token, source, setMessage, updateState) {
    const skipNextLogic = () => {
      const request = putWithToken(
        "https://api.spotify.com/v1/me/player/next",
        token,
        source,
        {},
        "POST"
      );
      request()
        .then((response) => {
          if (response.status !== 204) {
            setMessage(
              `ERROR: Something went wrong! Server response: ${response.status}`
            );
            return;
          }
          updateState();
        })
        .catch((error) => setMessage(`ERROR: ${error}`));
    };
  
    skipNextLogic();
  }
  
  export function skipPrev(token, source, setMessage, updateState) {
    const skipPrevLogic = () => {
      const request = putWithToken(
        "https://api.spotify.com/v1/me/player/previous",
        token,
        source,
        {},
        "POST"
      );
      request()
        .then((response) => {
          if (response.status !== 204) {
            setMessage(
              `ERROR: Something went wrong! Server response: ${response.status}`
            );
            return;
          }
          updateState();
        })
        .catch((error) => setMessage(`ERROR: ${error}`));
    };
  
    skipPrevLogic();
  }
  
  export function seekPlayback(ratio, token, source, setMessage, setPlayback, playbackState, setPlaybackState, setScrubPb, updateState) {
    const time = Math.round(ratio * playbackState.total_time);
    const request = putWithToken(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${time}`,
      token,
      source,
      {}
    );
    request()
      .then((response) => {
        if (response.status === 204) {
          setPlayback(ratio);
          setPlaybackState((state) => ({ ...state, progress: time }));
          updateState();
        } else {
          setMessage(
            `ERROR: Something went wrong! Server response: ${response.status}`
          );
        }
      })
      .catch((error) => setMessage(`ERROR: ${error}`));
  
    setScrubPb(null);
  }
  
  export function seekVolume(ratio, token, source, setVolume, setMessage, setPlaybackState) {
    const integer = Math.round(ratio * 100);
    const request = putWithToken(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${integer}`,
      token,
      source,
      null
    );
    request()
      .then((response) => {
        if (response.status === 204) {
          setVolume(ratio);
          // Update only the volume state without fetching the entire player state
          setPlaybackState((prevState) => ({
            ...prevState,
            volume: ratio,
          }));
        } else {
          setMessage(
            `ERROR: Something went wrong! Server response: ${response.status}`
          );
        }
      })
      .catch((error) => setMessage(`ERROR: ${error}`));
  }
  