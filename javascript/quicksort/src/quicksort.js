function qSort(arr) {
  if (arr.length==0) {
      return [];
  }
  var left = [];
  var right = [];
  var pivot = arr[0];
  for (var i =1; i <arr.length; i++) { // 注意这里的起始值，因为有一个作为flag了
     if (arr[i] < pivot) {
           left.push(arr[i]);
      } else {
          right.push(arr[i]);
      }
  }
  return qSort(left).concat(pivot, qSort(right));
}
