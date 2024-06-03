// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract OrganizationRegistry {
    struct Organization {
        string name;
        address orgAddress;
    }

    mapping(address => Organization) public organizations;
    address[] public orgList;

    event OrganizationRegistered(address orgAddress, string name);

    function registerOrganization(string memory _name) public {
        require(bytes(_name).length > 0, "Organization name cannot be empty");
        require(organizations[msg.sender].orgAddress == address(0), "Organization already registered");

        organizations[msg.sender] = Organization(_name, msg.sender);
        orgList.push(msg.sender);

        emit OrganizationRegistered(msg.sender, _name);
    }

    function getOrganization(address _orgAddress) public view returns (string memory, address) {
        Organization memory org = organizations[_orgAddress];
        require(org.orgAddress != address(0), "Organization not found");
        return (org.name, org.orgAddress);
    }

    function getOrganizations() public view returns (address[] memory) {
        return orgList;
    }
}
