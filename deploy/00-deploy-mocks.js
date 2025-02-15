const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

/* 0.25 is the premium LINK/Oracle gas it costs per random number request */
const BASE_FEE = "100000000000000000" // ethers.parseEther("0.25")
const GAS_PRICE_LINK = "1000000000" // = 1 * 10^9 // LINK per gas. calculated value based on the gas price of the chain
const WEI_PER_UNIT_LINK = "7895188697669687"

/* For instance, if Eth price skyrockets ⏫ $1,000,000,000,
 Chainlink Nodes pay the gas fee to give us randomness 
 and do external execution. So the price of requests changes 
 based on the price of gas */

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK, WEI_PER_UNIT_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        // deploy mock vrfcoordinator...
        await deploy("VRFCoordinatorV2_5Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        log("Deployed Mocks!")
        log("----------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
