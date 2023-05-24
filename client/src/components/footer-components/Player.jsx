import React, { useState, useEffect, useContext, useImperativeHandle, useRef} from "react";
import { loadScript, playerInit, apiUpdate, togglePlay, toggleShuffle, toggleRepeat, skipNext, skipPrev, seekPlayback, seekVolume } from './PlayerLogic';

import axios from "axios";
import Heartbeat from "react-heartbeat";

import ProgressBar from "./ProgressBar";
import NowPlaying from "./NowPlaying";
import ConnectDevices from "./ConnectDevices";

import msTimeFormat from "../../utilities/utils";
import { useStateContext, MessageContext } from "../../utilities/StateContext";

import {
  RiShuffleLine,
  RiSkipBackFill,
  RiPauseFill,
  RiPlayFill,
  RiSkipForwardFill,
} from "react-icons/ri";
import { FiSpeaker } from "react-icons/fi";
import { BsRepeat, BsVolumeUp } from "react-icons/bs";

const Player = React.forwardRef((props, ref) => {
  const { token } = useStateContext();

  const setMessage = useContext(MessageContext);
  const [playbackState, setPlaybackState] = useState({
    play: false,
    shuffle: false,
    repeat: false,
    progress: 0,
    total_time: 0,
  });

  const [scrubPb, setScrubPb] = useState(null);
  const [playback, setPlayback] = useState(0);
  const [volume, setVolume] = useState(1);
  const [connectTip, setConnectTip] = useState(false);
  const [playInfo, setPlayInfo] = useState({
    album: {},
    artists: [],
    name: "",
    id: "",
  });

  const timerRef = useRef(null);
  let player = useRef(null);  
  const source = axios.CancelToken.source();

  useEffect(() => {
    loadScript();
  	apiUpdate(timerRef, token, setMessage, setPlayback, setPlaybackState, setPlayInfo, setVolume, updateState, setConnectTip)
    window.onSpotifyWebPlaybackSDKReady = () => playerInit(player, token, setMessage, setConnectTip, setPlayInfo, setPlayback, setPlaybackState);

    return () => {
		source.cancel()
      clearTimeout(timerRef.current);
      if (player.current && player.current.disconnect) {
        player.current.disconnect();
      }
    };
  }, []);

  //Reference for parent component to use updateState
	useImperativeHandle(ref, () => ({
		updateState: () => {
			setPlaybackState((state) => ({ ...state, play: true }));
			updateState();
		},
	}));

  //Use for other components to update the player state only if not connected to the web player
	const updateState = () => {
		if (!player.current) {
			apiUpdate(timerRef, token, setMessage, setPlayback, setPlaybackState, setPlayInfo, setVolume, updateState, setConnectTip)
		}
	};

  	function updatePlayback() {
	    const interval = 500 / playbackState.total_time;
	    setPlayback((playback) => playback + interval);
	    setPlaybackState((state) => ({ ...state, progress: state.progress + 500 }));
	  }
	const scrubPlayback = (ratio) => {
		const time = ratio * playbackState.total_time;
		setScrubPb(time);
	};

  // const clickExit = (e) => {
	// 	if (e.target.dataset.source !== "inside" && connectTip==true) {
	// 		setConnectTip(false)
	// 	} 
	// };
  // window.removeEventListener("click", clickExit);


  return (
    <>
      {playbackState.play ? (
				<Heartbeat heartbeatFunction={updatePlayback} heartbeatInterval={500} />
			) : null}
      <div className="player">
        <div className="player-left">
          <NowPlaying playInfo={playInfo} />
        </div>

        <div className="player-center">
          <div className="player-control-buttons">
            <button
              title="Toggle Shuffle"
              className={`control-button ${
                playbackState.shuffle ? "active" : ""
              } no-outline`}
			  onClick={() => toggleShuffle(token, source, setMessage, playbackState, setPlaybackState, updateState)}
			  >
              <RiShuffleLine style={{ width: "18px", height: "18px" }} />
            </button>

            <button
              title="Previous"
              className="control-button x-smaller"
              onClick={() => skipPrev(token, source, setMessage, updateState)}
            >
              <RiSkipBackFill style={{ width: "24px", height: "24px" }} />
            </button>

            <button
              title={playbackState.play ? "Pause" : "Play"}
              className={`control-button ${
                playbackState.play ? "smaller" : "larger"
              } circle-border no-outline`}
			  onClick={() => togglePlay(token, source, setMessage, playbackState, setPlaybackState, updateState)}
			  >
              {playbackState.play ? (
                <RiPauseFill style={{ width: "24px", height: "24px" }} />
              ) : (
                <RiPlayFill style={{ width: "24px", height: "24px" }} />
              )}
            </button>

            <button
              title="Next"
              className="control-button x-smaller no-outline"
			  onClick={() => skipNext(token, source, setMessage, updateState)}
			  >
              <RiSkipForwardFill style={{ width: "24px", height: "24px" }} />
            </button>

            <button
              title="Toggle Repeat"
              className={`control-button ${
                playbackState.repeat ? "active" : ""
              } no-outline`}
			  onClick={() => toggleRepeat(token, source, setMessage, playbackState, setPlaybackState, updateState)}
			  >
              <BsRepeat style={{ width: "18px", height: "18px" }} />
            </button>
          </div>

          <div className="player-playback" draggable="false">
            <div className="playback-time" draggable="false">
              {scrubPb
                ? msTimeFormat(scrubPb)
                : msTimeFormat(playbackState.progress)}
            </div>
            <ProgressBar
              extraClass="playback"
              value={playback}
              engageClass="engage"
              
			  setValue={(ratio) => seekPlayback(ratio, token, source, setMessage, setPlayback, playbackState, setPlaybackState, setScrubPb, updateState)}
              scrubFunction={scrubPlayback}
            />
            <div className="playback-time" draggable="false">
              {msTimeFormat(playbackState.total_time)}
            </div>
          </div>
        </div>

        <div className="player-right">
          <div className="extra-controls">
            <span className="connect-devices-wrapper">
							{connectTip && (
								<ConnectDevices closeTip={() => setConnectTip(false)} />
							)}
							<button
								title="Devices"
								className={`control-button x-larger ${playbackState.play ? 'active' : ''} no-outline`}
								onClick={() => setConnectTip(!connectTip)} >
								<FiSpeaker style={{width: '24px', height: '24px',marginRight:"8px"}} />
							</button>
						</span>

            <div className="volume-control">
              <button
                title="Volume"
                className={`control-button x-larger volume no-outlined`}
              >
                <BsVolumeUp style={{ width: "24px", height: "24px" }} />
              </button>
              <div style={{ width: "100%" }}>
                <ProgressBar
                  extraClass="volume"
                  value={volume}
                  engageClass="engage"
          				setValue={(ratio) => seekVolume(ratio, token, source, setVolume, setMessage, setPlaybackState)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Player;
