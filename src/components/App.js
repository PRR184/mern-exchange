import React, { Component } from 'react'
import './App.css'
import Navbar from './Navbar'
import Content from './Content'
import { connect } from 'react-redux'
import {
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange
} from '../store/interactions'
import { contractsLoadedSelector } from '../store/selectors'

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

    // const web3 = new Web3(window.ethereum)
    // const accounts = await web3.eth.getAccounts()
    // console.log(Token)
    // const token = new web3.eth.Contract(Token.abi, Token.networks["5777"].address)
    // console.log(token)
    // const totalSupply = await token.methods.totalSupply().call()

    // console.log("totalSupply", totalSupply)


    // This code is used in this project.

    // let web3 = new Web3(window.ethereum)
    // if (typeof web3 !== 'undefined') {
    //   App.web3Provider = web3.currentProvider;
    //   web3 = new Web3(web3.currentProvider);
    // } else {
    //   // If no injected web3 instance is detected, fallback to Ganache.
    //   App.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:8545');
    //   web3 = new Web3(App.web3Provider);
    // }

    const web3 = await loadWeb3(dispatch)
    const networkId = await web3.eth.net.getId()
    await loadAccount(web3, dispatch)
    const token = await loadToken(web3, networkId, dispatch)
    if(!token) {
      window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.')
      return
    }
    const exchange = await loadExchange(web3, networkId, dispatch)
    if(!exchange) {
      window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
      return
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        { this.props.contractsLoaded ? <Content /> : <div className="content"></div> }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App)
