const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              const signer = await ethers.getSigner(deployer)
              const raffleDeployment = await deployments.get("Raffle")
              raffle = await ethers.getContractAt(
                  raffleDeployment.abi,
                  raffleDeployment.address,
                  signer,
              )
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
                  // enter raffle
                  console.log("Setting up test...")
                  const startingTimeStamp = await raffle.getLatestTimeStamp()
                  const accounts = await ethers.getSigners()

                  console.log("Setting up Listener...")
                  await new Promise(async (resolve, reject) => {
                      /* set up listener before we enter the raffle
                      just in case the blockchain moves REALLY fast */
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")
                          try {
                              // add our asserts here
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await ethers.provider.getBalance(
                                  accounts[0].address,
                              )
                              const endingTimeStamp = await raffle.getLatestTimeStamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  (
                                      BigInt(winnerStartingBalance) + BigInt(raffleEntranceFee)
                                  ).toString(),
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })
                      // Then entering the raffle
                  console.log("Entering Raffle...")
                  const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                  await tx.wait(1)
                  console.log("Ok, time to wait...")
                  const winnerStartingBalance = await ethers.provider.getBalance(
                      accounts[0].address,
                  )
                  // and this code won't complete until our listener finishes listening!
                  })
                  
              })
          })
      })
