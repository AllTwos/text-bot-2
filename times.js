const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getTime(newDate) {
  let month = newDate.getUTCMonth() + 1; // month 1 - 12
  let day = newDate.getUTCDate();
  let time = newDate.getUTCHours(); //military 24hrs
  let min = newDate.getUTCMinutes();
  let seconds = newDate.getUTCSeconds();
  let monthDay = `${monthNames[newDate.getMonth()]}${day}`;

  let times = {
    month,
    day,
    time,
    min,
    seconds,
    monthDay,
  };

  return times;
}

module.exports = {
  getTime,
};
