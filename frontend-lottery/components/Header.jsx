import React from "react";
import { ConnectButton } from "@web3uikit/web3";

const Header = () => {
  return (
    <div className="border-b-2 border-pink-600 flex flex-row">
      <h1 className="py-4 px-4 text-stone-50 font-blog text-3xl">SoLucky Lottery</h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
};

export default Header;
