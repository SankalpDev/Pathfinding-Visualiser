const gridContainer = document.getElementById('grid-container');
const statusAlert = document.getElementById('status-alert');
const ROWS = 20;
const COLS = 50;
const grid = [];

// --- State Variables ---
let isMousePressed = false;
let isDraggingStart = false;
let isDraggingEnd = false;
let isCreatingWalls = false; // Toggle between wall creation and erasure

// --- Initialization ---

function createGrid() {
    hideStatusMessage();
    gridContainer.innerHTML = '';
    grid.length = 0;

    for (let row = 0; row < ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < COLS; col++) {
            const node = createNode(row, col);
            gridContainer.appendChild(node.element);
            currentRow.push(node);
        }
        grid.push(currentRow);
    }
}

function createNode(row, col) {
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('node');
    nodeElement.dataset.row = row;
    nodeElement.dataset.col = col;

    const node = {
        element: nodeElement,
        row,
        col,
        isStart: row === 10 && col === 5,
        isEnd: row === 10 && col === 45,
        isWall: false,
        distance: Infinity,
        isVisited: false,
        previousNode: null,
    };

    if (node.isStart) nodeElement.classList.add('node-start');
    if (node.isEnd) nodeElement.classList.add('node-end');

    return node;
}

createGrid();

// --- Mouse Interaction ---

gridContainer.addEventListener('mousedown', e => {
    e.preventDefault(); // Prevent default browser drag behavior
    if (!e.target.classList.contains('node')) return;
    
    const { row, col } = e.target.dataset;
    const node = grid[row][col];

    if (node.isStart) {
        isDraggingStart = true;
    } else if (node.isEnd) {
        isDraggingEnd = true;
    } else {
        isMousePressed = true;
        isCreatingWalls = !node.isWall; // Determine draw vs erase mode
        updateWall(e.target, isCreatingWalls);
    }
});

gridContainer.addEventListener('mouseover', e => {
    if (!e.target.classList.contains('node')) return;
    const nodeElement = e.target;

    if (isMousePressed) {
        updateWall(nodeElement, isCreatingWalls);
    } else if (isDraggingStart) {
        moveStartNode(nodeElement);
    } else if (isDraggingEnd) {
        moveEndNode(nodeElement);
    }
});

document.addEventListener('mouseup', () => {
    isMousePressed = false;
    isDraggingStart = false;
    isDraggingEnd = false;
});

function updateWall(nodeElement, shouldBeWall) {
    const { row, col } = nodeElement.dataset;
    const node = grid[row][col];
    
    if (node.isStart || node.isEnd) return;

    if (node.isWall !== shouldBeWall) {
        node.isWall = shouldBeWall;
        nodeElement.classList.toggle('node-wall', shouldBeWall);
    }
}

function moveStartNode(newEl) {
    const newNode = grid[newEl.dataset.row][newEl.dataset.col];
    if (newNode.isWall || newNode.isEnd) return;

    const oldStart = getStartNode(grid);
    if (oldStart) {
        oldStart.isStart = false;
        oldStart.element.classList.remove('node-start');
    }
    newNode.isStart = true;
    newNode.element.classList.add('node-start');
}

function moveEndNode(newEl) {
    const newNode = grid[newEl.dataset.row][newEl.dataset.col];
    if (newNode.isWall || newNode.isStart) return;

    const oldEnd = getEndNode(grid);
    if (oldEnd) {
        oldEnd.isEnd = false;
        oldEnd.element.classList.remove('node-end');
    }
    newNode.isEnd = true;
    newNode.element.classList.add('node-end');
}

// --- Visualization Controls ---

document.getElementById('btn-visualize-dijkstra').addEventListener('click', () => runAlgorithm(dijkstra));
document.getElementById('btn-visualize-bfs').addEventListener('click', () => runAlgorithm(bfs));
document.getElementById('btn-visualize-dfs').addEventListener('click', () => runAlgorithm(dfs));
document.getElementById('btn-clear').addEventListener('click', createGrid);

function runAlgorithm(algoFunction) {
    const start = getStartNode(grid);
    const end = getEndNode(grid);
    if (!start || !end) return;

    resetGridForSearch();
    const visitedNodes = algoFunction(grid, start, end);
    const shortestPath = algoFunction === dfs ? [] : getNodesInShortestPathOrder(end); // DFS is not guaranteed to find shortest path
    
    animateAlgorithm(visitedNodes, shortestPath, end);
}

function resetGridForSearch() {
    hideStatusMessage();
    for (const row of grid) {
        for (const node of row) {
            node.isVisited = false;
            node.distance = Infinity;
            node.previousNode = null;
            if (!node.isStart && !node.isEnd && !node.isWall) {
                node.element.classList.remove('node-visited', 'node-shortest-path');
            }
        }
    }
}

function animateAlgorithm(visitedNodes, shortestPath, endNode) {
    for (let i = 0; i <= visitedNodes.length; i++) {
        if (i === visitedNodes.length) {
            setTimeout(() => {
                if (!endNode.isVisited) showStatusMessage("No Path Found!");
                else if (shortestPath.length) animateShortestPath(shortestPath);
            }, 10 * i);
            return;
        }
        setTimeout(() => {
            const node = visitedNodes[i];
            if (!node.isStart && !node.isEnd) node.element.classList.add('node-visited');
        }, 10 * i);
    }
}

function animateShortestPath(path) {
    for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
            const node = path[i];
            if (!node.isStart && !node.isEnd) node.element.classList.add('node-shortest-path');
        }, 50 * i);
    }
}

// --- Algorithms ---

function dijkstra(grid, start, end) {
    const visited = [];
    start.distance = 0;
    const unvisited = getAllNodes(grid);

    while (unvisited.length) {
        sortNodesByDistance(unvisited);
        const closest = unvisited.shift();

        if (closest.isWall) continue;
        if (closest.distance === Infinity) return visited;

        closest.isVisited = true;
        visited.push(closest);
        if (closest === end) return visited;

        updateUnvisitedNeighbors(closest, grid);
    }
    return visited;
}

function bfs(grid, start, end) {
    const visited = [];
    const queue = [start];
    start.distance = 0;
    start.isVisited = true;

    while (queue.length) {
        const current = queue.shift();
        visited.push(current);
        if (current === end) return visited;

        const neighbors = getUnvisitedNeighbors(current, grid);
        for (const neighbor of neighbors) {
            if (neighbor.isWall) continue;
            neighbor.isVisited = true;
            neighbor.previousNode = current;
            queue.push(neighbor);
        }
    }
    return visited;
}

function dfs(grid, start, end) {
    const visited = [];
    const stack = [start];

    while (stack.length) {
        const current = stack.pop();
        if (current.isVisited || current.isWall) continue;

        current.isVisited = true;
        visited.push(current);
        if (current === end) return visited;

        const neighbors = getUnvisitedNeighbors(current, grid);
        for (const neighbor of neighbors) {
            neighbor.previousNode = current;
            stack.push(neighbor);
        }
    }
    return visited;
}

// --- Helpers ---

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) nodes.push(node);
    }
    return nodes;
}

function sortNodesByDistance(nodes) {
    nodes.sort((a, b) => a.distance - b.distance);
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(n => !n.isVisited);
}

function updateUnvisitedNeighbors(node, grid) {
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getNodesInShortestPathOrder(endNode) {
    const path = [];
    let current = endNode;
    while (current !== null) {
        path.unshift(current);
        current = current.previousNode;
    }
    return path;
}

function getStartNode(grid) {
    for (const row of grid) for (const node of row) if (node.isStart) return node;
}

function getEndNode(grid) {
    for (const row of grid) for (const node of row) if (node.isEnd) return node;
}

function showStatusMessage(message) {
    statusAlert.innerHTML = `<strong>Alert:</strong> ${message}`;
    statusAlert.classList.remove('d-none');
}

function hideStatusMessage() {
    statusAlert.classList.add('d-none');
}