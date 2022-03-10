import React from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import Floor from "./Floor";

export default class Floors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      floors: [],
      directionA: 0,
      directionB: 0,
      currentA: 0,
      currentB: 0,
    };
  }

  componentDidMount() {
    const { numberOfFloors, directionA, directionB, currentA, currentB, movingA, movingB } = this.props;
    const arrayOfFloors = Array.from(Array(numberOfFloors + 1).keys());
    const floors = arrayOfFloors.reverse();
    this.setState({
      floors: floors,
      directionA: directionA,
      directionB: directionB,
      currentA: currentA,
      currentB: currentB,
      movingA: movingA,
      movingB: movingB,
    });
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.directionA !== prevProps.directionA ||
      this.props.directionB !== prevProps.directionB
    ) {
      this.setState({
        directionA: this.props.directionA,
        directionB: this.props.directionB,
      });
    }

    if (this.props.currentA!== prevProps.currentA || this.props.currentB!== prevProps.currentB) {
      this.setState({currentA: this.props.currentA, currentB: this.props.currentB});  
    }

    if (this) {
        
    }
  }
  render() {
    const { floors } = this.state;

    return (
      <>
        <Grid columns={1} centered>
            <Segment style={{  border: "5px" , background:"#d3c2b8"}} >
            <Header as='h1' size="huge" block inverted color="red" textAlign="center"> Floors </Header>
          
          {floors.map((floor) => (
            <Grid.Row>
              <Floor
                directionA={this.state.directionA}
                directionB={this.state.directionB}
                numberOfFloor={floor}
                selectedFloor={this.props.selectedFloor}
                currentA={this.state.currentA}
                currentB={this.state.currentB}
              ></Floor>{" "}
            </Grid.Row>
          ))}
            </Segment>
        </Grid>
      </>
    );
  }
}
