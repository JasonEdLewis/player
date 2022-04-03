import React, { Component} from "react";
import Player from "./components/Player"
import { ethers } from "ethers";
import ipfs from "./ipfs";
import { abi } from "./contracts/AlbumNft.json";
import ShowCard from "./components/ShowCard.js";
import  BSON from "bson";
import readWrite from './read_write_files'

import "./App.css";

class App extends Component {
  
  
  constructor(props) {
    super(props)
    
    this.state = {
      album:Object(),
      songs: Array(),
      provider: null,
      buffer: Array(),
      account: null,
      showPlayer: false,
      contractSigner:null,
      albumSet:false,
      albumBuffer:[],
      albumHash:[],
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // this.addSongsToContract = this.addSongsToContract.bind(this);
    
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
  const address = "0x7140c71C8881aD817FAef8B27a13f08C2083b431" // SimpleStore Address
  const contract = new ethers.Contract(address, abi, provider)
  const signer = provider.getSigner();
  const contractSigner = contract.connect(signer)  
  this.setState({contractSigner})
  const album = await contractSigner.getAlbum()
  // const songs = await contractSigner.getSongs()
  console.log("the Album: ")
 
  // console.log(songs)
  const albumObj ={
    "cover_hash":album[0],
    "title": album[1],
    "artist":album[2],
    "year": album[3],
    "songs": album[4] || [],
    }
  // console.log(albumObj)
  // return
  const loadedSongs =[]
  albumObj.songs.forEach(song=>{
    const obj ={
      "URI": `https://ipfs.io/ipfs/${song.hash}`,
      "title": song.title,
      "artist": song.artist,
      "album" : song.album,
      "media": song.media
    }
    loadedSongs.push(obj)
  })
  this.setState({album: albumObj, songs:loadedSongs , showPlayer:!!loadedSongs})
  console.log("Initializing ......")
  // console.log(`Album: ${this.state.album.title}`)
  // console.log("The Songs: ")
  // console.log(this.state.songs)
  

   this.removeSong = async() =>{
    const tx = await contractSigner.remove()
    await tx.wait()
    await contractSigner.getAll.call().then((result) => {
      this.setState({hash: result})
      console.log(this.state.hashes)
    })
    
   }
   
  };
    addSongsToContract =  async (song) =>{
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
            this.state.songs.forEach( song =>{
              ipfs.files.add(song.buffer,(error, result) => {
                if(error){
                  console.log(error);
                  return
                }
                else{
                  song['hash'] = result[0].hash 
                  song.buffer =""
                  this.addSongsToContract(song)
                }
              })
            })
      }
      
      
    }


    processFilesToIpfs = async (buffer) =>{
      ipfs.files.add(buffer,(error, result) => {
        if(error){
          console.log(error);
          return
        }
        else{
          console.log(result)
        }
      })
    }
  
     readAndSetFiles = async (files) =>{
      const reader = new FileReader();
        reader.readAsArrayBuffer(files)
        reader.onloadend = () => {
          console.log(Buffer(reader.result))
         return this.setState({ albumBuffer: [...this.state.albumBuffer,Buffer(reader.result)]})
          
        }
        console.log(this.state.albumBuffer)
        // await this.processFilesToIpfs(this.state.albumBuffer[0])
    }
    getAlbumURI = async ( ) =>{
      const payload = {
        name:this.state.album.title,
        description:`this is A Starr's album entitled: ${this.state.album.artist} released in ${this.state.album.year}`,
        image: `https://ipfs.io/ipfs/${this.state.album.cover_hash}`,
        attributes : this.state.songs
      }
      const json_payload =  JSON.stringify({payload})
      
      const albumMetaDataFile = new File(new Blob([json_payload],"album.json"))
      await this.readAndSetFiles(albumMetaDataFile)
      // await this.processFilesToIpfs(this.state.albumBuffer[0])
      }
    
      
      

      // const blob =new Blob([JSON.stringify(jsonPayload)],{type:"application/json"})
      // console.log(Buffer.from(jsonPayload))
    // Works  https://ipfs.io/ipfs/QmdRF2BuwRw4V1QbLs6QQiqtEgRPn6wiysq8NScWugfFbq
    //  https://ipfs.io/ipfs/QmWDXegLd7sP48K7uwYc95qTMRkoB8nCRZnfpiBMgvDvEj
    //https://ipfs.io/ipfs/QmcCwymWnVymYLYuPYTNubGw71Ru8WTqSPJXj3fcADwiGS
    // QmWDXegLd7sP48K7uwYc95qTMRkoB8nCRZnfpiBMgvDvEj
      // QmdRF2BuwRw4V1QbLs6QQiqtEgRPn6wiysq8NScWugfFbq
       
   
  render() {

 
    
    return (
      <>
     <div className="App">
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
            {/* <button onClick={() => this.removeSong()}>Remove Song</button> */}
            <button onClick={()=> this.getAlbumURI()}>Mint Album</button>
          </div>
        </div>
      </main>
    </div> 
    <ShowCard album={this.state.album} songs={this.state.songs} showPlayer={this.state.showPlayer}/>
  
      
      </>
    );
  }
}

export default App;
