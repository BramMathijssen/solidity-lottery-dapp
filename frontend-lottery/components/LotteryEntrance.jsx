import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";

const LotteryEntrance = () => {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  // These get re-rendered every time due to our connect button!
  const chainId = parseInt(chainIdHex);
  // console.log(`ChainId is ${chainId}`)
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("");
  const dispatch = useNotification();

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  async function updateUI() {
    const entranceFeeFromContract = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = await getRecentWinner();
    setEntranceFee(entranceFeeFromContract);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  // reads the raffle entrance fee if web3 is enabled
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const handleSuccess = async (tx) => {
    console.log(tx);
    try {
      await tx.wait(1);
      updateUI();
      handleNewNotification(tx);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5">
      {raffleAddress ? (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async function () {
              await enterRaffle({
                onComplete: () => console.log(`completed tx`),
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <p>
            The entrance fee is:
            {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </p>
          <p>Number of players: {numPlayers}</p>
          <p>Recent Winner: {recentWinner}</p>
        </>
      ) : (
        <div>Not connected to a supported chain</div>
      )}
      <p>Contract deployed at {raffleAddress}</p>
    </div>
  );
};

export default LotteryEntrance;
