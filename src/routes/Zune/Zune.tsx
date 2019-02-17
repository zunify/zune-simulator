import React, { Component } from 'react';

import { Button } from 'antd';

import {Home} from './components';
import 'antd/dist/antd.css';
import './Zune.css'
import Column from 'antd/lib/table/Column';

let player:Spotify.SpotifyPlayer;

type State = {
    token: string | null;
    deviceId: string | null;
    selected: number;
    library: any[];
    menu: number | null;
}

class Zune extends Component<{location: any}, State> {
    state = {
        token: null,
        deviceId: null,
        selected: 1,
        menu: null,
        library: [],
    }
    async componentWillMount() {
        //Check for code in url
        await this.setState({token: this.props.location.hash ? this.props.location.hash.split('=')[1]:null})
        console.log(this.props.location)
        if(this.props.location.hash.split('=')[1]){
            await this.setupPlayer(this.props.location.hash.split('=')[1]);
            const library = await this.getLibrary()
            this.setState({library: library.map((el:any, i:number) => {
                return {...el, index: i, label: el.track.name}
            })})
        }
    }

    render() {
        const {menu, selected} = this.state;
        const loginScreen = (
            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <img height='200' src='./zune.svg' />
                <Button style={{marginTop: '1rem', backgroundColor: '#1ed760'}} type='primary' href={this.authUrl()} ><i style={{marginRight: '1rem'}} className="fab fa-spotify"></i>Login</Button>
            </div>
        ) 

        const options = [
            {
                label: 'music',
                id: 1,
                options: this.state.library
            },
            {
                label: 'playlists',
                id: 2
            }
        ]

        const seletedOptions = () => {
            if (menu === 1){
                return options[0].options
            }
            return options
        }
        return (
            <div className='background'>
                <div className="Zune">
                    <div className='border'>
                        <div className='screen'>
                            {!this.state.token && loginScreen}
                            {this.state.token && <Home options={seletedOptions()!} selected={this.state.selected}/>}

                        </div>
                    </div>
                    <div style={{marginBottom: '1rem'}} className='controls'>
                        <button type='button' onClick={()=>{this.setState({menu: null, selected: 1})}} className='control back'><i className="fas fa-arrow-left"></i></button>
                        <div style={{flexDirection: 'column'}} className='control wheel'>
                            <button type='button' onClick={()=>{this.setState({selected: Math.max(this.state.selected-1, 1)})}} className='directonal'>.</button>
                            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                <button type='button' onClick={()=>{this.prevTrack(player)}} className='directonal'>.</button>
                                <button style={{}} type='button' onClick={()=>{this.setState({menu: selected});console.log(`Selected option ${selected} with value ${options[selected-1].label}, ${options[selected-1].options}`)}} className='directonal'>.</button>
                                <button type='button' onClick={()=>{this.nextTrack(player)}} className='directonal'>.</button>
                            </div>
                            <button type='button' onClick={()=>{this.setState({selected: Math.min(this.state.selected+1, seletedOptions()!.length)})}} className='directonal'>.</button>
                        </div>
                        <button type='button' onClick={()=>{this.togglePlayer(player)}} className='control toggle'><i className="fas fa-play"></i></button>
                    </div>
                </div>
            </div>
        );
    }

    private setupPlayer = (token:string):Spotify.SpotifyPlayer => { 
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
            this.setState({deviceId: device_id})
            console.log('Ready with Device ID', device_id);
            this.initPlay()
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

    private authUrl = () => {
        //Logic that builds the url and returns it
      const my_client_id = 'fae22fc460a642acab61b10f6cc1cb77';
      const redirect_uri = location.origin;
      var scopes = 'streaming user-read-birthdate user-read-email user-read-private user-read-currently-playing user-read-playback-state user-read-recently-played user-modify-playback-state playlist-read-private user-library-read';
      const url = 'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' + my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri);
      return url
    }

    public initPlay = async () => {
        const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            },
        })
        if(response.status === 200){
            const currentlyPlaying = await response.json();
            console.log(currentlyPlaying.items[0])
            const albumResponse = await this.getAlbumTracks(currentlyPlaying.items[0].track.album.id);
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: albumResponse.map((el:any) => el.uri) }),
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token!}`
                },
            })
            await setTimeout( async () => { const currState = await player.getCurrentState()
              if (currState)
                !currState.paused ? this.togglePlayer(player) : null;
            },525);
        } else {
            console.log('aslkdlaksjdfhlkajshdflkajshdfl')
        }
    }

    private nextTrack = (player: Spotify.SpotifyPlayer) => { 
        player.nextTrack();
        console.log('Skipped to next track!');
    }
      
    private prevTrack = (player: Spotify.SpotifyPlayer) => { 
        player.previousTrack();
        console.log('Set to previous track!');
    }

    private pausePlayback = (player: Spotify.SpotifyPlayer) => { 
      player.pause();
      console.log('Pausing track');
    }
      
    private togglePlayer = (player: Spotify.SpotifyPlayer) => {
        player.togglePlay();
        // const state = await player.getCurrentState(); //force this request to complete
        // console.log(state ? state.paused : null);
    } 

    private getAlbumTracks = async (album_id: String) => {
      const response = await fetch(`https://api.spotify.com/v1/albums/${album_id}/tracks`, { 
        method: 'GET', 
        headers: new Headers({
          'Authorization': `Bearer ${this.state.token!}`
        })
      });
      const albumTrack = await response.json();
      console.log("TRACKS")
      console.log(albumTrack.items)
      return albumTrack.items;
    }

    private getLibrary = async () => {
        const response = await fetch('https://api.spotify.com/v1/me/tracks?offset=0&limit=50', { 
            method: 'GET', 
            headers: new Headers({
                'Authorization': `Bearer ${this.state.token!}`
            })
        });
        const songs = await response.json()
        console.log(songs.items)
        return songs.items;
    }

    private getPlaylists = async () => {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', { 
        method: 'GET', 
        headers: new Headers({
          'Authorization': `Bearer ${this.state.token!}`
        })
      });
      return await response;
    }

    private getPlaylistIcon = async (playlist_id: string) => {
      const response = await fetch(`https://api.spotify.com/v1/me/playlists${playlist_id}/images`, { 
        method: 'GET', 
        headers: new Headers({
          'Authorization': `Bearer ${this.state.token!}`
        })
      });
      return await response;
    }
    // private loginButton = () => {
    //   const my_client_id = 'fae22fc460a642acab61b10f6cc1cb77';
    //   const redirect_uri = 'http://localhost:3000/';
    //   var scopes = 'streaming user-read-birthdate user-read-email user-read-private';
    //   const url = 'https://accounts.spotify.com/authorize' +
    //   '?response_type=token' +
    //   '&client_id=' + my_client_id +
    //   (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    //   '&redirect_uri=' + encodeURIComponent(redirect_uri);
    //   console.log('asd')
    //   return (
    //     <a type='button' href={url}>
    //       LOGIN
    //     </a>
    //   )
    // }
}

export default Zune;
