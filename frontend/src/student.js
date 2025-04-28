import { ethers } from "ethers";

// Адрес контракта и ABI
const CONTRACT_ADDRESS = import.meta.env.CONTRACT_ADDRESS; // Адрес контракта
import contractData from '../../artifacts/contracts/EduNFT.sol/EduNFT.json'; // ABI контракт из artifacts

const ABI = contractData.abi; // Извлекаем ABI из JSON

let signer;
let provider;
let contract;

// Функция для подключения MetaMask
async function connectMetamask() {
    if (window.ethereum) {
        // Запрашиваем аккаунты
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        console.log("Connected account:", accounts[0]);

        // Отображаем адрес кошелька на странице
        document.getElementById('walletAddress').innerText = `Подключено: ${accounts[0]}`;

        // Инициализируем провайдер и подписанта
        const rpcUrl = import.meta.env.RPC_URL;
        provider = new ethers.JsonRpcProvider(rpcUrl); // Провайдер для взаимодействия с блокчейном
        signer = provider.getSigner(); // Получаем подписанта (текущий аккаунт MetaMask)

        // Инициализируем контракт с подписантом
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        console.log("Контракт подключен:", contract);
    } else {
        alert("Please install Metamask!");
    }
}

// Функция для получения сертификатов
// Убедитесь, что функции connectMetamask и getCertificates определены в student.js до использования

async function getCertificates() {
  if (!contract) {
    alert("Сначала подключите MetaMask!");
    return;
  }

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const ownerAddress = accounts[0];

  try {
    const certificates = await contract.getCertificates(ownerAddress); // Вызов через signer
    console.log("Сертификаты владельца:", certificates);

    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Очистить результат

    certificates.forEach(async (tokenId) => {
      const certData = await contract.getCertificateData(tokenId);
      console.log("Данные сертификата:", certData);

      const certificateElement = document.createElement('div');
      certificateElement.innerHTML = `
        <p><b>Имя студента:</b> ${certData.studentName}</p>
        <p><b>Курс:</b> ${certData.courseName}</p>
        <a href="${certData.tokenURI}" target="_blank">Смотреть сертификат</a>
      `;
      resultContainer.appendChild(certificateElement);
    });
  } catch (error) {
    console.error("Ошибка при получении сертификатов:", error);
  }
}


// Привязываем обработчики событий к кнопкам
document.getElementById('connectButton').addEventListener('click', connectMetamask);
document.getElementById('getCertificatesButton').addEventListener('click', getCertificates);
