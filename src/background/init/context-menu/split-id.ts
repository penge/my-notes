export type SplitIdResult<C extends unknown, D extends unknown> = {
  context: C
  destination: D
  noteName: string
};

export default <C extends unknown, D extends unknown>(id: string): SplitIdResult<C, D> => {
  const [context, destination, ...noteNameParts] = id.split("-") as [C, D, string[]];
  return {
    context,
    destination,
    noteName: noteNameParts.join("-"),
  };
};
