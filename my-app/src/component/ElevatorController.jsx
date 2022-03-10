import React, { createRef } from "react";
import { Grid, Button, Sticky, Ref, Rail, Header, Segment } from "semantic-ui-react";
import ElevatorDisplayPanel from "./ElevatorDisplayPanel";

export default class ElevatorController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      floors: [],
      name: "",
      currentFloor: 0,
      numberOfFloor: 0,
      moving: false,
      selectedFloorInElevetor: function() {},
      selectedFloor: 0,
      isMoving: function(){},
    };
  }
  componentDidMount() {
    const {
      name,
      currentFloor,
      numberOfFloor,
      selectedFloorInElevetor,
      moving,
      destination,
      isMoving,
    } = this.props;
    const arrayOfFloor = Array.from(Array(numberOfFloor + 1).keys());
    const floors = arrayOfFloor.reverse();

    this.setState({
      floors: floors,
      name: name,
      currentFloor: currentFloor,
      numberOfFloor: numberOfFloor,
      selectedFloorInElevetor: selectedFloorInElevetor,
      moving: moving,
      selectedFloor: destination,
      isMoving: isMoving,
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
  }

  setDestinationOnButtonPanel = () => {
    if (Math.abs(this.state.currentFloor - this.state.selectedFloor)===1) {
        this.setState({ moving: false }, function(){this.render()});
      }
  };

  selectDestination = (element, name) => {
    this.setState({ moving: true, selectedFloor: element });
    this.state.selectedFloorInElevetor(element, name);
    this.state.isMoving(name)
  };

  render() {
    const contexRef = createRef();
    const { floors, name } = this.state;
    const btns = floors.map((element) =>
      this.state.moving === true ? (
        element !== this.state.selectedFloor ? (
          <Grid.Column>
            <Button  disabled circular color="red">
              {element}
            </Button>{" "}
          </Grid.Column>
        ) : (
          <Grid.Column>
            <Button
              circular
              color="green"
              onClick={() => this.selectDestination(element, name)}
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
            onClick={() => this.selectDestination(element, name)}
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
            <Sticky context={contexRef} style={{  border: "5px" }} >
              <Segment  style={{  border: "5px" , background:"#3f5c5c"}}>
              <Header as='h1' size="huge" block inverted color="red" textAlign="center">{this.state.name}</Header>
        
              <ElevatorDisplayPanel
                floors={this.state.floors}
                numberOfFloors={this.state.numberOfFloor}
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
