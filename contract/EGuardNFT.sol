// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import { IPrimusZKTLS, Attestation } from "@primuslabs/zktls-contracts/src/IPrimusZKTLS.sol";

contract EGuardNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    address public primusAddress;
    
    // 军衔映射
    mapping(string => string) public rankNames;
    
    // 记录已验证的attestation，防止重复使用
    mapping(bytes32 => bool) public usedAttestations;
    
    // 记录用户的NFT信息
    struct GuardInfo {
        string rank;
        uint256 ethAmount;
        uint256 mintTime;
    }
    
    mapping(uint256 => GuardInfo) public guardInfos;
    
    event NFTMinted(address indexed to, uint256 indexed tokenId, string rank, uint256 ethAmount);

    constructor(address _primusAddress) ERC721("E Guard NFT", "EGUARD") Ownable(msg.sender) {
        primusAddress = _primusAddress;
        
        // Initialize rank names
        rankNames["E_PRIVATE"] = "E Private";
        rankNames["E_LIEUTENANT"] = "E Lieutenant";
        rankNames["E_CAPTAIN"] = "E Captain";
        rankNames["E_MAJOR"] = "E Major";
        rankNames["E_LIEUTENANT_COLONEL"] = "E Lt Colonel";
        rankNames["E_COLONEL"] = "E Colonel";
        rankNames["E_BRIGADIER_GENERAL"] = "E Brigadier General";
        rankNames["E_MAJOR_GENERAL"] = "E Major General";
        rankNames["E_LIEUTENANT_GENERAL"] = "E Lt General";
        rankNames["E_MARSHAL"] = "E Marshal";
    }

    function mintGuardNFT(
        Attestation calldata attestation,
        string memory rank,
        uint256 ethAmount
    ) public {
        // 验证attestation
        require(verifyAttestation(attestation), "Invalid attestation");
        
        // 检查attestation是否已被使用
        bytes32 attestationHash = keccak256(abi.encode(attestation));
        require(!usedAttestations[attestationHash], "Attestation already used");
        
        // 验证军衔是否有效
        require(bytes(rankNames[rank]).length > 0, "Invalid rank");
        
        // 标记attestation为已使用
        usedAttestations[attestationHash] = true;
        
        // 铸造NFT
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        
        // 存储卫兵信息
        guardInfos[tokenId] = GuardInfo({
            rank: rank,
            ethAmount: ethAmount,
            mintTime: block.timestamp
        });
        
        // 生成并设置token URI
        string memory uri = generateTokenURI(tokenId, rank, ethAmount);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(msg.sender, tokenId, rank, ethAmount);
    }

    function verifyAttestation(Attestation calldata attestation) public view returns(bool) {
        try IPrimusZKTLS(primusAddress).verifyAttestation(attestation) {
            return true;
        } catch {
            return false;
        }
    }

    function generateSVG(uint256 tokenId, string memory rankName, string memory ethAmountStr)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="400" height="400" fill="#1a1a2e" />',
            '<rect x="20" y="20" width="360" height="360" fill="none" stroke="#ffd700" stroke-width="3" />',
            '<text x="200" y="80" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="#ffd700">E Guard</text>',
            '<text x="200" y="140" font-family="Arial" font-size="20" text-anchor="middle" fill="#ffffff">Rank: ', rankName, '</text>',
            '<text x="200" y="180" font-family="Arial" font-size="16" text-anchor="middle" fill="#cccccc">ETH: ', ethAmountStr, '</text>',
            '<text x="200" y="220" font-family="Arial" font-size="16" text-anchor="middle" fill="#cccccc">ID: #', tokenId.toString(), '</text>',
            '<text x="200" y="300" font-family="Arial" font-size="14" text-anchor="middle" fill="#888888">zkTLS Verified</text>',
            '</svg>'
        ));
    }

    function generateTokenURI(uint256 tokenId, string memory rank, uint256 ethAmount)
        internal
        view
        returns (string memory)
    {
        string memory rankName = rankNames[rank];
        string memory ethAmountStr = (ethAmount / 1e18).toString();
        string memory svg = generateSVG(tokenId, rankName, ethAmountStr);

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(abi.encodePacked(
                '{"name":"E Guard #', tokenId.toString(),
                '","description":"E Guard NFT verified by zkTLS","image":"data:image/svg+xml;base64,',
                Base64.encode(bytes(svg)),
                '","attributes":[{"trait_type":"Rank","value":"', rankName,
                '"},{"trait_type":"ETH Amount","value":', ethAmountStr, '}]}'
            )))
        ));
    }

    // 重写必要的函数
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
