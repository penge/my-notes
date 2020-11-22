const getElementById = (ID: string): HTMLElement => {
  const elem = document.getElementById(ID);
  if (!elem) {
    throw new Error(`Element ${ID} not found!`);
  }
  return elem;
};

export {
  getElementById,
};
