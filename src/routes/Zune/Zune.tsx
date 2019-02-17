import React, { Component } from 'react';

import { Button } from 'antd';

import 'antd/dist/antd.css';
import './Zune.css'

let player:Spotify.SpotifyPlayer;

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
        player.connect().then(success => {
            if (success) {
              console.log('The Web Playback SDK successfully connected to Spotify!');
            }
          })
    };
    return player;
}

type State = {
    token: string | null;
}

class Zune extends Component<{location: any}, State> {
    state = {
        token: null
    }
    componentWillMount() {
        //Check for code in url
        this.setState({token: this.props.location.hash ? this.props.location.hash.split('=')[1]:null})
        console.log(this.props.location)
        if(this.props.location.hash.split('=')[1]){
            setupPlayer(this.props.location.hash.split('=')[1]);
        }
    }

    render() {
        const loginButton = () => {

        }
        return (
            <div className='background'>
                <div className="Zune">
                    <div className='border'>
                        <div className='screen'>
                            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <img height='200' src='./zune.svg' />
                                <Button style={{backgroundColor: '#1ed760', marginTop: '1rem'}} color='green' href={this.authUrl()} >Authorize<i style={{marginLeft: '0.5rem'}} className="fab fa-spotify"></i></Button>
                            </div>
                        </div>
                    </div>
                    <div className='controls'>
                        <div className='control back'><i className="fas fa-arrow-left"></i></div>
                        <div className='control wheel'></div>
                        <button type='button' onClick={()=>{this.togglePlayer(player)}} className='control toggle'><i className="fas fa-play"></i></button>
                    </div>
                </div>
            </div>
        );
    }

    private authUrl = () => {
        //Logic that builds the url and returns it
      const my_client_id = 'fae22fc460a642acab61b10f6cc1cb77';
      const redirect_uri = 'http://localhost:3000/';
      var scopes = 'streaming user-read-birthdate user-read-email user-read-private';
      const url = 'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
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
        // player.
        player.togglePlay();
        const state = await player.getCurrentState(); //force this request to complete
        console.log(state ? state.paused : null);
    } 

    private getLibrary = async () => {
      const response = await fetch('https://api.spotify.com/v1/me/tracks', { 
        method: 'get', 
        headers: new Headers({
          'Authorization': this.state.token!
        })
      });
      return response;
    }

    private loginButton = () => {
      const my_client_id = 'fae22fc460a642acab61b10f6cc1cb77';
      const redirect_uri = 'http://localhost:3000/';
      var scopes = 'streaming user-read-birthdate user-read-email user-read-private';
      const url = 'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
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
