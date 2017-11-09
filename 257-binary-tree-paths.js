// 257. Binary Tree Paths
// Easy   39%


// Given a binary tree, return all root-to-leaf paths.

// For example, given the following binary tree:

//    1
//  /   \
// 2     3
//  \
//   5

// All root-to-leaf paths are:

// ["1->2->5", "1->3"]

// Credits:Special thanks to @jianchao.li.fighter for adding this problem and
// creating all test cases.


/**
 * Definition for a binary tree node.
 */
function TreeNode(val) {
  this.val = val
  this.left = this.right = null
}

function toBTree(array, i=0) {
  if (array[i] == null) return null
  const root = new TreeNode(array[i])
  root.left = toBTree(array, i * 2 + 1)
  root.right = toBTree(array, i * 2 + 2)
  return root
}

/**
 * @param {TreeNode} root
 * @return {string[]}
 */
const binaryTreePaths = function(root) {
  const array = []
  function traversal(root, string) {
    string += (string === '' ? '' : '->') + root.val
    if (root.left) traversal(root.left, string, array)
    if (root.right) traversal(root.right, string, array)
    if (!root.left && !root.right) array.push(string)
  }
  if (root) traversal(root, '')
  return array
}

;[
  toBTree([1,2,3,null,5]),      // ['1->2->5', '1->3']
].forEach(root => {
  console.log(binaryTreePaths(root))
})

// Solution:
// 递归一遍树，带上字符参数，每遍历一个节点，添加一个值。
// 若是叶子节点，再加完值之后，将字符串添加到数组中。

// Submission Result: Accepted
