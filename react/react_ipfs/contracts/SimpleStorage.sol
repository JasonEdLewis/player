// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.21 <8.10.0;

contract SimpleStorage {
    struct Song {
        string title;
        string artist;
        string album;
        string hash;
        string _type;
    }

    struct Album {
        string title;
        string artist;
        string date;
        mapping(string => string) Song;
    }

    Song[] public songs;
    string ipfsHash;
    string[] hashes;

    function set(
        string memory _title,
        string memory _artist,
        string memory _album,
        string memory _hash,
        string memory _type
    ) public {
        songs.push(Song(_title, _artist, _album, _hash, _type));
    }

    function get(uint256 idx) public view returns (string memory) {
        return hashes[idx];
    }

    function getAll() public view returns (string[] memory) {
        return hashes;
    }

    function remove() public returns (bool) {
        require(hashes.length > 0, "There are no hashes to remove");
        hashes.pop();
        return true;
    }
}
