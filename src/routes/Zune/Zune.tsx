import React, { Component } from 'react';


import './Zune.css'

type Props = {
    player: any;
}

class Zune extends Component<Props> {
  render() {
    const {player} = this.props;
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
                <button onClick={this.nextTrack} /> 
            </div>
        </div>
    );
  }

  nextTrack = () => {
    const {player} = this.props;

  }
}

export default Zune;
