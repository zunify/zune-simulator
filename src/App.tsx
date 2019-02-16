import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let player:Spotify.SpotifyPlayer;

const setupPlayer = () => { 
  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQAFqwRFc-F6WEkJA-R_SdxJ6CLiKSYQWbhtOOBUQUT3eayzFCtg8MbxEtlUS7AtLsmsxRBB4eOJd-mDaDAZJrgSZxpVBYhjwKlWGpOy8I1N9Y8VTy2YJCrlN0gKZg1x8SLSKqaGjhfnpUkdY0ip0VpBkukw-k_mLpC0XsY';
    player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); }
  });
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
  };
}
const startPlayback = (player: Spotify.SpotifyPlayer) => { 
  player.connect();
}

const nextTrack = (player: Spotify.SpotifyPlayer) => { 
  player.nextTrack();
  console.log('Skipped to next track!');
}

const prevTrack = (player: Spotify.SpotifyPlayer) => { 
  player.previousTrack();
  console.log('Set to previous track!');
}

const togglePlayer = async (player: Spotify.SpotifyPlayer) => {
  player.togglePlay();
  const state = await player.getCurrentState(); //force this request to complete
  console.log(state ? state.paused : null);
} 


class App extends Component {
  render() {
    return (
      <div className="App">
        {setupPlayer()};
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <button type='button' onClick={()=>{startPlayback(player)}}>START</button>

        <button type='button' onClick={()=>{togglePlayer(player)}}>PLAY/PAUSE</button>
        <button type='button' onClick={()=>{nextTrack(player)}}>NEXT</button>
        <button type='button' onClick={()=>{prevTrack(player)}}>PREVIOUS</button>
      </div>
    );
  }
}

export default App;
