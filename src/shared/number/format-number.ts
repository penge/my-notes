export default (number: number): string => new Intl.NumberFormat("en-US").format(number);
