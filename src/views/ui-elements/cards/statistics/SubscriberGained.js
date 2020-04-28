import React from "react"
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard"
import { Users } from "react-feather"
import { subscribersGained, subscribersGainedSeries } from "./StatisticsData"
import axios from 'axios'

class SubscriberGained extends React.Component {
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
        icon={<Users className="primary" size={22} />}
        stat={this.state.items["statewise"][0]["confirmed"]}
        statTitle="Confirmed"
        options={subscribersGained}
        series={subscribersGainedSeries}
        type="area"
      />:null
    )
  }
}
export default SubscriberGained
