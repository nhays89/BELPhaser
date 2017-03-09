
/**
 *
 * @param grid a 2D array of tile map indexes
 * @param tileWidth width in pixels
 * @param tileHeight height in pixels
 * @param acceptableTiles array of acceptable tile indices
 * @constructor
 */
function Pathfinder(grid, tileWidth, tileHeight, acceptableTiles) {
    PF.AStarFinder.call(this, { allowDiagonal: true });

    this.grid = new PF.Grid(grid);
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    if (acceptableTiles.length) {
        for (var y = 0; y < grid.length; y++) {
            for (var x = 0; x < grid[0].length; x++) {
                for (var k = 0; k < acceptableTiles.length; k++) {
                    var tile = grid[y][x];
                    if (tile.index === acceptableTiles[k]) {
                        this.grid.setWalkableAt(x, y, true);
                        break;
                    }
                }

            }
        }
    } else {
        throw Error("Must have array of acceptable tiles");
    }
}

Pathfinder.prototype = Object.create(PF.AStarFinder.prototype);
Pathfinder.prototype.constructor = Pathfinder;


Pathfinder.prototype = {

    setWalkable: function (x, y, walkable) {
        this.grid.setWalkableAt(x, y, walkable);
    },

    /**
     *
     * @param startX starting X in pixels
     * @param startY starting Y in pixels
     * @param endX ending X in pixels
     * @param endY ending Y in pixels
     */
    findPath: function (startX, startY, endX, endY) {

        var startGridX, startGridY, endGridX, endGridY;

       // convert to grid from pixels
       startGridX = Math.floor(startX / this.tileWidth);
       startGridY = Math.floor(startY / this.tileHeight);
       endGridX = Math.floor(endX / this.tileWidth);
       endGridY = Math.floor(endY / this.tileHeight);

       var gridBackup = this.grid.clone();
       var path2 = [];
       var path = PF.AStarFinder.prototype.findPath.call(this, startGridX, startGridY,
           endGridX, endGridY, gridBackup);

       // convert to pixels
       for (var i = 0; i < path.length; i++) {
           path2[i] = {};
           path2[i].x = path[i][0] * this.tileWidth + (this.tileWidth / 2); // offsets to the center of the tile
           path2[i].y = path[i][1] * this.tileHeight + (this.tileHeight / 2);
       }
       for (var i = 0; i < path.length -1; i++) {
           path2[i].direction = this.getDirection(game.physics.arcade.angleBetween(
               { x: path2[i].x, y: path2[i].y },
               { x: path2[i + 1].x, y: path2[i + 1].y }
           ));

           path2[i].distance = Phaser.Math.distance(path2[i].x, path2[i].y,
               path2[i + 1].x, path2[i + 1].y);
       }
       // path2.shift(); // remove the starting point (sprite already knows this)
       if(path2.length === 0) {
           //console.log("clicked on non walkable tile");
       }
       return path2
    },

    isWalkable: function (x, y) {
        var gridX = x / this.tileWidth,
            gridY = y / this.tileHeight;

        return this.grid.isWalkableAt(gridX, gridY);
    },

    getDirection: function(radians) {
        var degrees = Phaser.Math.radToDeg(radians);
        if (degrees >= -22.5 && degrees < 22.5) {
            return 'east';
        } else if (degrees >= 22.5 && degrees < 67.5) {
            return 'southeast';
        } else if (degrees >= 67.5 && degrees < 112.5) {
            return 'south';
        } else if (degrees >= 112.5 && degrees < 157.5) {
            return 'southwest';
        } else if (degrees >= -157.5 && degrees < -112.5) {
            return 'northwest';
        } else if (degrees >= -112.5 && degrees < -67.5) {
            return 'north';
        } else if (degrees >= -67.5 && degrees < -22.5) {
            return 'northeast';
        } else {
            return 'west';
        }
    },



    // from pathfinding.js @ https://github.com/qiao/PathFinding.js
    aStarSearch: function (startX, startY, endX, endY, grid) {
        var openList = new Heap(function(nodeA, nodeB) {
                return nodeA.f - nodeB.f;
            }),
            startNode = grid.getNodeAt(startX, startY),
            endNode = grid.getNodeAt(endX, endY),
            heuristic = this.heuristic,
            diagonalMovement = this.diagonalMovement,
            weight = this.weight,
            abs = Math.abs, SQRT2 = Math.SQRT2,
            node, neighbors, neighbor, i, l, x, y, ng;

        // set the `g` and `f` value of the start node to be 0
        startNode.g = 0;
        startNode.f = 0;

        // push the start node into the open list
        openList.push(startNode);
        startNode.opened = true;

        var closestNode = null; // get f value

        // while the open list is not empty
        while (!openList.empty()) {
            // pop the position of node which has the minimum `f` value.
            node = openList.pop();

            if (node.f < closestNode.f)
                closestNode = node;

            node.closed = true;

            // if reached the end position, construct the path and return it
            if (node === endNode) {
                return this.backtrace(endNode);
            }

            // get neigbours of the current node
            neighbors = grid.getNeighbors(node, diagonalMovement);
            for (i = 0, l = neighbors.length; i < l; ++i) {
                neighbor = neighbors[i];

                if (neighbor.closed) {
                    continue;
                }

                x = neighbor.x;
                y = neighbor.y;

                // get the distance between current node and the neighbor
                // and calculate the next g score
                ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

                // check if the neighbor has not been inspected yet, or
                // can be reached with smaller cost from the current node
                if (!neighbor.opened || ng < neighbor.g) {
                    neighbor.g = ng;
                    neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = node;

                    if (!neighbor.opened) {
                        openList.push(neighbor);
                        neighbor.opened = true;
                    } else {
                        // the neighbor can be reached with smaller cost.
                        // Since its f value has been updated, we have to
                        // update its position in the open list
                        openList.updateItem(neighbor);
                    }
                }
            } // end for each neighbor
        } // end while not open list empty

        // fail to find the path
        return this.backtrace(closestNode);
    },

    // from pathfinding.js @ https://github.com/qiao/PathFinding.js
    backtrace: function(node) {
        var path = [[node.x, node.y]];
        while (node.parent) {
            node = node.parent;
            path.push([node.x, node.y]);
        }
        return path.reverse();
    }
};