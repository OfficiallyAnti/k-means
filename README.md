## About
This is a simple Implementation of the k-means Algorithm written in JavaScript.
Out of the box it works with a variable amount of two-dimensional coordinates and multiple initial clusters.
## Installation
Clone the repo and run
```
npm install
```
inside the folder. 
## Usage
1. Provide your input in `input.json` (refer to example input inside the file)
2. run `npm start` inside the k-means folder
## Configuration
- Inside `input.json` you can activate / deactivate the verbose mode (prints out the results of every calculation) by setting verbose to true / false
- Inside `input.json` you can set the distance formula / provide a custom one (implement a function in `src/index.js` that takes two points as input, add it to the if-else block inside the kMeans() function and then reference it inside `input.json` under `distance`)
- If no initial partitions are provided, it will randomly partition them
