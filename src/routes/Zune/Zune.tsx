import React, { Component } from 'react';


import './Zune.css'


let player:Spotify.SpotifyPlayer;

class Zune extends Component {

    componentDidMount() {
        this.setupPlayer()
    }

    render() {
        return (
            <div className="Zune">
                <div className='border'>
                    <div className='screen'>
                        screen
                    </div>
                </div>
                <div className='controls'>
                    <div className='control back'></div>
                    <div className='control wheel'></div>
                    <div className='control toggle'></div>
                </div>
                <button type='button' onClick={()=>{this.startPlayback(player)}}>START</button>
                <button type='button' onClick={()=>{this.togglePlayer(player)}}>PLAY/PAUSE</button>
                <button type='button' onClick={()=>{this.nextTrack(player)}}>NEXT</button>
                <button type='button' onClick={()=>{this.prevTrack(player)}}>PREVIOUS</button>            
            </div>
        );
    }

    private setupPlayer = () => { 
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
            return player
        };
    }

    private startPlayback = (player: Spotify.SpotifyPlayer) => { 
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
