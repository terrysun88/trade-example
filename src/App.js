import React, { Component } from 'react';
import './App.css';
import { getTradePrice } from './api.js';

class App extends Component {

  // using local state to save some information
  constructor(props) {
    super(props);
    this.state = {
      usdBalance: 156.12,
      btcBalance: 0,
      tradeType: 'USD',
      forType: 'BTC',
      trade: '',
      quote: ''
    }


    this._changeTradeType = this._changeTradeType.bind(this);
    this._calculateQuote = this._calculateQuote.bind(this);
    this._trade = this._trade.bind(this);
  }

  // function to handle the trade type change and state update based on the changed value
  _changeTradeType(event) {
    const name = event.target.name;
    const val = event.target.value;

    if (name === "trade") {
      if (val === "USD") {
        this.setState({tradeType: 'USD', forType: 'BTC'});
      }
      else {
        this.setState({tradeType: 'BTC', forType: 'USD'});
      }
    }
    else {
      if (val === "USD") {
        this.setState({tradeType: 'BTC', forType: 'USD'});
      }
      else {
        this.setState({tradeType: 'USD', forType: 'BTC'});
      }
    }

    // initialize the input number to be null after change the trade type
    this.setState({trade: '', quote: ''});
  }

  // calculate the quote with the input value and market price from the public api
  _calculateQuote(event) {
    const val = event.target.value;
    // verify the input value is a number
    if (isNaN(parseFloat(val))) {
      this.setState({trade: '', quote: ''});
    }
    else {
      const usdBalance = this.state.usdBalance;
      const btcBalance = this.state.btcBalance;
      const _this = this;


      getTradePrice(function(data){
        const markekPrice = data.last_price;
        if (_this.state.tradeType === 'USD') {
          if (val <= usdBalance) {
            _this.setState({trade: val, quote: val / markekPrice});
          }
          else {
            _this.setState({trade: usdBalance, quote: usdBalance / markekPrice});
          }
        }
        else {
          if (val <= btcBalance) {
            _this.setState({trade: val, quote: val * markekPrice});
          }
          else {
            _this.setState({trade: btcBalance, quote: btcBalance * markekPrice});
          }
        }
      });
    }
  }

  // trigger the trading function and update the new account balance with the trade value and quote value
  _trade() {
    const tradeValue = this.state.trade;
    const quoteValue = this.state.quote;
    const usdBalance = this.state.usdBalance;
    const btcBalance = this.state.btcBalance;

    if (this.state.tradeType === 'USD') {
      this.setState({usdBalance: usdBalance - tradeValue, btcBalance: btcBalance + quoteValue});
    }
    else {
      this.setState({usdBalance: usdBalance + quoteValue, btcBalance: btcBalance - tradeValue});
    }

    // initialize the input value and quote value to be null
    this.setState({trade: '', quote: ''});
  }

  render() {
    return (
      <div className="App">
        <div>
          <div className="account-balance-section">
            <div className="header">Account Balance</div>
            <div className="account-balance-item">
              <label className="account-type">USD</label>
              <span>{this.state.usdBalance}</span>
            </div>
            <div className="account-balance-item">
              <label className="account-type">BTC</label>
              <span>{this.state.btcBalance}</span>
            </div>
          </div>
          <div className="trade-section">
            <div className="header">Trade</div>
            <select className="select-box" value={this.state.tradeType} name="trade" onChange={this._changeTradeType}>
              <option value="USD">USD</option>
              <option value="BTC">BTC</option>
            </select>
            <input type="text" value={this.state.trade} placeholder="Enter your amount" onChange={this._calculateQuote} className="input-box" />
          </div>
          <div className="for-section">
            <div className="header">For</div>
            <select className="select-box" value={this.state.forType} name="for" onChange={this._changeTradeType}>
              <option value="USD">USD</option>
              <option value="BTC">BTC</option>
            </select>
            <input type="text" value={this.state.quote} placeholder="Display Quote" className="input-box" />
          </div>
        </div>
        <button onClick={this._trade}>Trade</button>
      </div>
    );
  }
}

export default App;
