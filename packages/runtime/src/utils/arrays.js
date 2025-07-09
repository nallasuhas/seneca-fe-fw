// remove nulls from the children array
export function withoutNulls(arr){
    return arr.filter((item) => item != null)
}