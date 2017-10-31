// 606. Construct String from Binary Tree
// Easy   49%


// You need to construct a string consists of parenthesis and integers from a
// binary tree with the preorder traversing way.

// The null node needs to be represented by empty parenthesis pair "()". And you
// need to omit all the empty parenthesis pairs that don't affect the one-to-one
// mapping relationship between the string and the original binary tree.

// Example 1:

// Input: Binary tree: [1,2,3,4]
//        1
//      /   \
//     2     3
//    /
//   4

// Output: "1(2(4))(3)"
// Explanation: Originallay it needs to be "1(2(4)())(3()())", but you need to
// omit all the unnecessary empty parenthesis pairs. And it will be "1(2(4))(3)".

// Example 2:

// Input: Binary tree: [1,2,3,null,4]
//        1
//      /   \
//     2     3
//      \
//       4

// Output: "1(2()(4))(3)"
// Explanation: Almost the same as the first example, except we can't omit the
// first parenthesis pair to break the one-to-one mapping relationship between
// the input and the output.


/**
 * Definition for a binary tree node.
 */
function TreeNode(val) {
  this.val = val
  this.left = this.right = null
}

function toBTree(array, i=0) {
  if (array[i] == void 0) return null
  const root = new TreeNode(array[i])
  root.left = toBTree(array, i * 2 + 1)
  root.right = toBTree(array, i * 2 + 2)
  return root
}

/**
 * @param {TreeNode} t
 * @return {string}
 */
const tree2str = function(t) {
  if (t == void 0) return ''
  return '' + t.val +
    (t.left ? '(' + tree2str(t.left) + ')' : (t.right ? '()' : '')) +
    (t.right ? '(' + tree2str(t.right) + ')' : '')
}

;[
  toBTree([1,2,3,4]),           // '1(2(4))(3)'
  toBTree([1,2,3,null,4]),      // '1(2()(4))(3)'
].forEach(t => {
  console.log(tree2str(t))
})

// Solution:
// 关键在于只有右节点，没有左节点时，做节点要用 ‘()’ 代替。

// Submission Result: Accepted
