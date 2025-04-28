import { ethers } from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

import ABI from '../../artifacts/contracts/EduNFT.sol/EduNFT.json'; // ABI контракт из artifacts


async function verifyCertificate(tokenId) {
  const rpcUrl = import.meta.env.RPC_URL;
  const provider = new ethers.JsonRpcProvider(rpcUrl); // Ganache/Hardhat RPC
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, provider);

  const certData = await contract.getCertificateData(tokenId);
  const tokenURI = await contract.tokenURI(tokenId);

  const metadataResponse = await fetch(tokenURI);
  const metadata = await metadataResponse.json();

  // Преобразуем BigInt в число, если это необходимо
  const studentName = certData.studentName.toString();
  const courseName = certData.courseName.toString();
  const issueDate = new Date(Number(certData.issueDate) * 1000).toLocaleString(); // Преобразуем в дату

  console.log("Данные из блокчейна:");
  console.log("Имя студента:", studentName);
  console.log("Курс:", courseName);
  console.log("Дата выпуска:", issueDate);

  console.log("Данные из метаданных:");
  console.log("Описание:", metadata.description);
  console.log("PDF:", metadata.file);

  document.getElementById('result').innerHTML = `
    <h3>Результат:</h3>
    <p><b>Имя:</b> ${studentName}</p>
    <p><b>Курс:</b> ${courseName}</p>
    <p><b>Дата:</b> ${issueDate}</p>
    <p><b>PDF сертификат:</b> <a href="${metadata.file}" target="_blank">Открыть</a></p>
  `;
}

document.getElementById('verifyButton').addEventListener('click', async () => {
  const tokenId = document.getElementById('tokenId').value;
  if (!tokenId) {
    alert("Введи ID токена!");
    return;
  }

  await verifyCertificate(tokenId);
});
