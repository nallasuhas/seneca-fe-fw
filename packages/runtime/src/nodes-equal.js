import { DOM_TYPES } from "./h.js";

export function areNodesEqual(node1, node2){
    if(node1.type !== node2.type){
     return false;
    } 
    if(node1.type === DOM_TYPES.ELEMENT){
        const {tag: tagName1} = node1
        const {tag: tagName2} = node2

        return tagName1 === tagName2 
    }
    return true
}