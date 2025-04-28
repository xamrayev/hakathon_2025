// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EduNFT is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct CertificateData {
        string studentName;
        string courseName;
        uint256 issueDate;  // Добавлено поле для даты выпуска сертификата
    }

    // Override required by Solidity for ERC721URIStorage
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    // Override required by Solidity for ERC721Enumerable and ERC721URIStorage
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // Override required by Solidity for ERC721Enumerable and ERC721URIStorage
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Override required by Solidity for ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    mapping(uint256 => CertificateData) public certificates;

    constructor() ERC721("EduCertificate", "EDU") {}

    function mintCertificate(
        address student,
        string memory studentName,
        string memory courseName,
        string memory uri
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(student, newItemId);
        _setTokenURI(newItemId, uri);

        certificates[newItemId] = CertificateData({
            studentName: studentName,
            courseName: courseName,
            issueDate: block.timestamp // Присваиваем текущую дату
        });

        return newItemId;
    }

    function getCertificateData(uint256 tokenId) public view returns (CertificateData memory) {
        return certificates[tokenId];
    }

    // Новый метод для получения всех сертификатов владельца
    function getCertificates(address owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i); // Получаем токен по индексу владельца
        }

        return tokens;
    }
}
