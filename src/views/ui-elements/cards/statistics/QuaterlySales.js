import React from "react"
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard"
import { Users  } from "react-feather"
import { quaterlySales, quaterlySalesSeries } from "./StatisticsData"
import axios from 'axios'

class QuaterlySales extends React.Component {
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
        icon={<Users className="success" size={22} />}
        iconBg="success"
        stat={this.state.items["statewise"][0]["recovered"]}
        statTitle="Recovered"
        options={quaterlySales}
        series={quaterlySalesSeries}
        type="area"
      /> :null
    )
  }
}
export default QuaterlySales
