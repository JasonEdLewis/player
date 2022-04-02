import React, { Component} from "react";
import Player from "./components/Player"
import { ethers } from "ethers";
import ipfs from "./ipfs";
import { abi } from "./contracts/AlbumNft.json";
import ShowCard from "./components/ShowCard.js";
import readWrite from './read_write_files'

import "./App.css";

class App extends Component {
  
  
  constructor(props) {
    super(props)
    
    this.state = {
      album:Object(),
      songs:[],
      provider: null,
      buffer: Array(),
      account: null,
      showPlayer: false,
      contractSigner:null
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // this.addSongToContract = this.addSongToContract.bind(this);
    
  }


componentDidMount = async () => {

  // const ERC20_ABI = [
  //   "function getAlbum()public view returns (string memory, string memory,string memory,string memory)",
  //   "function getSong(string memory _title) public view returns (Song memory)",
  //   "function addSong(string memory _hash, string memory _title)",
  //   "function getSongs() public view returns (Song[] memory)"
  // ];
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", []).then((result) => {this.setState({account:result[0]})})
  const address = "0x29c62d412f3F9eFA07aFa596dFB4C9610A2BFC8c" // SimpleStore Address
  const contract = new ethers.Contract(address, abi, provider)
  const signer = provider.getSigner();
  const contractSigner = contract.connect(signer)  
  this.setState({contractSigner})
  const album = await contractSigner.getAlbum()
  const songs = await contractSigner.getSongs()
  console.log(songs)
  const albumObj ={
    "cover_hash":album[0],
    "title": album[1],
    "artist":album[2],
    "buffer":"",
    "year": album[3]
    }

  const loadedSongs =[]
  songs.forEach(song=>{
    // console.log(song["album"])
    const obj ={
      "hash": song.hash,
      "title": song.title,
      "artist": song.artist,
      "album" : song.album,
      "media": song.media
    }
    loadedSongs.push(obj)
  })
  this.setState({album: albumObj, songs:loadedSongs, showPlayer:!!songs})
  console.log("Initializing ......")
  console.log(this.state.songs)
  // console.log(hashes)
  // hashes.length && this.setState({hashes})

// MetaMask requires requesting permission to connect users accounts
// const wallet = new ethers.Wallet(privateKey1,provider)


  // this.addSongsToContract =  async (songs) =>{
  //   for( let i = 0; i < songs.length; i++){
  //     console.log(songs[i])
  //     const tx = await contractSigner.addSong(songs[i].hash,songs[i].title)
  //     await tx.wait()
  //     console.log(`Transaction: ${i+1}`)
  //     console.log(tx)
  //   }
  //    await contractSigner.getSongs().then(results => {
  //    this.setState({songs: results, showPlayer: !!this.state.songs })
  //  })
   
   
  //  }

   this.removeSong = async() =>{
    const tx = await contractSigner.remove()
    await tx.wait()
    await contractSigner.getAll.call().then((result) => {
      this.setState({hash: result})
      console.log(this.state.hashes)
    })
    
   }
   
  };
    addSongToContract =  async (song) =>{
    const tx = await this.state.contractSigner.addSong(song.hash,song.title)
    await tx.wait()
    console.log(tx)
   await this.state.contractSigner.getSongs().then(results => {
   this.setState({songs: results, showPlayer: !!this.state.songs })
 })
 
 
 }
    captureFile = (e) =>{
      e.preventDefault();  
      const files = e.target.files
      if(files[0]['name'].split(".")[1] =="jpg"){
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(files[0])
        reader.onloadend = () => {
          this.setState({ album: {...this.state.album, buffer: Buffer(reader.result)}})
      }
      }
      else {
      for (let i = 0; i < files.length; i++){
      const title = files[i]['name'].split(".")[0]
      const payload = {}
      payload['title']= title
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(files[i])
      reader.onloadend = () => {
          payload['buffer'] = Buffer(reader.result)
       this.setState({ songs: [...this.state.songs,payload]})
       console.log(this.state.songs)
      }
      
      }
      
    }

    }
    onSubmit  = (e) =>{
      e.preventDefault();
      if(!this.state.album['cover_hash']){
        ipfs.files.add(this.state.album.buffer,(error, result) => {
          if(error){
            console.log(error);
            return
          }
          else{
            console.log(result[0].hash)
            this.setState({album:{...this.state.album, cover_hash:result[0].hash, buffer:""}}) 
            console.log(this.state.album)
          }
        })
         
      }
      else{
            const songsWithHashes =[]
            this.state.songs.forEach( song =>{
              ipfs.files.add(song.buffer,(error, result) => {
                if(error){
                  console.log(error);
                  return
                }
                else{
                  song['hash'] = result[0].hash 
                  song.buffer =""
                  this.addSongToContract(song)
                }
              })
            })
            console.log(songsWithHashes)
            this.setState({songs:songsWithHashes})
            console.log(this.state.songs)
            
      }
      
      
    }
       
   
  render() {

 
    
    return (
      <>
    { !this.state.showPlayer ? <div className="App">
      <nav className="navbar pure-menu pure-menu-horizontal">
        <a href="#" className="pure-menu-heading pure-menu-link">NFTp</a>
      </nav>

      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Upload Your song here....</h1>
            
            <p>This song is stored on IPFS & The Ethereum Blockchain!</p>
            
            <form onSubmit={this.onSubmit} >
              <input type='file' onChange={this.captureFile} multiple/>
              <input type='submit' />
            </form>
            <button onClick={() => this.removeSong()}>Remove Song</button>
          </div>
        </div>
      </main>
    </div> : 
    <ShowCard album={this.state.album} songs={this.state.songs} showPlayer={this.state.showPlayer}/>
    }
      
      </>
    );
  }
}

export default App;
