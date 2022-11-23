const { ethers, getNamedAccounts } = require("hardhat");

// call with npx hardhat run .\scripts\enterRaffle.js --network localhost
async function main() {
  const { deployer } = await getNamedAccounts();
  const raffle = await ethers.getContract("Raffle", deployer);
  console.log(`got raffle contract at ${raffle.address}`);
  console.log(`caalling enterraffle function`);
  const txResponse = await raffle.enterRaffle({
    value: ethers.utils.parseEther("0.1"),
  });
  const txHash = await txResponse.wait(1);
  console.log(`finished`);
  console.log(txHash);
  const txResponseGetPlayers = await raffle.getNumberOfPlayers();
  console.log(`amount of players if ${txResponseGetPlayers}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
