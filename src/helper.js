export function getMines(data) {
  let mineArray = [];

  data.forEach((datarow) => {
    datarow.forEach((dataitem) => {
      if (dataitem.isMine) {
        mineArray.push(dataitem);
      }
    });
  });

  return mineArray;
}

export function getFlags(data) {
  let mineArray = [];

  data.forEach((datarow) => {
    datarow.forEach((dataitem) => {
      if (dataitem.flagged) {
        mineArray.push(dataitem);
      }
    });
  });

  return mineArray;
}

export function getHidden(data) {
  let mineArray = [];

  data.forEach((datarow) => {
    datarow.forEach((dataitem) => {
      if (!dataitem.revealed) {
        mineArray.push(dataitem);
      }
    });
  });

  return mineArray;
}
