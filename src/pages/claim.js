import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StakeholderManagement from 'D:/Programming/Solidity/ETH Advanced/Tokenomics-DApp/artifacts/contracts/manage.sol/StakeholderManagement.json';

const ORGANIZATION_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_ORGANIZATION_REGISTRY_ADDRESS;
const STAKEHOLDER_MANAGEMENT_ADDRESS = process.env.NEXT_PUBLIC_STAKEHOLDER_MANAGEMENT_ADDRESS;

export default function Claim() {
  const [message, setMessage] = useState('');
  const [popUp, setPopUp] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [orgAddress, setOrgAddress] = useState('');
  const [stakeholders, setStakeholders] = useState([]);
  const [claimable, setClaimable] = useState(false);
  const [addr, setAddress] = useState('');

  useEffect(() => {
    if (walletConnected) {
      fetchStakeholders();
    }
  }, [walletConnected]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      setWalletConnected(false);
      setMessage('Please connect to your wallet');
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      setWalletConnected(true);
      setMessage('Wallet connected');
      const connectedAddress = await signer.getAddress();
      setAddress(connectedAddress); // Update connected address
    }
  }

  async function connectWallet() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      setWalletConnected(true);
      setMessage('Wallet connected');
      const connectedAddress = await signer.getAddress();
      setAddress(connectedAddress); // Update connected address
    } catch (err) {
      console.error(err);
      setMessage('Failed to connect wallet');
    }
  }
  

  async function fetchStakeholders() {
    if (!orgAddress) return;

    try {
      const stakeholderManagementContract = new ethers.Contract(STAKEHOLDER_MANAGEMENT_ADDRESS, StakeholderManagement.abi, signer);
      const stakeholders = await stakeholderManagementContract.getStakeholders(orgAddress);
      setStakeholders(stakeholders);
      
      const claimable = stakeholders.some(stakeholder => 
        stakeholder.stakeholderAddress === signer.getAddress() && 
        !stakeholder.claimed && 
        (parseInt(stakeholder.startTime) + parseInt(stakeholder.vestingPeriod)) <= Math.floor(Date.now() / 1000)
      );
      setClaimable(claimable);
    } catch (err) {
      console.error(err);
      setMessage('Error fetching stakeholders');
    }
  }

  async function claimTokens() {
    if (!orgAddress || !signer) return;

    try {
      const connectedAddress = await signer.getAddress();
      const stakeholderManagementContract = new ethers.Contract(STAKEHOLDER_MANAGEMENT_ADDRESS, StakeholderManagement.abi, signer);
      const stakeholders = await stakeholderManagementContract.getStakeholders(orgAddress);

      const eligibleStakeholder = stakeholders.find(stakeholder => 
        stakeholder.stakeholderAddress.toLowerCase() === connectedAddress.toLowerCase()
      );

      if (!eligibleStakeholder) {
        setPopUp('Invalid wallet address');
        return;
      }

      if (eligibleStakeholder.claimed) {
        setPopUp('✅ Tokens have already been claimed');
        return;
      }

      const vestingEndTime = parseInt(eligibleStakeholder.startTime) + parseInt(eligibleStakeholder.vestingPeriod);
      if (vestingEndTime > Math.floor(Date.now() / 1000)) {
        const vestingEndDate = new Date(vestingEndTime * 1000).toLocaleString();
        setPopUp(`❌ Vesting period is not over, please wait. Vesting period will be over on ${vestingEndDate}`);
        return;
      }

      const tx = await stakeholderManagementContract.claimTokens(orgAddress);
      await tx.wait();
      setPopUp('✅ Tokens claimed successfully');
      fetchStakeholders();
    } catch (err) {
      console.error(err);
      setPopUp('Error claiming tokens');
    }
}

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 7)}...${address.slice(-5)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-xl font-bold">Claim Tokens</span>
          {!walletConnected ? (
            <button
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          ) : (
            <button
              className="flex items-center space-x-2 bg-gray-600 text-lg font-semibold px-4 py-2 rounded-full text-blue-400"
              style={{ minWidth: '190px' }}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="uppercase">{shortenAddress(addr)}</span>
            </button>
          )}
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen text-white">

        {walletConnected && (
          <>
            <div className="mb-8 p-6 rounded-lg shadow-lg bg-gray-800">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">Enter Organization Address</h2>
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Organization Address"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  className="border rounded w-full py-2 px-4 bg-gray-700 text-gray-300 border-gray-600 placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
                <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mt-4 self-start" onClick={fetchStakeholders}>Fetch Stakeholders</button>
              </div>
            </div>

            <div className="mb-8 p-6 rounded-lg shadow-lg bg-gray-800">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">All Stakeholders</h2>
              <ul>
                {stakeholders.map((stakeholder, index) => (
                  <li key={index} className="mb-2">
                    {stakeholder.name} - {stakeholder.stakeholderAddress} - {stakeholder.claimed ? 'Claimed' : 'Not Claimed'} - Amount: {ethers.formatUnits("100000000000000000000", 18)} tokens
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8 p-6 rounded-lg shadow-lg bg-gray-800">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">Your Allocations</h2>
              {stakeholders.filter(stakeholder => stakeholder.stakeholderAddress === addr).length === 0 ? (
                <p className="text-lg text-red-500">You are not allocated any tokens.</p>
              ) : (
                <ul className="space-y-4">
                  {stakeholders.filter(stakeholder => stakeholder.stakeholderAddress === addr).map((stakeholder, index) => (
                    <li key={index} className="p-4 bg-gray-900 rounded-lg shadow-lg border border-gray-700 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold text-green-400">{stakeholder.name}</h3>
                        <p>{stakeholder.stakeholderAddress}</p>
                        <p className="mt-2">{stakeholder.claimed ? 'Claimed' : 'Not Claimed'}</p>
                        {message && <p className="mt-4 mb-4 text-green-500">{popUp}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{ethers.formatUnits("100000000000000000000", 18)} tokens</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {stakeholders.filter(stakeholder => stakeholder.stakeholderAddress === addr).length > 0 && (
                <div className="mt-6 flex justify-center">
                  <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105" onClick={claimTokens}>Claim Tokens</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
