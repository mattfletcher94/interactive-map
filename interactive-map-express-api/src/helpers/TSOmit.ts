type TSOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
export default TSOmit;
