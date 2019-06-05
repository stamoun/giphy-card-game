export function shuffle(array: any[]) {
  let lastIndex = array.length;

  while (lastIndex) {
    let item = Math.floor(Math.random() * lastIndex--);

    let tempItem = array[lastIndex];
    array[lastIndex] = array[item];
    array[item] = tempItem;
  }

  return array;
}
