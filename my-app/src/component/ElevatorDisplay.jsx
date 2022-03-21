import React, { createRef } from "react";
import { Data } from "../util/structs";
import {
  Grid,
  Button,
  Sticky,
  Ref,
  Rail,
  Header,
  Segment,
} from "semantic-ui-react";
import ElevatorDisplayPanel from "./ElevatorDisplayPanel";

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

export default class ElevatorDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      floors: [],
      name: "",
      id: 0,
      numberOfFloors: 0,
      selectedFloor: 0,
      data: Data,
      currentFloor: 0,
      selectedFloorInElevetor: function() {},
      moving: false,
    };
  }

  componentDidMount = async() => {
      await sleep(5);
    const { name, id, numberOfFloors, data, currentFloor } = this.props;
    const arrayOfFloor = Array.from(Array(numberOfFloors + 1).keys());
    const floors = arrayOfFloor.reverse();

    this.setState({
      floors: floors,
      id: id,
      name: name,
      numberOfFloors: numberOfFloors,
      data: data,
      currentFloor: currentFloor,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.state.currentFloor !== prevProps.currentFloor) {
        this.setState({ currentFloor: this.props.currentFloor }, function(){this.render()});
        this.setDestinationOnButtonPanel();
      }
      if(this.props.moving !== prevProps.moving) {
          this.setState({moving: this.props.moving});
      }
      if(this.props.destination !== prevProps.destination) {
       
          this.setState({selectedFloor: this.props.destination});
      }
      if(this.props.data !== prevProps.data) {
        this.setState({data:this.props.data});
      }
  }

  setDestinationOnButtonPanel = () => {
    if (Math.abs(this.state.currentFloor - this.state.selectedFloor)===1) {
        this.setState({ moving: false }, function(){this.render()});
      }
  };

  selectDestination = (element, id) => {
    this.setState({ moving: true, selectedFloor: element });
    this.props.selectedFloorInElevetor(element, id); 

  };

  render() {
    const contexRef = createRef();
    const { floors, id } = this.state;
    const btns = floors.map((element) =>
      this.state.moving === true ? (
        element !== this.state.selectedFloor ? (
          <Grid.Column>
            <Button disabled circular color="red">
              {element}
            </Button>{" "}
          </Grid.Column>
        ) : (
          <Grid.Column>
            <Button
              circular
              color="green"
              onClick={() => this.selectDestination(element, id)}
            >
              {element}
            </Button>{" "}
          </Grid.Column>
        )
      ) : (
        <Grid.Column>
          <Button
            circular
            color="green"
            onClick={() => this.selectDestination(element, id)}
          >
            {element}
          </Button>{" "}
        </Grid.Column>
      )
    );
    return (
      <>
        <Ref innerRef={contexRef}>
          <Rail style={{ width: "-webkit-fill-available" }}>
            <Sticky context={contexRef} style={{ border: "5px" }}>
              <Segment style={{ border: "5px", background: "#3f5c5c" }}>
                <Header
                  as="h1"
                  size="huge"
                  block
                  inverted
                  color="red"
                  textAlign="center"
                >
                  {this.state.name}
                </Header>

                <ElevatorDisplayPanel
                  floors={this.state.floors}
                  numberOfFloors={this.state.numberOfFloors}
                  currentFloor={this.state.currentFloor}
                ></ElevatorDisplayPanel>
                <Grid columns={3} container>
                  <Grid.Row textAlign="center">{btns}</Grid.Row>
                </Grid>
              </Segment>
            </Sticky>
          </Rail>
        </Ref>
      </>
    );
  }
}
