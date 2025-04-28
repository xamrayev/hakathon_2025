import { ethers } from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS; // Вставь сюда после деплоя
import ABI from '../../artifacts/contracts/EduNFT.sol/EduNFT.json'; // ABI контракт из artifacts

async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  // Use the IPFS_POST_URL from the environment variables
  const response = await fetch(import.meta.env.VITE_IPFS_POST_URL, {
    method: 'POST',
    body: formData
  });

  // Check for success
  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }

  const data = await response.json();

  // Use the IPFS_BASE_URL from the environment variables
  return `${import.meta.env.VITE_IPFS_BASE_URL}${data.Hash}`;
}


async function createMetadata(studentName, courseName, pdfUrl) {
  const metadata = {
    name: `${studentName} - ${courseName}`,
    description: `Certificate for ${studentName} completing ${courseName}`,
    file: pdfUrl
  };

  const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
  const file = new File([blob], "metadata.json");

  return await uploadToIPFS(file);
}

async function mintCertificate(studentAddress, studentName, courseName, metadataURI) {
  if (!window.ethereum) {
    alert("Установи Metamask!");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);

  const tx = await contract.mintCertificate(
    studentAddress,
    studentName,
    courseName,
    metadataURI
  );

  document.getElementById('status').innerText = "Минтим сертификат...";
  await tx.wait();
  document.getElementById('status').innerText = "Сертификат успешно выпущен!";
}

document.getElementById('mintButton').addEventListener('click', async () => {
  const fileInput = document.getElementById('pdfFile');
  const studentAddress = document.getElementById('studentAddress').value;
  const studentName = document.getElementById('studentName').value;
  const courseName = document.getElementById('courseName').value;

  if (fileInput.files.length === 0 || !studentAddress || !studentName || !courseName) {
    alert("Заполни все поля и выбери PDF!");
    return;
  }

  const file = fileInput.files[0];

  document.getElementById('status').innerText = "Загрузка PDF в IPFS...";
  const pdfUrl = await uploadToIPFS(file);

  document.getElementById('status').innerText = "Создание метаданных...";
  const metadataURI = await createMetadata(studentName, courseName, pdfUrl);

  await mintCertificate(studentAddress, studentName, courseName, metadataURI);
});
