import {generateMnemonic, } from "bip39";
import ShowMnemonic from "./components/ShowMnemonic";
export default function Home() {
  const mnemonic=generateMnemonic()
  
  return (
    <div>
          <div>Create wallet</div>
          <ShowMnemonic mnemonic={mnemonic} />
    </div>
  );
}
