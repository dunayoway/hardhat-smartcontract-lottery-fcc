const { ethers, deployments } = require("hardhat")

async function enterRaffle() {
    const accounts = await ethers.getSigners()
    const player = accounts[0]
    const raffleDeployment = await deployments.get("Raffle")
    const raffle = await ethers.getContractAt("Raffle", raffleDeployment.address, player)
    const entranceFee = await raffle.getEntranceFee()
    await raffle.enterRaffle({ value: entranceFee })
    console.log("Entered Raffle!")
}

enterRaffle()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
