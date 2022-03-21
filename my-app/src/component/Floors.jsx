import React from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import { Data } from "../util/structs";
import Floor from "./Floor";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class Floors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      floors: [],
      directionA: 0,
      directionB: 0,
      currentA: 0,
      currentB: 0,
      loading: 0,
      data: Data,
    };
  }

  componentDidMount = async () => {
    await sleep(10);
    const {
      numberOfFloors,
      directionA,
      directionB,
      currentA,
      currentB,
      loading,
      data,
    } = this.props;
    const arrayOfFloors = Array.from(Array(numberOfFloors + 1).keys());
    const floors = arrayOfFloors.reverse();
    this.setState({
      floors: floors,
      directionA: directionA,
      directionB: directionB,
      currentA: currentA,
      currentB: currentB,
      loading: loading,
      data: data,
    });
  };
  componentDidUpdate(prevProps) {
    if (this.props.loading !== prevProps.loading) {
      this.setState({ loading: this.props.loading });
    }
    if (
      this.props.directionA !== prevProps.directionA ||
      this.props.directionB !== prevProps.directionB
    ) {
      this.setState({
        directionA: this.props.directionA,
        directionB: this.props.directionB,
      });
    }

    if (
      this.props.currentA !== prevProps.currentA ||
      this.props.currentB !== prevProps.currentB
    ) {
      this.setState({
        currentA: this.props.currentA,
        currentB: this.props.currentB,
      });
    }

    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  }

  render() {
    const { floors } = this.state;

    return (
      <>
        <Grid columns={1} centered>
          <Segment style={{ border: "5px", background: "#d3c2b8" }}>
            <Header
              as="h1"
              size="huge"
              block
              inverted
              color="red"
              textAlign="center"
            >
              {" "}
              Floors{" "}
            </Header>

            {floors.map((floor) => (
              <Grid.Row>
                <Floor
                  directionA={this.state.data.elevatorData[0].status}
                  directionB={this.state.data.elevatorData[1].status}
                  numberOfFloor={floor}
                  selectedFloor={this.props.selectedFloor}
                  currentA={this.state.data.elevatorData[0].currentFloor}
                  currentB={this.state.data.elevatorData[0].currentFloor}
                ></Floor>{" "}
              </Grid.Row>
            ))}
          </Segment>
        </Grid>
      </>
    );
  }
}
