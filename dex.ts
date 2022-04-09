import Web3 from 'web3';
import {AbiItem} from 'web3-utils'
import { pancakeswap_factory_abi } from './abi';


const PANCAKESWAP_CONTRACT_ADDRESS = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
const PANCAKESWAP_FACTORY_ADDRESS = "0xca143ce32fe78f1f7019d7d551a6402fc5350c73";
const BSC_ETH_ADDRESS = "0x2170ed0880ac9a755fd29b2688956bd959f933f8";
const BSC_BNB_ADDRESS= "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

export async function getPrices(){
  const web3_bsc = new Web3('https://bsc-dataseed1.binance.org:443');
  console.log(await web3_bsc.eth.net.isListening())
  const contract = new web3_bsc.eth.Contract(pancakeswap_factory_abi as AbiItem[], PANCAKESWAP_FACTORY_ADDRESS);
  await contract.methods.getPair(BSC_BNB_ADDRESS, BSC_ETH_ADDRESS).call({}, function(error: any, success: any){
    console.log({error, success})
  })
}

