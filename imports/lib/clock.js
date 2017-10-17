export const isToday = function(date) {
  let today = new Date();
  console.log(today, date);
  return (date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate());
}
