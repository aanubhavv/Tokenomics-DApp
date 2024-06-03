import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StakeholderManagement from 'D:/Programming/Solidity/ETH Advanced/module-1-assessment/artifacts/contracts/manage.sol/StakeholderManagement.json';

const ORGANIZATION_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const STAKEHOLDER_MANAGEMENT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export default function Claim() {
  const [message, setMessage] = useState('');
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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
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
        setMessage('Invalid wallet address');
        return;
      }

      if (eligibleStakeholder.claimed) {
        setMessage('✅ Tokens have already been claimed');
        return;
      }

      const vestingEndTime = parseInt(eligibleStakeholder.startTime) + parseInt(eligibleStakeholder.vestingPeriod);
      if (vestingEndTime > Math.floor(Date.now() / 1000)) {
        const vestingEndDate = new Date(vestingEndTime * 1000).toLocaleString();
        setMessage(`❌ Vesting period is not over, please wait. Vesting period will be over on ${vestingEndDate}`);
        return;
      }

      const tx = await stakeholderManagementContract.claimTokens(orgAddress);
      await tx.wait();
      setMessage('✅ Tokens claimed successfully');
      fetchStakeholders();
    } catch (err) {
      console.error(err);
      setMessage('Error claiming tokens');
    }
}


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Claim Tokens</h1>

      {!walletConnected && (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={connectWallet}>Connect Wallet</button>
      )}

      {walletConnected && (
        <>
          <p className="text-lg font-semibold mb-4">Connected Address: {addr}</p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Enter Organization Address</h2>
            <input
              type="text"
              placeholder="Organization Address"
              value={orgAddress}
              onChange={(e) => setOrgAddress(e.target.value)}
              className="border rounded w-full py-2 px-4"
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={fetchStakeholders}>Fetch Stakeholders</button>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Claimable Stakeholders</h2>
            <ul>
              {stakeholders.map((stakeholder, index) => (
                <li key={index} className="mb-2">
                  {stakeholder.name} - {stakeholder.stakeholderAddress} - {stakeholder.claimed ? 'Claimed' : 'Not Claimed'} - Amount: {ethers.utils.formatUnits("100000000000000000000", 18)} tokens
                </li>
              ))}
            </ul>
          </div>

          {walletConnected && (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={claimTokens}>Claim Tokens</button>
          )}
        </>
      )}

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
