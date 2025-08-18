/**
 * Inserts an item into an array in alphabetical order based on a string accessor function.
 * @param items - The existing array of items
 * @param newItem - The new item to insert
 * @param accessor - Function that extracts the string value to sort by
 * @returns A new array with the item inserted in the correct alphabetical position
 */
export function insertAlphabetically<T>(
  items: T[],
  newItem: T,
  accessor: (item: T) => string
): T[] {
  const newItemValue = accessor(newItem).toLowerCase();
  const insertIndex = items.findIndex(
    item => accessor(item).toLowerCase() > newItemValue
  );

  // If no item is found with a value greater than the new item's value,
  // insert at the end
  if (insertIndex === -1) {
    return [...items, newItem];
  }

  // Insert at the correct alphabetical position
  return [...items.slice(0, insertIndex), newItem, ...items.slice(insertIndex)];
}
