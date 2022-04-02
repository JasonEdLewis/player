import React, { Component} from "react";
import Player from "./components/Player"
import { ethers } from "ethers";
import ipfs from "./ipfs";
import readWrite from './read_write_files'

import "./App.css";

class App extends Component {
  
  
  constructor(props) {
    super(props)
    
    this.state = {
      songs:[],
      provider: null,
      buffer: Array(),
      account: null,
      showPlayer: false,
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
  }


componentDidMount = async () => {

  const ERC20_ABI = [
    "function getAlbum()public view returns (string memory, string memory,string memory,string memory)",
    "function getSong(string memory _title) public view returns (Song memory)",
    "function addSong(string memory _hash, string memory _title)",
    "function getSongs() public view returns (Song[] memory)"
  ];
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", []).then((result) => {this.setState({account:result[0]})})
  const address = "0x8c45FE31ef823C765a58ba0D1a8ea90b68a17760" // SimpleStore Address
  const contract = new ethers.Contract(address, ERC20_ABI, provider)
  const signer = provider.getSigner();
  const contractSigner = contract.connect(signer)  
  // const hashes = await contractSigner.getAll.call()
  console.log("Initializing ......")
  // console.log(hashes)
  // hashes.length && this.setState({hashes})

// MetaMask requires requesting permission to connect users accounts
// const wallet = new ethers.Wallet(privateKey1,provider)


  this.addSongToContract =  async () =>{
   const tx = await contractSigner.set(this.state.songs)
   await tx.wait()
   await contractSigner.getSongs().then(results => {
     this.setState({songs: results, showPlayer: !!this.state.songs })
   })
   
   
   }

   this.removeSong = async() =>{
    const tx = await contractSigner.remove()
    await tx.wait()
    await contractSigner.getAll.call().then((result) => {
      this.setState({hash: result})
      console.log(this.state.hashes)
    })
    
   }
   
  };

    captureFile = (e) =>{
      e.preventDefault();  
      const files = e.target.files
      
      for (let i = 0; i < files.length; i++){
      const title = files[i]['name'].split(".")[0]
      const payload = {}
      payload['title']= title
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(files[i])
      reader.onloadend = () => {
        payload['hash'] = Buffer(reader.result)
       this.setState({ songs: [...this.state.songs,payload]})
      }
      }

    }
    onSubmit  = (e) =>{
      e.preventDefault();
      const songsWithHashes =[]
      this.state.songs.forEach( song =>{
        ipfs.files.add(song['hash'],(error, result) => {
          if(error){
            console.log(error);
            return
          }
          else{
            e.input = null;
            song['hash'] = result[0].hash 
            songsWithHashes.push(song)
           
            // this.writeToContract()
          }
        })
      })
      this.setState({songs:songsWithHashes})
      console.log(this.state.songs)
      
    }
   
  render() {

    
    return (
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
            <button onClick={() => this.removeSong()}>Remove Song</button>
          </div>
          <div style={{marginTop:"2%"}}>
          { this.state.songs.length > 0 && <Player songs={this.state.songs}/>}
          </div>
          
        </div>
      </main>
    </div> 
    );
  }
}

export default App;
