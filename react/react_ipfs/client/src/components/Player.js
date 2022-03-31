import React from 'react'
 
const Player = (props) => {
    const songs = props.hashes.map((prop, idx) => {
    return (<div style={{margin:"2.5%"}} key={idx}>
        <audio src={`https://ipfs.io/ipfs/${prop}`} controls ></audio>
    </div>)
    }
    
    
);
  return (
    <div >
        {songs}
    </div>
  )
}
 
export default Player