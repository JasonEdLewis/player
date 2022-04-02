import React from 'react';
import Card from "./ShowCard"
 
const Player = ({songs}) => {
    const theSongs = songs.map((song, idx) => {
    return (<div style={{margin:"5%", padding:"1em", border: "0.05px dashed"}} key={idx}>
        <audio src={`https://ipfs.io/ipfs/${song.hash}`} controls type="audio"></audio>
        <h6>{song.title}</h6>
    </div>)
    }
    
);
  return (
    <div >
        {theSongs}
    </div>
  )
}
 
export default Player