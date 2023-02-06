function solve(arr, num) {
  const maxRowCount = arr.reduce((acc, curr) => Math.max(acc, curr[1]), 0);
  const maxColCount = arr.reduce((acc, curr) => Math.max(acc, curr[0]), 0);

  const [totalWCount, totalMCount, totalACount, seatmap] = generateSeatmap(
    arr,
    maxRowCount,
    maxColCount
  );
  var aToFill = Math.min(totalACount, Math.max(num, 0));
  var wToFill = Math.min(totalWCount, Math.max(num - aToFill, 0));
  var mToFill = Math.min(totalMCount, Math.max(num - aToFill - wToFill, 0));
  var currANum = 1;
  var currWNum = aToFill + 1;
  var currMNum = aToFill + wToFill + 1;

  // fill up seats
  for (let i = 0; i < seatmap.length; i++) {
    for (let j = 0; j < seatmap[i].length; j++) {
      if (aToFill > 0 && seatmap[i][j] == 'A') {
        // fill aisle seats
        seatmap[i][j] = currANum;
        currANum++;
        aToFill--;
      } else if (wToFill > 0 && seatmap[i][j] == 'W') {
        // fill window seats
        seatmap[i][j] = currWNum;
        currWNum++;
        wToFill--;
      } else if (mToFill > 0 && seatmap[i][j] == 'M') {
        // fill middle seats
        seatmap[i][j] = currMNum;
        currMNum++;
        mToFill--;
      }
    }
  }
  printSeatMap(arr, seatmap, maxRowCount, maxColCount);
  return null;
}

// merge blocks of seats horizontally
function mergeBlocks(arr, maxRowCount) {
  const result = [];
  for (let i = 0; i < maxRowCount; i++) {
    result.push(arr.flatMap((x) => [...(x[i] || [])]));
  }
  return result;
}

function generateSeatmap(arr, maxRowCount, maxColCount) {
  var blocks = [];
  var totalWCount = 0;
  var totalMCount = 0;
  var totalACount = 0;

  // set up seatmap
  for (var i = 0; i < arr.length; i++) {
    const rowCount = arr[i][1];
    const colCount = arr[i][0];
    if (i == 0) {
      // left window
      const [wCount, mCount, aCount, block] = generateBlock(
        'left',
        rowCount,
        colCount,
        maxRowCount,
        maxColCount
      );
      blocks.push(block);
      totalWCount += wCount;
      totalMCount += mCount;
      totalACount += aCount;
    } else if (i == arr.length - 1) {
      // right window
      const [wCount, mCount, aCount, block] = generateBlock(
        'right',
        rowCount,
        colCount,
        maxRowCount,
        maxColCount
      );
      blocks.push(block);
      totalWCount += wCount;
      totalMCount += mCount;
      totalACount += aCount;
    } else {
      // no window
      const [wCount, mCount, aCount, block] = generateBlock(
        'middle',
        rowCount,
        colCount,
        maxRowCount,
        maxColCount
      );
      blocks.push(block);
      totalWCount += wCount;
      totalMCount += mCount;
      totalACount += aCount;
    }
  }

  const seatmap = mergeBlocks(blocks, maxRowCount);

  return [totalWCount, totalMCount, totalACount, seatmap];
}

function generateBlock(position, rowCount, colCount, maxRow, maxCol) {
  var block = [];
  var row = Array(maxCol).fill(null);

  var wCount = 0;
  var mCount = 0;
  var aCount = 0;

  if (position == 'left') {
    for (var j = 0; j < colCount; j++) {
      if (j == 0) {
        row[j] = 'W';
        wCount += rowCount;
      } else if (j != colCount - 1) {
        row[j] = 'M';
        mCount += rowCount;
      } else {
        row[j] = 'A';
        aCount += rowCount;
      }
    }
  } else if (position == 'middle') {
    for (var j = 0; j < colCount; j++) {
      if (j == 0 || j == colCount - 1) {
        row[j] = 'A';
        aCount += rowCount;
      } else {
        row[j] = 'M';
        mCount += rowCount;
      }
    }
  } else {
    for (var j = 0; j < colCount; j++) {
      if (j == 0) {
        row[j] = 'A';
        aCount += rowCount;
      } else if (j != colCount - 1) {
        row[j] = 'M';
        mCount += rowCount;
      } else {
        row[j] = 'W';
        wCount += rowCount;
      }
    }
  }

  for (let j = 0; j < rowCount; j++) {
    block.push(row.slice());
  }

  if (maxRow > rowCount) {
    for (let j = 0; j < maxRow - rowCount; j++) {
      block.push(Array(maxCol).fill(null));
    }
  }

  return [wCount, mCount, aCount, block];
}

function printSeatMap(arr, seatmap, maxRowCount, maxColCount) {
  for (let i = 0; i < arr.length; i++) {
    block = '';
    for (let j = 0; j < maxRowCount; j++) {
      row = '';
      for (let k = 0; k < maxColCount; k++) {
        const seat = seatmap[j][k + maxColCount * i];
        row += seat !== null ? seat : '';
        row += ' ';
      }
      block += row + '\n';
    }
    console.log(block);
  }
}

// console.log(
//   solve(
//     [
//       [3, 4],
//       [4, 5],
//       [2, 3],
//       [3, 4],
//     ],
//     30
//   )
// );

console.log(
  solve(
    [
      [3, 2],
      [4, 3],
      [2, 3],
      [3, 4],
    ],
    30
  )
);
