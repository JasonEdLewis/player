// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract AlbumNft {
    address _owner = msg.sender;
    bool _albumSet = false;
    Album theAlbum;

    constructor(
        string memory _coverHash,
        string memory _title,
        string memory _artist,
        string memory _date
    ) {
        theAlbum.coverHash = _coverHash;
        theAlbum.title = _title;
        theAlbum.artist = _artist;
        theAlbum.date = _date;
    }

    receive() external payable {}

    struct Song {
        string hash;
        string title;
        string artist;
        string album;
        string _type;
    }

    struct Album {
        string coverHash;
        string title;
        string artist;
        string date;
        mapping(string => Song) songs;
    }

    function mintAlbum() public view {
        require(msg.sender == _owner);
        require(_albumSet == false);
        require(
            keccak256(abi.encodePacked(theAlbum.title)) !=
                keccak256(abi.encodePacked(""))
        );
    }

    function addSong(string memory _hash, string memory _title) public {
        require(msg.sender == _owner);
        require(_albumSet == false);
        Song memory newSong;
        newSong.hash = _hash;
        newSong.title = _title;
        newSong.artist = theAlbum.artist;
        newSong.album = theAlbum.title;
        theAlbum.songs[_hash] = newSong;
    }

    function getAlbum()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (
            theAlbum.title,
            theAlbum.coverHash,
            theAlbum.artist,
            theAlbum.date
        );
    }

    function readSong(string memory _hash) public view returns (string memory) {
        require(msg.sender == _owner);
        require(_albumSet == false);
        return theAlbum.songs[_hash].title;
    }

    function albumSet() public returns (bool) {
        require(msg.sender == _owner);
        _albumSet = true;
        return _albumSet;
    }
}
