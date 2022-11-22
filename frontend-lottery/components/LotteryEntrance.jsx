import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { useMoralis } from "react-moralis";

const LotteryEntrance = () => {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  // These get re-rendered every time due to our connect button!
  const chainId = parseInt(chainIdHex);
  // console.log(`ChainId is ${chainId}`)
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  // reads the raffle entrance fee if web3 is enabled
  useEffect(() => {
    if (isWeb3Enabled) {
      // pattern om async function in een useEffect te gebruiken
      async function updateUI() {
        const entranceFeeFromContract = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromContract);
        console.log(`entrance fee from contract is ${entranceFeeFromContract}`);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      <h1>LotteryEntrance</h1>
      <p>The entrance fee is: {entranceFee}</p>
    </div>
  );
};

export default LotteryEntrance;
