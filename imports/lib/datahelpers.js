export const toggle = function(array, data) {
  if(typeof array === "undefined") {
    array = [];
  }

  var idx = array.indexOf(data);
  if(idx == -1) {
    array.push(data);
  } else {
    array.splice(data, 1);
  }

  return array;
}
