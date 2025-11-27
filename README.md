# **Pathfinding Visualizer**

An interactive web-based pathfinding visualizer that demonstrates how popular graph search algorithms work in real time.
This project includes implementations of **Dijkstra’s Algorithm**, **Breadth-First Search (BFS)**, and **Depth-First Search (DFS)** for pathfinding and traversal, paired with a dynamic and responsive UI.

Built with **HTML, CSS, JavaScript**, and **DOM manipulation**, the visualizer allows users to dynamically create grids, draw walls, drag start/end nodes, and observe algorithms step-by-step.

---

## **📖 Table of Contents**

* [Features](#-features)
* [Installation](#-installation)
* [Usage](#-usage)
* [Algorithms Implemented](#-algorithms-implemented)
* [UI & Interaction](#-ui--interaction)
* [Project Structure](#-project-structure)
* [Customization](#-customization)

---

## **✨ Features**

* **Interactive Grid**
  A 20×50 grid that users can manipulate in real time. 

* **Draggable Start & End Nodes**
  Move these nodes anywhere on the grid by dragging. 

* **Wall Drawing**
  Click and drag to create or erase walls dynamically. 

* **Algorithm Visualizations**

  * Dijkstra’s Algorithm (guaranteed shortest path)
  * BFS (shortest path in unweighted grid)
  * DFS (exploration algorithm, not optimal)
    Visualized via node animations. 

* **Animated Path Rendering**
  Smooth animations for visited nodes and final shortest path.
  Styling and animations defined in CSS. 

* **Bootstrap-Based UI**
  Clean navbar and button group for algorithm selection. 


---

## **📦 Installation**

1. Clone or download this repository.
2. Ensure the following files are in the same directory:

   * `index.html`
   * `style.css`
   * `script.js`
3. Open **index.html** in any modern browser.

*No build steps or dependencies required.*

---

## **🚀 Usage**

1. **Open the app**
   Launch `index.html` in a browser.

2. **Modify the grid**

   * Click & drag to draw or erase walls.
   * Drag the green node = **Start**.
   * Drag the red node = **End**.

3. **Run an Algorithm**
   Use the buttons in the navbar:

   * **Dijkstra**
   * **BFS**
   * **DFS**

4. **Reset the Grid**
   Click **Clear Grid** to generate a fresh grid.

5. **Interpreting Colors**
   Legend appears at the top:

   * 🟩 Start
   * 🟥 End
   * ⬛ Wall
   * 🟦 Visited nodes
   * 🟨 Final shortest path
     (Colors defined in CSS.) 

---

## **🧠 Algorithms Implemented**

### **1. Dijkstra’s Algorithm**

* Guarantees shortest path on weighted/unweighted grids
* Uses `distance` property for relaxation
* Stops early once end node is reached


### **2. Breadth-First Search (BFS)**

* Uses a queue
* Shortest path for unweighted grids


### **3. Depth-First Search (DFS)**

* Uses a stack
* Great for traversal—but **does not guarantee shortest path**


All algorithms return a list of visited nodes, which the UI animates.

---

## **🖱️ UI & Interaction Details**

### **Mouse Logic**

* `mousedown` → start drawing walls or drag nodes
* `mouseover` → continue drawing / dragging
* `mouseup` → stop interaction


### **Animations**

CSS animations include:

* **popIn** → for walls
* **visitAnimation** → for visited nodes
* **pathAnimation** → for shortest path


---

## **📂 Project Structure**

```
├── index.html      # Layout, navbar, grid container, Bootstrap setup
├── style.css       # Grid styling, node states, animations
└── script.js       # Logic for grid creation, algorithms, event handling
```

### File References

* **index.html**: UI layout, legend badges, algorithm buttons. 
* **script.js**: Algorithms, animations, DOM manipulation. 
* **style.css**: Visual design, animations, node state styling. 

---

## **⚙️ Customization**

You can easily modify:

* **Grid Size**
  In `script.js`:

  ```js
  const ROWS = 20;
  const COLS = 50;
  ```

  And in `style.css`:

  ```css
  grid-template-columns: repeat(50, 25px);
  grid-template-rows: repeat(20, 25px);
  ```

* **Animation Speed**
  Adjust the per-node delay in `animateAlgorithm()` and `animateShortestPath()`.

* **Start & End Node Default Positions**
  Defined in `createNode()`:

  ```js
  isStart: row === 10 && col === 5,
  isEnd: row === 10 && col === 45,
  ```

---

---

