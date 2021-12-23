export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
export const GREEN = 'success'
export const RED = 'danger'

export const DECIMALS = (10**18)

// Shortcut to avoid passing around web3 connection
export const ether = (wei) => {
  if(wei) {
    return(wei / DECIMALS) // 18 decimal places
  }
}

// Tokens and ether havesame decimal resolution
export const tokens = ether


// export const loadWeb3 = (dispatch)=>{
//     let web3 = new Web3(window.ethereum)
//     if (typeof web3 !== 'undefined') {
//       web3 = new Web3(web3.currentProvider);
//     } else {
//       // If no injected web3 instance is detected, fallback to Ganache.
//       const web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:8545');
//       web3 = new Web3(web3Provider);
//     }
//     dispatch(web3Loaded(web3));
//     return web3;
// }
