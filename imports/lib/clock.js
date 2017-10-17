export const isToday = function(date) {
  let today = new Date();
  return (date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate());
}
