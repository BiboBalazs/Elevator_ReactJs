# Elevator_ReactJs


**Setup development environment**

-   `git clone https://github.com/BiboBalazs/Elevator_ReactJs.git`
-   `npm install` to pull all dependencies
-   `npm start` to run the live server with hot reloading on [http://localhost:3000](http://localhost:3000)


 **Details**
There are 7 floors in a block and only 2 lifts. Initially Lift A is at the ground floor and Lift B at the top floor. Whenever someone calls the lift from N th floor, the lift closest to that floor comes to pick him up. If both the lifts are at equidistant from the N th floor, them the lift from the lower floor comes up.

There are navigation buttons in each floor (up / down). Inside the elevator there are buttons to select the destination. Seven segment displays indicate the position of the lift. These are presentinside the elevator. There are arrows to indicate the direction of movement of the elevator in each floor.

**How it works**

When someone calls for an elevator, the {App.selectedFloor ()} function adds a path (the number of the floor, where to call the elevator) to the priority queue and calls {App.elevatorControllerFunction ()}. The function selects the appropriate elevator (according to the specified rules) and if there is no free elevator, it will keep waiting.

When the selected elevator starts it’s way (App.handleMovementA / B) to the destination floor, it lights up green on the elevator controller, the other buttons are red and disabled. As the elevator arrives on the called floor, the panels become green and enabled again.

Chosen inside the elevator the preferable floor, it starts it’s way while indicating occupied to the outside.


**ToDO**
- convert to object oriented