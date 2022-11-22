import { useMoralis } from "react-moralis";
import { useEffect } from "react";

const CustomHeader = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  // Als isWeb3Enabled true is wordt deze useEffect uitgevoerd,
  // waarmee we enableWeb3() aanroepen
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  // We checken of we van account veranderd zijn.
  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("null account found");
      }
    });
  }, []);

  return (
    <div>
      {account ? (
        <div>Connected to {account}</div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            if (typeof window !== "undefined") {
              window.localStorage.setItem("connected", "injected");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default CustomHeader;
