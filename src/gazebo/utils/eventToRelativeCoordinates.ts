export const eventToRelativeCoordinates = (
  e: MouseEvent | TouchEvent,
  element: HTMLElement
) => {
  const { left, top } = element.getBoundingClientRect();

  // @ts-ignore: I'd expect this to work, TODO: figure out a way to handle the union
  const event = e.changedTouches ? e.changedTouches[0] : e;

  const x = event.clientX - left;
  const y = event.clientY - top;

  return { x, y };
};

export const eventToElementSpace = (
  e: { clientX: number; clientY: number },
  element: HTMLElement
) => {
  const { left, top, width, height } = element.getBoundingClientRect();

  // @ts-ignore: I'd expect this to work, TODO: figure out a way to handle the union
  const event = e.changedTouches ? e.changedTouches[0] : e;

  const x = (event.clientX - left) / width;
  const y = (event.clientY - top) / height;

  return { x, y };
};

export const eventIsInElementSpace = (
  e: { clientX: number; clientY: number },
  element: HTMLElement
): boolean => {
  const { x, y } = eventToElementSpace(e, element);
  return x >= 0 && x <= 1 && y >= 0 && y <= 1;
};
