export default (value: number, radix = 10) => ('000000000' + parseInt(`${value}`, radix).toString(2)).substr(-8);
