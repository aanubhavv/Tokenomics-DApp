import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import OrganizationRegistry from 'D:/Programming/Solidity/ETH Advanced/Tokenomics-DApp/artifacts/contracts/org.sol/OrganizationRegistry.json';
import StakeholderManagement from 'D:/Programming/Solidity/ETH Advanced/Tokenomics-DApp/artifacts/contracts/manage.sol/StakeholderManagement.json';

const ORGANIZATION_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_ORGANIZATION_REGISTRY_ADDRESS;
const STAKEHOLDER_MANAGEMENT_ADDRESS = process.env.NEXT_PUBLIC_STAKEHOLDER_MANAGEMENT_ADDRESS;

export default function Admin() {
  const [orgName, setOrgName] = useState('');
  const [stakeholderName, setStakeholderName] = useState('');
  const [stakeholderAddress, setStakeholderAddress] = useState('');
  const [stakeholderType, setStakeholderType] = useState('0');
  const [vestingPeriod, setVestingPeriod] = useState('');
  const [whitelistAddress, setWhitelistAddress] = useState('');
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
      alert('Please connect to your wallet');
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      setWalletConnected(true);
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
      const connectedAddress = await signer.getAddress();
      setAddress(connectedAddress); // Update connected address
    } catch (err) {
      console.error(err);
      alert('Failed to connect wallet');
    }
  }

  async function registerOrganization() {
    if (!orgName) return;

    try {
      const orgRegistryContract = new ethers.Contract(ORGANIZATION_REGISTRY_ADDRESS, OrganizationRegistry.abi, signer);
      const tx = await orgRegistryContract.registerOrganization(orgName);
      await tx.wait();
      alert('Organization registered successfully');
    } catch (err) {
      console.error(err);
      var error = JSON.stringify(err)
      if(error.includes('Organization already registered')){
        alert('Organization is already registered for this address');
      }
      else{
        alert('Error registering organization');
      }
    }
  }

  async function whitelistStakeholder() {
    if (!whitelistAddress) return;

    try {
      const stakeholderManagementContract = new ethers.Contract(STAKEHOLDER_MANAGEMENT_ADDRESS, StakeholderManagement.abi, signer);
      const tx = await stakeholderManagementContract.whitelistAddress(whitelistAddress, stakeholderType);
      await tx.wait();
      alert('Address whitelisted successfully');
    } catch (err) {
      console.error(err);
      alert('Error whitelisting address');
    }
  }

  async function addStakeholder() {
    if (!stakeholderName || !stakeholderAddress || !vestingPeriod) return;

    try {
      const stakeholderManagementContract = new ethers.Contract(STAKEHOLDER_MANAGEMENT_ADDRESS, StakeholderManagement.abi, signer);
      const tx = await stakeholderManagementContract.addStakeholder(stakeholderName, stakeholderAddress, stakeholderType, vestingPeriod);
      await tx.wait();
      alert('Stakeholder added successfully');
    } catch (err) {
      console.error(err);
      alert(err)
      alert('Error adding stakeholder');
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
        <span className="text-xl font-bold">Admin Page</span>
        <div className="flex space-x-4">
          <a href="#register-organization" className="text-gray-300 hover:text-white">Register Organization</a>
          <a href="#whitelist-stakeholder" className="text-gray-300 hover:text-white">Whitelist Stakeholder</a>
          <a href="#add-stakeholder" className="text-gray-300 hover:text-white">Add Stakeholder</a>
        </div>
        {!walletConnected ? (
          <button
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <button className="flex items-center space-x-2 bg-gray-600 text-lg font-semibold px-4 py-2 rounded-full text-blue-400" style={{ minWidth: '190px' }}>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="uppercase">{shortenAddress(addr)}</span>
          </button>
        )}
      </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        {walletConnected && (
          <>
            <div id="register-organization" className="mb-8 p-6 rounded-lg shadow-lg bg-gray-800">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Register Organization</h2>
              <input
                type="text"
                placeholder="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="border rounded w-full py-2 px-4 mb-4 bg-gray-700 text-gray-300 border-gray-600 placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105" onClick={registerOrganization}>
                Register
              </button>
            </div>
            <div id="whitelist-stakeholder" className="mb-8 p-6 rounded-lg shadow-lg bg-gray-800">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Whitelist Stakeholder Address</h2>
              <input
                type="text"
                placeholder="Address"
                value={whitelistAddress}
                onChange={(e) => setWhitelistAddress(e.target.value)}
                className="border rounded w-full py-2 px-4 mb-4 bg-gray-700 text-gray-300 border-gray-600 placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <div className="relative mb-4">
                <select
                  value={stakeholderType}
                  onChange={(e) => setStakeholderType(e.target.value)}
                  className="block appearance-none w-full bg-gray-700 border border-gray-600 text-gray-300 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-400"
                >
                  <option value="0">Founder</option>
                  <option value="1">Investor</option>
                  <option value="2">Employee</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>
              <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105" onClick={whitelistStakeholder}>
                Whitelist
              </button>
            </div>
            <div id="add-stakeholder" className="p-6 rounded-lg shadow-lg bg-gray-800">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Add Stakeholder</h2>
              <input
                type="text"
                placeholder="Stakeholder Name"
                value={stakeholderName}
                onChange={(e) => setStakeholderName(e.target.value)}
                className="border rounded w-full py-2 px-4 mb-4 bg-gray-700 text-gray-300 border-gray-600 placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <input
                type="text"
                placeholder="Stakeholder Address"
                value={stakeholderAddress}
                onChange={(e) => setStakeholderAddress(e.target.value)}
                className="border rounded w-full py-2 px-4 mb-4 bg-gray-700 text-gray-300 border-gray-600 placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <input
                type="text"
                placeholder="Vesting Period (seconds)"
                value={vestingPeriod}
                onChange={(e) => setVestingPeriod(e.target.value)}
                className="border rounded w-full py-2 px-4 mb-4 bg-gray-700 text-gray-300 border-gray-600 placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <div className="relative mb-4">
                <select
                  value={stakeholderType}
                  onChange={(e) => setStakeholderType(e.target.value)}
                  className="block appearance-none w-full bg-gray-700 border border-gray-600 text-gray-300 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-400"
                >
                  <option value="0">Founder</option>
                  <option value="1">Investor</option>
                  <option value="2">Employee</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>
              <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105" onClick={addStakeholder}>
                Add Stakeholder
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
