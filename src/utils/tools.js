import _ from 'underscore'

const findParentMenu = (menus, pid) => {
  for (let i = 0; i < menus.length; i++) {
    let result = menus[i]
    if (result.menuId == pid) {
      return result
    }
    if (result.children) {
      result = findParentMenu(result.children, pid)
      if (result) {
        return result
      }
    }
  }
}

const isNotEmpty = (arr) => {
  if (Array.isArray(arr)) {
    return arr.length > 0
  }
  return false
}

const spreadTree = (tree) => {
  let result = []
  tree.forEach(item => {
    const o = Object.assign({}, item)
    result.push(o)
    if (isNotEmpty(o.children)) {
      result = result.concat(spreadTree(o.children))
    }
    delete o.children
  })
  return result
}

const sortTree = (tree) => {
  tree = _.sortBy(tree, 'sort')
  for (let i = 0; i < tree.length; i++) {
    const subTree = tree[i].children
    if (subTree && subTree.length > 0) {
      tree[i].children = sortTree(subTree)
    }
  }
  return tree
}

export default {
  createMenuTree(data, pid) {
    let tree = this.findChildren(data, pid)
    for (let i = 0; i < tree.length; i++) {
      tree[i].sort = Number(tree[i].sort)
      tree[i].children = this.createMenuTree(data, tree[i].adminMenuId)
    }
    return tree
  },

  findChildren(list, pid) {
    return list.filter(m => m.parentId == pid)
  },

  sortTree,

  findParentMenu,

  findSiblings(menus, pid) {
    if (pid == 0) {
      return menus
    }
    const parent = findParentMenu(menus, pid)
    if (parent) {
      return parent.children
    }
    return []
  },

  spreadTree,

  isNotEmpty,
}
