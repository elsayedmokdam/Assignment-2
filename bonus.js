/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
*/
// Solution 1 : (O(n) time | O(1) space)
const findKthPositive = function (arr, k) {
    const set = new Set(arr);
    let count = 0;
    for (let i = 1; ; i++) { // O(n)
        if (!set.has(i)) { // O(1)
            count++;
            if (count === k) return i;
        }
    }
};
console.log(findKthPositive([2, 3, 4, 7, 11], 5));

// Solution 2 : (O(n * m) time | O(1) space)
/* const findKthPositive = function (arr, k) {
    let count = 0;
    for(let i = 1; ; i++) { // O(n)
        if (!arr.includes(i)) { // O(m)
            count++;
            if (count === k) return i;
        }
    }
}
console.log(findKthPositive([2, 3, 4, 7, 11], 5)); */

