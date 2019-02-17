import React, { Component } from 'react';

import { Button } from 'antd';

import 'antd/dist/antd.css';
import './Zune.css'

let player:Spotify.SpotifyPlayer;
const token = 'BQAnRNM0LPlLGHnlhSvk9FWc1gS1qRILDLJG0XsJ1BJTA_v7Wt5LHZ8Shm5vPkj2RUN4g7JtSlEsAx8PChM6G6-ciCVrWJU5_l0EypblmaGs4WUGKq2ByRpp7dyNAu2c5qYZlglgbxCjKIi0R2baT7z5_gB4t58VpNOoOyA';

const setupPlayer = (token:string):Spotify.SpotifyPlayer => { 
    window.onSpotifyWebPlaybackSDKReady = () => {
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
    return player;
}

class Zune extends Component {

    componentDidMount() {
        //setupPlayer(token)
    }

    render() {
        return (
            <div className="Zune">
                <button type='button' onClick={()=>{this.startPlayback(player)}}>START</button>
                <button type='button' onClick={()=>{this.togglePlayer(player)}}>PLAY/PAUSE</button>
                <button type='button' onClick={()=>{this.nextTrack(player)}}>NEXT</button>
                <button type='button' onClick={()=>{this.prevTrack(player)}}>PREVIOUS</button>      
                <div className='border'>
                    <div className='screen'>
                        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img height='200' src='./zune.svg' />
                        </div>
                    </div>
                </div>
                <Button onClick={()=>{console.log('asd')}} type="primary">Primary</Button>

                <div className='controls'>
                    <div className='control back'><i className="fas fa-arrow-left"></i></div>
                    <div className='control wheel'></div>

                    <button type='button' onClick={()=>{console.log('asd')}} className='control toggle'><i className="fas fa-play"></i></button>
                </div>
                {player && <script src="https://sdk.scdn.co/spotify-player.js"></script>}
            </div>
        );
    }

    private startPlayback = (player: Spotify.SpotifyPlayer) => { 
        console.log('asd')
        player.connect();
      }
      
    private nextTrack = (player: Spotify.SpotifyPlayer) => { 
        player.nextTrack();
        console.log('Skipped to next track!');
      }
      
    private prevTrack = (player: Spotify.SpotifyPlayer) => { 
        player.previousTrack();
        console.log('Set to previous track!');
      }
      
    private togglePlayer = async (player: Spotify.SpotifyPlayer) => {
        player.togglePlay();
        const state = await player.getCurrentState(); //force this request to complete
        console.log(state ? state.paused : null);
    } 
}

export default Zune;
