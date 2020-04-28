import React from "react"
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard"
import { Users } from "react-feather"
import { revenueGeneratedSeries, revenueGenerated } from "./StatisticsData"
import axios from 'axios'

class RevenueGenerated extends React.Component {
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
        icon={<Users  className="danger" size={22} />}
        iconBg="danger"
        stat={this.state.items["statewise"][0]["active"]}
        statTitle="Active"
        options={revenueGenerated}
        series={revenueGeneratedSeries}
        type="area"
      />:null
    )
  }
}
export default RevenueGenerated
