import React, { Component } from 'react';

import { Button } from 'antd';

import 'antd/dist/antd.css';
import './Zune.css'

let player:Spotify.SpotifyPlayer;
const token = 'BQBWDtEU4UddAik38pbZFzvb_3tnK767ipt-cPql--vhwSxTTfwoaYJpy3bA5YE66ZbLCDT0_ExqPyRBD7NJqXYd2LwuwW7CWAgnuh9dC4psIOeIMr_8QafTkh-BYfBDHJ0wIr0XNg8IZDuKAaD03oVmPKNnfhJZHO2LrYs';

const setupPlayer = (token:string):Spotify.SpotifyPlayer => { 
    window.onSpotifyWebPlaybackSDKReady = () => {
            player = new Spotify.Player({
            name: 'Get in the Zune',
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
        setupPlayer(token)
    }

    render() {
        const loginButton = () => {

        }
        return (
          
            <div className="Zune">
                <div className='border'>
                    <div className='screen'>
                        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img height='200' src='./zune.svg' />
                            <Button type='primary' href={this.authUrl()} >Login</Button>
                        </div>
                    </div>
                </div>
                <div className='controls'>
                    <div className='control back'><i className="fas fa-arrow-left"></i></div>
                    <div className='control wheel'></div>
                    <button type='button' onClick={()=>{console.log('asd'); this.togglePlayer(player)}} className='control toggle'><i className="fas fa-play"></i></button>
                </div>
            </div>
        );
    }

    private authUrl = () => {
        //Logic that builds the url and returns it
      const my_client_id = 'fae22fc460a642acab61b10f6cc1cb77';
      const redirect_uri = 'http://localhost:3000/';
      var scopes = 'user-read-private user-read-email';
      const url = 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri);
      return url
  
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

    private loginButton = () => {
      const my_client_id = 'fae22fc460a642acab61b10f6cc1cb77';
      const redirect_uri = 'http://localhost:3000/';
      var scopes = 'user-read-private user-read-email';
      const url = 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri);
      console.log('asd')
      return (
        <a type='button' href={url}>
          LOGIN
        </a>
      )
    }
}

export default Zune;
