import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import OrganizationRegistry from 'D:/Programming/Solidity/ETH Advanced/module-1-assessment/artifacts/contracts/org.sol/OrganizationRegistry.json';
import StakeholderManagement from 'D:/Programming/Solidity/ETH Advanced/module-1-assessment/artifacts/contracts/manage.sol/StakeholderManagement.json';

const ORGANIZATION_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const STAKEHOLDER_MANAGEMENT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export default function Admin() {
  const [orgName, setOrgName] = useState('');
  const [stakeholderName, setStakeholderName] = useState('');
  const [stakeholderAddress, setStakeholderAddress] = useState('');
  const [stakeholderType, setStakeholderType] = useState('0');
  const [vestingPeriod, setVestingPeriod] = useState('');
  const [whitelistAddress, setWhitelistAddress] = useState('');
  const [message, setMessage] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [addr, setAddress] = useState('');

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

  async function registerOrganization() {
    if (!orgName) return;

    try {
      const orgRegistryContract = new ethers.Contract(ORGANIZATION_REGISTRY_ADDRESS, OrganizationRegistry.abi, signer);
      const tx = await orgRegistryContract.registerOrganization(orgName);
      await tx.wait();
      setMessage('Organization registered successfully');
    } catch (err) {
      console.error(err);
      alert(err)
      setMessage('Error registering organisation');
    }
  }

  async function whitelistStakeholder() {
    if (!whitelistAddress) return;

    try {
      const stakeholderManagementContract = new ethers.Contract(STAKEHOLDER_MANAGEMENT_ADDRESS, StakeholderManagement.abi, signer);
      const tx = await stakeholderManagementContract.whitelistAddress(whitelistAddress, stakeholderType);
      await tx.wait();
      setMessage('Address whitelisted successfully');
    } catch (err) {
      console.error(err);
      setMessage('Error whitelisting address');
    }
  }

  async function addStakeholder() {
    if (!stakeholderName || !stakeholderAddress || !vestingPeriod) return;

    try {
      const stakeholderManagementContract = new ethers.Contract(STAKEHOLDER_MANAGEMENT_ADDRESS, StakeholderManagement.abi, signer);
      const tx = await stakeholderManagementContract.addStakeholder(stakeholderName, stakeholderAddress, stakeholderType, vestingPeriod);
      await tx.wait();
      setMessage('Stakeholder added successfully');
    } catch (err) {
      console.error(err);
      alert(err)
      setMessage('Error adding stakeholder');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
      
      {!walletConnected && (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={connectWallet}>Connect Wallet</button>
      )}
      
      {walletConnected && (
        <>
          <p className="text-lg font-semibold mb-4">Connected Address: {addr}</p>
          {message && <p className="mt-4 text-red-500"><span style={{ color: 'white' }}>Message: </span>{message}</p>}

          <br></br>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Register Organization</h2>
            <input
              type="text"
              placeholder="Organization Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="border rounded w-full py-2 px-4 mb-2"
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={registerOrganization}>Register</button>
          </div>
  
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Whitelist Stakeholder Address</h2>
            <input
              type="text"
              placeholder="Address"
              value={whitelistAddress}
              onChange={(e) => setWhitelistAddress(e.target.value)}
              className="border rounded w-full py-2 px-4 mb-2"
            />
            <select
              value={stakeholderType}
              onChange={(e) => setStakeholderType(e.target.value)}
              className="border rounded w-full py-2 px-4 mb-2"
            >
              <option value="0">Founder</option>
              <option value="1">Investor</option>
              <option value="2">Employee</option>
            </select>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={whitelistStakeholder}>Whitelist</button>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mb-2">Add Stakeholder</h2>
            <input
              type="text"
              placeholder="Stakeholder Name"
              value={stakeholderName}
              onChange={(e) => setStakeholderName(e.target.value)}
              className="border rounded w-full py-2 px-4 mb-2"
            />
            <input
              type="text"
              placeholder="Stakeholder Address"
              value={stakeholderAddress}
              onChange={(e) => setStakeholderAddress(e.target.value)}
              className="border rounded w-full py-2 px-4 mb-2"
            />
            <input
              type="text"
              placeholder="Vesting Period (seconds)"
              value={vestingPeriod}
              onChange={(e) => setVestingPeriod(e.target.value)}
              className="border rounded w-full py-2 px-4 mb-2"
            />
            <select
              value={stakeholderType}
              onChange={(e) => setStakeholderType(e.target.value)}
              className="border rounded w-full py-2 px-4 mb-2"
            >
              <option value="0">Founder</option>
              <option value="1">Investor</option>
              <option value="2">Employee</option>
            </select>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={addStakeholder}>Add Stakeholder</button>
          </div>
        </>
      )}
    </div>
  );
  
}
