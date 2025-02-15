const { deployments, ethers, getNamedAccounts, network } = require("hardhat")

let deployer, signer

async function mockKeepers() {
    deployer = (await getNamedAccounts()).deployer
    signer = await ethers.getSigner(deployer)
    const raffleDeployment = await deployments.get("Raffle")
    const raffle = await ethers.getContractAt(
        raffleDeployment.abi,
        raffleDeployment.address,
        signer,
    )
    const checkdata = ethers.keccak256(ethers.toUtf8Bytes(""))
    const { upkeepNeeded } = await raffle.checkUpkeep.staticCall(checkdata)
    if (upkeepNeeded) {
        const tx = await raffle.performUpkeep(checkdata)
        const txReceipt = await tx.wait(1)
        const requestId = txReceipt.logs[1].args.requestId
        console.log(`Performed upkeep with RequestId: ${requestId}`)
        if (network.name == "localhost") {
            await mockVrf(requestId, raffle)
        }
    } else {
        console.log("No upkeep needed!")
    }
}

async function mockVrf(requestId, raffle) {
    console.log("We on a local network? Ok let's pretend...")
    const vrfCoordinatorV2_5MockDeployment = await deployments.get("VRFCoordinatorV2_5Mock")
    const vrfCoordinatorV2_5Mock = await ethers.getContractAt(
        vrfCoordinatorV2_5MockDeployment.abi,
        vrfCoordinatorV2_5MockDeployment.address,
        signer,
    )
    await vrfCoordinatorV2_5Mock.fulfillRandomWords(requestId, raffle.target)
    console.log("Responded!")
    const recentWinner = await raffle.getRecentWinner()
    console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
