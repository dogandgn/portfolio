export function getProjectItems(project) {
  return project.plugins ?? project.widgets ?? project.showcases ?? [];
}

export function getActiveItemIndex(items, id) {
  return Math.max(
    0,
    items.findIndex((item) => item.id === id),
  );
}

export function getAdjacentItemId(items, id, direction) {
  if (!items.length) return null;
  const index = getActiveItemIndex(items, id);
  return items[(index + direction + items.length) % items.length].id;
}
