  import axios from 'axios';
import { Row, Col } from "reactstrap"
import SubscribersGained from "../ui-elements/cards/statistics/SubscriberGained"
import RevenueGenerated from "../ui-elements/cards/statistics/RevenueGenerated"
import QuaterlySales from "../ui-elements/cards/statistics/QuaterlySales"
import OrdersReceived from "../ui-elements/cards/statistics/OrdersReceived"
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';

import LinearGradient from './LinearGradient.js';
import './App.css';
import {
  Card,
  CardHeader,
  CardTitle,
  Table,
  UncontrolledTooltip,
  Progress
} from "reactstrap" 


const INDIA_TOPO_JSON = require('./india.topo.json');

const PROJECTION_CONFIG = {
  scale: 600,
  center: [78.9629, 22.5937] // always in [East Latitude, North Longitude]
};

// Red Variants
const COLOR_RANGE = [
  '#ffedea',
  '#ffcec5',
  '#ffad9f',
  '#ff8a75',
  '#ff5533',
  '#e2492d',
  '#be3d26',
  '#9a311f',
  '#782618'
];

const DEFAULT_COLOR = '#EEE';

const getRandomInt = () => {
  return parseInt(Math.random() * 100);
};

const geographyStyle = {
  default: {
    outline: 'none'
  },
  hover: {
    fill: '#ccc',
    transition: 'all 250ms',
    outline: 'none'
  },
  pressed: {
    outline: 'none'
  }
};

// will generate random heatmap data on every call
const getHeatMapData = (props) => {
  return [
    { id: 'AP', state: 'Andhra Pradesh', value:  props["statewise"][8]["confirmed"]},
    { id: 'AR', state: 'Arunachal Pradesh', value: props["statewise"][32]["confirmed"] },
    { id: 'AS', state: 'Assam', value: props["statewise"][22]["confirmed"] },
    { id: 'BR', state: 'Bihar', value: props["statewise"][16]["confirmed"] },
    { id: 'CT', state: 'Chhattisgarh', value:props["statewise"][21]["confirmed"] },
    { id: 'GA', state: 'Goa', value: props["statewise"][28]["confirmed"]},
    { id: 'GJ', state: 'Gujarat', value: props["statewise"][2]["confirmed"] },
    { id: 'HR', state: 'Haryana', value: props["statewise"][15]["confirmed"] },
    { id: 'HP', state: 'Himachal Pradesh', value: props["statewise"][20]["confirmed"] },
    { id: 'JH', state: 'Jharkhand', value: props["statewise"][18]["confirmed"] },
    { id: 'KA', state: 'Karnataka', value: props["statewise"][12]["confirmed"] },
    { id: 'KL', state: 'Kerala', value: props["statewise"][13]["confirmed"] },
    { id: 'MP', state: 'Madhya Pradesh', value: props["statewise"][5]["confirmed"] },
    { id: 'MH', state: 'Maharashtra', value: props["statewise"][1]["confirmed"] },
    { id: 'MN', state: 'Manipur', value: props["statewise"][29]["confirmed"] },
    { id: 'ML', state: 'Meghalaya', value: props["statewise"][26]["confirmed"] },
    { id: 'MZ', state: 'Mizoram', value: props["statewise"][31]["confirmed"] },
    { id: 'NL', state: 'Nagaland', value: props["statewise"][33]["confirmed"] },
    { id: 'OD', state: 'Odisha', value: props["statewise"][17]["confirmed"] },
    { id: 'PB', state: 'Punjab', value: props["statewise"][14]["confirmed"] },
    { id: 'RJ', state: 'Rajasthan', value: props["statewise"][4]["confirmed"] },
    { id: 'SK', state: 'Sikkim',value: props["statewise"][37]["confirmed"] },
    { id: 'TN', state: 'Tamil Nadu', value: props["statewise"][6]["confirmed"] },
    { id: 'TS', state: 'Telangana', value: props["statewise"][9]["confirmed"] },
    { id: 'TR', state: 'Tripura', value: props["statewise"][30]["confirmed"]},
    { id: 'UK', state: 'Uttarakhand', value: props["statewise"][19]["confirmed"] },
    { id: 'UP', state: 'Uttar Pradesh', value: props["statewise"][7]["confirmed"] },
    { id: 'WB', state: 'West Bengal', value: props["statewise"][10]["confirmed"] },
    { id: 'WB', state: 'West Bengal', value: props["statewise"][10]["confirmed"] },
    { id: 'AN', state: 'Andaman and Nicobar Islands', value: props["statewise"][24]["confirmed"] },
    { id: 'CH', state: 'Chandigarh', value: props["statewise"][23]["confirmed"] },
    { id: 'DN', state: 'Dadra and Nagar Haveli',value:props["statewise"][34]["confirmed"]},
    { id: 'DD', state: 'Daman and Diu', value:props["statewise"][35]["confirmed"] },
    { id: 'DL', state: 'Delhi', value: props["statewise"][3]["confirmed"] },
    { id: 'JK', state: 'Jammu and Kashmir', value: props["statewise"][11]["confirmed"] },
    { id: 'LA', state: 'Ladakh', value: props["statewise"][25]["confirmed"] },
    { id: 'LD', state: 'Lakshadweep', value: props["statewise"][36]["confirmed"] },
    { id: 'PY', state: 'Puducherry', value: props["statewise"][27]["confirmed"] }
  ];
};

function Page2(props) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [data, setData] = useState(getHeatMapData(props));

  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
  };

  const colorScale = scaleQuantile()
    .domain(data.map(d => d.value))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: 'NA' }) => {
    return () => {
      setTooltipContent(`${geo.properties.name}: ${current.value}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
  };

  const onChangeButtonClick = () => {
    setData(getHeatMapData());
  };

  return (
    <div className="full-width-height container">
      <h1 className="no-margin center">States and UTs</h1>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
        <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          width={800}
          height={320}
          data-tip=""
        >
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map(geo => {
                //console.log(geo.id);
                const current = data.find(s => s.id === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                    style={geographyStyle}
                    onMouseEnter={onMouseEnter(geo, current)}
                    onMouseLeave={onMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        <LinearGradient data={gradientData} />
    </div>
  );
}

class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      states: [
        "Andhra Pradesh",
                "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chhattisgarh",
                "Goa",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jammu and Kashmir",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "Odisha",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttarakhand",
                "Uttar Pradesh",
                "West Bengal",
                "Andaman and Nicobar Islands",
                "Chandigarh",
                "Dadra and Nagar Haveli",
                "Daman and Diu",
                "Delhi",
                "Lakshadweep",
                "Puducherry"
      ]
    };
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
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          self.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
    return (
      <React.Fragment>
        <h2 className="brand-text mb-0 navbar-brand center">Covid_India</h2>
        <br></br>
        <br></br>
      <Row className="match-height">
          <Col lg="3" md="6" sm="6">
            <SubscribersGained />
          </Col>
          <Col lg="3" md="6" sm="6">
            <RevenueGenerated />
          </Col>
          <Col lg="3" md="6" sm="6">
            <QuaterlySales />
          </Col>
          <Col lg="3" md="6" sm="6">
            <OrdersReceived />
          </Col>
        </Row>
        <Page2  {...items} />
      <Card>
        <CardHeader>
          <CardTitle>Statewise data</CardTitle>
        </CardHeader>
        <Table
          responsive
          className="dashboard-table table-hover-animation mb-0 mt-1"
        >
          <thead>
            <tr>
              <th>State/UT</th>
              <th>Confirmed</th>
              <th>Active</th>
              <th>Recovered</th>
              <th>Deceased</th>
            </tr>
          </thead>
          <tbody>
          {this.state.items["statewise"].map(
            states => 
            <tr>
            <td>{states["state"]}</td>
                 <td>
          <span>{states["confirmed"]}</span>  
                 </td>
                 <td className="p-1">
                 {states["active"]}
                 </td>
          <td>{states["recovered"]}</td>
                 <td>
          <span>{states["deaths"]}</span>
                 </td>
                </tr>
                     )} 
            </tbody>
        </Table>
      </Card>
      </React.Fragment>
    )
    }
  }
}

export default Home