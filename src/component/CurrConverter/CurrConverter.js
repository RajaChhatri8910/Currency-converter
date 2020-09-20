import React from "react";
import axios from "axios";
import { LineChart } from 'react-chartkick';
import 'chart.js';

var date = [];
var obj = {}
var renderChart;
var sDate = '2018-08-01';
var eDate = '2020-12-31';
class Converter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      fromCurrency: "USD",
      toCurrency: "GBP",
      amount: 1,
      currencies: [],
      fromChart: "INR",
      toChart: "USD",
      name: 'React',
      x: {},
    };
  };

  componentDidMount = () => {
    axios
      .get("https://api.exchangeratesapi.io/latest")
      .then(response => {
        const currencyAr = [];
        for (const key in response.data.rates) {
              currencyAr.push(key);
        }
        this.setState({ currencies: currencyAr });
      })
      .catch(err => {
        console.log("Error----->", err);
      });
  };
  convertHandler = () => {
    if (this.state.fromCurrency !== this.state.toCurrency) {
      axios
        .get(
          "https://api.exchangeratesapi.io/latest?symbols=" +
          this.state.fromCurrency + ',' + this.state.toCurrency + '&base=' + this.state.fromCurrency
        )
        .then(response => {
          const result =
            this.state.amount * response.data.rates[this.state.toCurrency];
          this.setState({ result: result.toFixed(5) });
        })
        .catch(error => {
          console.log("Error ---->", error.message);
        });
    } else {
      this.setState({ result: "Cannot convert same currency" });
    }
  };
  selectHandler = event => {
    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value });
    } else {
      if (event.target.name === "to") {
        this.setState({ toCurrency: event.target.value });
      }
    }
    if (event.target.name === "fromChart") {
      this.setState({ fromChart: event.target.value });
    } else {
      if (event.target.name === "toChart") {
        this.setState({ toChart: event.target.value });
      }
    }
  };

  chartHandler = () => {
    axios
      .get(
        "https://api.exchangeratesapi.io/history?start_at=" + sDate + "&end_at=" + eDate + "&symbols=" +
        this.state.fromChart + ',' + this.state.toChart + '&base=' + this.state.toChart
      )
      .then(response => {
        for (let i in response.data.rates) {
          date.push(i);
        }
        if (date.length) {
          date.forEach((e) => {
            obj[e] = response.data.rates[e]['INR']
          })
        }
        this.setState({ x: obj });
      })
      .catch(error => {
        console.log("Error ---->", error.message);
      });
  };
  render() {
    if (date.length) {
      renderChart = <LineChart data={this.state.x} />
    } else {
      renderChart = <p>Click on "Show trends" to display chart</p>
    }
    return (
      <div className="Converter">
        <h2>
          <span>Currency</span>&nbsp;&nbsp;Converter
        </h2>
        <div className="From">
          <input
            name="amount"
            type="text"
            value={this.state.amount}
            onChange={event => this.setState({ amount: event.target.value })}
          />
          <select
            name="from"
            onChange={event => this.selectHandler(event)}
            value={this.state.fromCurrency}
          >
            {this.state.currencies.map(cur => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
          <select
            name="to"
            onChange={event => this.selectHandler(event)}
            value={this.state.toCurrency}
          >
            {this.state.currencies.map(cur => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
          <button onClick={this.convertHandler}>Convert</button>
          {this.state.result && <h3>{this.state.result}</h3>}

          <select
            name="fromChart"
            value={this.state.fromChart.value}
          >
            <option value="INR">INR</option>
          </select>

          <select
            name="toChart"
            onChange={event => this.selectHandler(event)}
            value={this.state.toChart}
          >
            {this.state.currencies.map(cur => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
          <button onClick={this.chartHandler}>Show trends</button>
        </div>
        <div>
          <h4>{this.state.fromChart} vs {this.state.toChart} Trend [Period = {sDate} TO {eDate}]</h4>
          <p>
            {renderChart}
            <br />
            <br />
            <br />
          </p>
        </div>
      </div>
    );

  }
}
export default Converter;