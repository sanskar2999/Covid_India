import React from "react"
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard"
import { Users } from "react-feather"
import { ordersReceived, ordersReceivedSeries } from "./StatisticsData"
import axios from 'axios'

class OrdersReceived extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    }
  }
  componentDidMount() { 
    var self = this;
    axios.get(`https://api.covid19india.org/data.json`)
      .then(res => {
        self.setState({
          isLoaded: true, 
          items:res.data 
        });
        console.log(self.state.items["statewise"][0]["deaths"]);
      },
      (error) => {
        self.setState({
          isLoaded: true,
          error
        });
      }
    )
    }
    
  render() {
    return (
      this.state.isLoaded ? 
      <StatisticsCard
        icon={<Users className="warning" size={22} />}
        iconBg="warning"
        stat={this.state.items["statewise"][0]["deaths"]}
        statTitle="Death"
        options={ordersReceived}
        series={ordersReceivedSeries}
        type="area"
      />  :null 
    )
  }
}
export default OrdersReceived
