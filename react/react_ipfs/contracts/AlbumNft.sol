// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

// import "./PriceConsumerV3.sol";

// is PriceConsumerV3
contract AlbumNft {
    address _owner = msg.sender;
    bool _albumSet = false;
    uint256 maxSupply = 200;
    uint256 currentReleaseNumber = 1;
    uint256 songCount;
    uint256 price = 0.1 ether;
    Album theAlbum;
    string purchaseMessage = "Thank you for your purchase!";

    constructor(
        string memory _coverHash,
        string memory _title,
        string memory _artist,
        string memory _date
    ) public {
        theAlbum.coverHash = _coverHash;
        theAlbum.title = _title;
        theAlbum.artist = _artist;
        theAlbum.date = _date;
    }

    // receive () external payable {}

    struct Song {
        string hash;
        string title;
        string artist;
        string album;
        string media;
        uint256 number;
    }

    struct Album {
        string coverHash;
        string title;
        string artist;
        string date;
        mapping(string => Song) songs;
        Song[] songlist;
    }

    function getAlbum()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            Song[] memory
        )
    {
        return (
            theAlbum.coverHash,
            theAlbum.title,
            theAlbum.artist,
            theAlbum.date,
            theAlbum.songlist
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
        newSong.media = "audio";
        newSong.number = songCount + 1;
        theAlbum.songs[_hash] = newSong;
        theAlbum.songlist.push(newSong);
        songCount++;
    }

    function getSongs() public view returns (Song[] memory) {
        return theAlbum.songlist;
    }

    function getSong(string memory _title) public view returns (Song memory) {
        require(msg.sender == _owner);
        require(_albumSet == false);
        require(theAlbum.songlist.length > 0);
        Song memory requestedSong;
        for (uint256 i = 0; i < songCount; i++) {
            if (
                keccak256(abi.encodePacked(theAlbum.songlist[i].title)) ==
                keccak256(abi.encodePacked(_title))
            ) {
                requestedSong = theAlbum.songlist[i];
                break;
            }
        }
        return requestedSong;
    }

    function albumSet() public returns (bool) {
        require(msg.sender == _owner);
        _albumSet = true;
        return _albumSet;
    }

    function mintAlbum() external payable {
        require(msg.sender == _owner);
        require(msg.value > 0.001 ether);
        require(_albumSet == false);
        require(
            keccak256(abi.encodePacked(theAlbum.title)) !=
                keccak256(abi.encodePacked(""))
        );
        require(maxSupply > currentReleaseNumber);

        currentReleaseNumber += 1;
    }

    function purchaseAlbum() external payable returns (string memory) {
        require(msg.value > price, "Please check this album's price");
        return purchaseMessage;
    }

    function getcurrentReleaseNumber() public view returns (uint256) {
        return currentReleaseNumber;
    }
}
