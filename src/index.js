const {
  dataset,
  initialPartitions,
  distance,
  verbose,
} = require("../input.json");
const colors = require("colors");

class Point {
  name;
  x;
  y;
  constructor(x, y, name) {
    this.name = name;
    this.x = x;
    this.y = y;
  }
}

function kMeans(dataset, initialPartitions) {
  let currentPartitions = {};
  let centroids = {};
  let pointMap = {};

  for (key in dataset) {
    pointMap[key] = new Point(dataset[key][0], dataset[key][1], key);
  }

  for (key in initialPartitions) {
    pointList = [];
    for (let i = 0; i < initialPartitions[key].length; i++) {
      point = initialPartitions[key][i];
      pointList.push(pointMap[point]);
    }
    currentPartitions[key] = pointList;
  }

  counter = 1;
  while (true) {
    if (verbose) {
      console.log(`Starting iteration ${counter}\n`.cyan);
    }
    //store the new partitions that are created during iteration
    newPartitions = {};

    if (verbose) {
      console.log("Calculating centroids:\n");
    }
    //calculate centroids
    for (key in currentPartitions) {
      centroids[key] = determineCentroid(
        currentPartitions[key],
        key.replace(key.charAt(0), "X")
      );
      //initialize new partitions
      newPartitions[key] = [];
    }

    if (verbose) {
      console.log();
    }

    //calculate distance to each centroid for each point
    for (key in pointMap) {
      point = pointMap[key];
      lowestDist = Number.MAX_SAFE_INTEGER;
      newPartition = "";
      partitionOfPoint = findPartition(point, currentPartitions);
      //calculate distance between point and centroid
      for (key in centroids) {
        centroid = centroids[key];
        if (distance.toLowerCase() == "manhattan") {
          pointDist = manhattanDistance(centroid, point);
        } else if (distance.toLowerCase() == "euklidian") {
          pointDist = euklidianDistance(centroid, point);
        } else {
          console.log(
            "INVALID DISTANCE FORMULA, OPTIONS: manhattan | euklidian".red
          );
          return;
        }

        //store minimum distance
        if (pointDist < lowestDist) {
          lowestDist = pointDist;
          newPartition = centroid.name.replace("X", partitionOfPoint.charAt(0));
        }
      }
      if (verbose) {
        console.log();
      }
      //check if point has to be moved to a different partition
      if (newPartition != partitionOfPoint) {
        if (verbose) {
          console.log(
            `Result: ${point.name} is being moved to ${newPartition} \n`.magenta
          );
        }
        //add point to correct partition
        newPartitions[newPartition].push(point);
      } else {
        if (verbose) {
          console.log(
            `Result: ${point.name} is staying in ${partitionOfPoint}\n`
          );
        }
        newPartitions[partitionOfPoint].push(point);
      }
    }

    //compare previous state of partitions to newest version, adjust if changed
    if (JSON.stringify(currentPartitions) === JSON.stringify(newPartitions)) {
      console.log(
        `The k-means Algorithm is done. In the ${counter}. iteration no point was moved to another partition!\n`
          .magenta
      );
      console.log("Final Clusters:");
      for (key in newPartitions) {
        points = newPartitions[key];
        console.log(`${key} = ${points.map((point) => point.name)}`);
      }
      console.log("\nCentroids:");
      for (key in centroids) {
        centroid = centroids[key];
        console.log(
          `${centroid.name} = (${centroid.x.toFixed(2)}, ${centroid.y.toFixed(
            2
          )})`
        );
      }
      return;
    } else {
      currentPartitions = newPartitions;
    }

    counter++;

    if (verbose) {
      console.log();
      console.log("------------------------------------");
    }
  }
}

function findPartition(point, currentPartitions) {
  for (key in currentPartitions) {
    points = currentPartitions[key].map((x) => x.name);
    if (points.includes(point.name)) {
      return key;
    }
  }
  return null;
}

function determineCentroid(pointList, name) {
  const reducer = (prev, curr) => prev + curr;
  if (verbose) {
    console.log(
      `${name} \t\t = (${pointList.map((x) => x.x).join(" + ")})/${
        pointList.length
      }, (${pointList.map((x) => x.y).join(" + ")})/${pointList.length}`
    );
  }
  x = pointList.map((x) => x.x).reduce(reducer, 0) / pointList.length;
  y = pointList.map((x) => x.y).reduce(reducer, 0) / pointList.length;
  if (verbose) {
    console.log(`\t\t = (${x.toFixed(2)}, ${y.toFixed(2)})\n`.green);
  }

  return new Point(x, y, name);
}

function euklidianDistance(a, b) {
  if (verbose) {
    console.log(
      `d(${a.name},${b.name}) \t = sqrt((${a.x.toFixed(2)}-${b.x.toFixed(
        2
      )})^2 + (${a.y.toFixed(2)}-${b.y.toFixed(2)})^2)`
    );
  }
  x = (a.x - b.x) ** 2;
  y = (a.y - b.y) ** 2;
  if (verbose) {
    console.log(`\t\t = sqrt(${x.toFixed(2)} + ${y.toFixed(2)})`);
  }
  result = Math.sqrt(x + y);
  if (verbose) {
    console.log(`\t\t = ${result.toFixed(2)}\n`.green);
  }
  return result;
}

function manhattanDistance(a, b) {
  if (verbose) {
    console.log(
      `d(${a.name},${b.name}) \t = |${a.x.toFixed(2)}-${b.x.toFixed(
        2
      )}| + |${a.y.toFixed(2)}-${b.y.toFixed(2)}|`
    );
  }
  x = Math.abs(a.x - b.x);
  y = Math.abs(a.y - b.y);
  if (verbose) {
    console.log(`\t\t = ${x.toFixed(2)} + ${y.toFixed(2)}`);
  }
  result = x + y;
  if (verbose) {
    console.log(`\t\t = ${result.toFixed(2)}\n`.green);
  }

  return result;
}

console.log("Starting k-means");
kMeans(dataset, initialPartitions);
