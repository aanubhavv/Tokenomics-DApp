// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./org.sol";

contract StakeholderManagement {
    OrganizationRegistry orgRegistry;

    enum StakeholderType { Founder, Investor, Employee }
    struct Stakeholder {
        string name;
        address stakeholderAddress;
        StakeholderType stakeholderType;
        uint256 vestingPeriod; // Vesting period in seconds
        uint256 startTime; // Time when stakeholder was added
        bool claimed; // Whether the tokens have been claimed
    }

    mapping(address => Stakeholder[]) public organizationStakeholders;
    mapping(address => mapping(StakeholderType => address[])) public whitelistedAddresses;

    event StakeholderAdded(address orgAddress, address stakeholderAddress, string name, StakeholderType stakeholderType, uint256 vestingPeriod);
    event AddressWhitelisted(address orgAddress, address stakeholderAddress, StakeholderType stakeholderType);
    event TokensClaimed(address orgAddress, address stakeholderAddress, string name, StakeholderType stakeholderType);

    constructor(address _orgRegistryAddress) {
        orgRegistry = OrganizationRegistry(_orgRegistryAddress);
    }

    modifier onlyRegisteredOrg() {
        (string memory name, address orgAddress) = orgRegistry.getOrganization(msg.sender);
        require(orgAddress != address(0), "Caller is not a registered organization");
        _;
    }

    function addStakeholder(
        string memory _name,
        address _stakeholderAddress,
        StakeholderType _stakeholderType,
        uint256 _vestingPeriod
    ) public onlyRegisteredOrg {
        require(bytes(_name).length > 0, "Stakeholder name cannot be empty");
        require(_stakeholderAddress != address(0), "Invalid stakeholder address");

        // Check if the address is whitelisted
        require(isWhitelisted(msg.sender, _stakeholderType, _stakeholderAddress), "Address not whitelisted for this stakeholder type");

        organizationStakeholders[msg.sender].push(Stakeholder({
            name: _name,
            stakeholderAddress: _stakeholderAddress,
            stakeholderType: _stakeholderType,
            vestingPeriod: _vestingPeriod,
            startTime: block.timestamp,
            claimed: false
        }));

        emit StakeholderAdded(msg.sender, _stakeholderAddress, _name, _stakeholderType, _vestingPeriod);
    }

    function whitelistAddress(address _stakeholderAddress, StakeholderType _stakeholderType) public onlyRegisteredOrg {
        whitelistedAddresses[msg.sender][_stakeholderType].push(_stakeholderAddress);
        emit AddressWhitelisted(msg.sender, _stakeholderAddress, _stakeholderType);
    }

    function isWhitelisted(address orgAddress, StakeholderType _stakeholderType, address _stakeholderAddress) public view returns (bool) {
        address[] memory whitelist = whitelistedAddresses[orgAddress][_stakeholderType];
        for (uint256 i = 0; i < whitelist.length; i++) {
            if (whitelist[i] == _stakeholderAddress) {
                return true;
            }
        }
        return false;
    }

    function getStakeholders(address _orgAddress) public view returns (Stakeholder[] memory) {
        return organizationStakeholders[_orgAddress];
    }

    function claimTokens(address _orgAddress) public {
        Stakeholder[] storage stakeholders = organizationStakeholders[_orgAddress];
        for (uint256 i = 0; i < stakeholders.length; i++) {
            if (stakeholders[i].stakeholderAddress == msg.sender && block.timestamp >= stakeholders[i].startTime + stakeholders[i].vestingPeriod && !stakeholders[i].claimed) {
                stakeholders[i].claimed = true;
                emit TokensClaimed(_orgAddress, stakeholders[i].stakeholderAddress, stakeholders[i].name, stakeholders[i].stakeholderType);
                // Transfer tokens or implement your claiming logic here
            }
        }
    }
}
