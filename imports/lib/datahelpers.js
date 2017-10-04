export const toggle = function(array, data) {
  var idx = array.indexOf(data);
  
  if(idx === -1) {
    array.push(data);
  } else {
    array.splice(idx, 1);
  }

  return array;
}
