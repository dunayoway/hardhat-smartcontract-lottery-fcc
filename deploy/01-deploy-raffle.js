const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.parseEther("100") // 100000000000000000000 = 100 LINK

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    const chainId = network.config.chainId
    let vrfCoordinatorV2_5Address, subscriptionId, vrfCoordinatorV2_5Mock

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2_5MockDeployment = await deployments.get("VRFCoordinatorV2_5Mock")
        vrfCoordinatorV2_5Address = vrfCoordinatorV2_5MockDeployment.address
        vrfCoordinatorV2_5Mock = await ethers.getContractAt(
            "VRFCoordinatorV2_5Mock",
            vrfCoordinatorV2_5Address,
            signer,
        )
        const transactionResponse = await vrfCoordinatorV2_5Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.logs[0].args.subId
        // Fund the suscription
        // Usually, you'd the LINK token on a real network
        await vrfCoordinatorV2_5Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2_5Address = networkConfig[chainId]["vrfCoordinatorV2_5"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    // const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]

    const args = [vrfCoordinatorV2_5Address, entranceFee, gasLane, subscriptionId, interval]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("Deployed Raffle!")
    log("----------------------------------------------------")

    developmentChains.includes(network.name) &&
        (await vrfCoordinatorV2_5Mock.addConsumer(subscriptionId, raffle.address))

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(raffle.address, args)
        log("--------------------------------------")
    }
}

module.exports.tags = ["all", "raffle"]
