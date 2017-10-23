export const isToday = function(date) {
  let today = new Date();
  if(typeof date === "number")  date = new Date(date);
  return (date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate());
}
