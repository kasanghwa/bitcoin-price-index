import React, {Component} from "react";
import Header from "./components/Header";
import "./App.css";
import _ from "lodash";
import {Line, Chart} from "react-chartjs-2";
import currencies from "./supported-currencies.json";

console.log(currencies);

const DEFAULT_CURRENCY = "USD";
class App extends Component {
  constructor(props) {
    super(props);

    // chart.js defaults
    Chart.defaults.global.defaultFontColor = "#000";
    Chart.defaults.global.defaultFontSize = 16;

    this.state = {
      historicalData: null,
      currency: DEFAULT_CURRENCY,
      baseUrl: "",
    };
    this.onCurrencySelect = this.onCurrencySelect.bind(this);
  }

  componentDidMount() {
    this.getBitcoinData();
  }

  getBitcoinData() {
    const {currency} = this.state;
    fetch(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=${currency}&limit=1000`
    )
      .then((r) => r.json())
      .then((d) => {
        console.log(d.Data.Data);
        const r = {};
        for (const x of d.Data.Data)
          r[new Date(1000 * x.time).toISOString().substring(0, 10)] = x.close;
        return {bpi: r};
      })
      .then((historicalData) => {
        console.log(historicalData);
        this.setState({historicalData});
      })
      .catch((e) => {
        console.log(e);
      });
  }

  options() {
    return {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              userCallback: function (value, index, values) {
                return value.toLocaleString(); // this is all we need
              },
            },
          },
        ],
      },
    };
  }

  formatChartData() {
    try {
      const {bpi} = this.state.historicalData;
      console.log(bpi);
      // const labels = _.map(_.keys(bpi), (date) => moment(date).format("ll"));
      const labels = _.keys(bpi);
      const values = _.values(bpi);
      console.log(labels);
      console.log(values);
      return {
        labels: labels,
        datasets: [
          {
            label: "Bitcoin",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            // borderColor: "rgba(75,192,192,1)",
            borderColor: "rgba(0,0,0,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 10,
            data: values,
          },
        ],
      };
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  setCurrency(currency) {
    this.setState({currency}, this.getBitcoinData);
  }

  onCurrencySelect(e) {
    this.setCurrency(e.target.value);
  }

  render() {
    console.log(this.state.historicalData);
    if (this.state.historicalData) {
      return (
        <div className="app">
          <Header title="CRYPTO PRICE INDEX" />

          <div className="select-container">
            <span style={{fontSize: 18, fontFamily: "Bungee"}}>
              {" "}
              Select your currency:{" "}
            </span>
            <select
              value={this.state.currency}
              onChange={this.onCurrencySelect}
            >
              {currencies.map((obj, index) => (
                <option key={`${index}-${obj.country}`} value={obj.currency}>
                  {" "}
                  {obj.country}{" "}
                </option>
              ))}
            </select>
            {this.state.currency !== DEFAULT_CURRENCY && (
              <div>
                <a
                  className="link"
                  onClick={() => this.setCurrency(DEFAULT_CURRENCY)}
                  style={{color: "black", fontSize: 16, fontFamily: "Bungee"}}
                >
                  {" "}
                  [CLICK HERE TO RESET]{" "}
                </a>
              </div>
            )}
          </div>

          <div style={{marginTop: 10}}>
            <Line
              data={this.formatChartData()}
              options={this.options()}
              height={100}
            />
          </div>
        </div>
      );
    }

    return null;
  }
}

export default App;
