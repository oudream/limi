/**
 * Created by liuchaoyu on 2017-03-27.
 */

'use strict';

/** 树管理接口 */
class TreeManager {
    /**
     * 创建节点
     * @param zTreeObj: Object ztree对象
     * @param nodeParams: Object 节点参数（与ztree节点参数一致）
     * @param parentNode: Object 父节点对象
     * @returns {*}: Object 返回新节点对象（已经添加到树中）
     */
    static newTreeNode(zTreeObj, nodeParams, parentNode) {
        // TODO:判断node是否为父节点
        let node = zTreeObj.getNodeByParam('name', nodeParams.name, null);
        if (node && node.isParentNode == true) {
            if (parentNode) {
                node = null;
            }
        }
        if (node == null) {
            let _params = nodeParams;
            if (parentNode) {
                _params['isParentNode'] = false;
                let ret = zTreeObj.addNodes(parentNode, _params);
            } else {
                _params['isParentNode'] = true;
                zTreeObj.addNodes(null, _params);
            }

            return zTreeObj.getNodeByParam('id', nodeParams.id, null);
        } else {
            return node;
        }
    };

    // static appendNode (zTreeObj,parentNode,node) {
    //
    //     zTreeObj.addNodes(parentNode, -1, node);
    //
    // };

    /**
     * 删除节点
     * @param zTreeObj: ztree对象
     * @param node: 节点对象或者节点ID
     */
    static removeNode(zTreeObj, node) {
        if (typeof node === 'object') {
            zTreeObj.removeNode(node, true);
        } else if (typeof node === 'string') {
            let _node = TreeManager.getNodeById(node);

            zTreeObj.removeNode(_node, true);
        }
    };

    /**
     * 更新节点
     * @param zTreeObj: ztree对象
     * @param node: 节点对象
     */
    static updateNode(zTreeObj, node) {
        zTreeObj.updateNode(node);
    };

    /**
     * 通过ID获取节点
     * @param zTreeObj: ztree对象
     * @param id: 节点ID
     * @returns {*}: 节点对象
     */
    static getNodeById(zTreeObj, id) {
        function filter(node) {
            return (node.id === id);
        }

        return zTreeObj.getNodesByFilter(filter, true);
    }

    /**
     * 获取选中的节点集合
     * @param zTreeObj: ztree对象
     * @returns {*}: 节点集合
     */
    static getSelectedNodes(zTreeObj) {
        return zTreeObj.getSelectedNodes();
    }

    /**
     * 获取一级子节点集合(只有一级，不包括多级遍历)
     * @param zTreeObj: ztree对象
     * @param parentNodeId: 父节点ID（如果没定义或为NULL，则以树的根节点）
     * @returns {*}: 节点集合
     */
    static getNodes(zTreeObj, parentNodeId) {
        if (parentNodeId == null && parentNodeId == undefined) {
            return zTreeObj.getNodes();
        } else {
            let _node = TreeManager.getNodeById(zTreeObj, parentNodeId);
            let _childrenNodes = _node.children;

            return _childrenNodes;
        }
    };

    /**
     * 选中节点
     * @param zTreeObj: ztree对象
     * @param id: 节点ID
     */
    static selectNode(zTreeObj, id) {
        let selectedNode = TreeManager.getSelectedNodes(zTreeObj);
        if (selectedNode.length === 0 || (selectedNode[0] && selectedNode[0].id !== id)) {
            let _node = TreeManager.getNodeById(zTreeObj, id);
            zTreeObj.selectNode(_node);
        }
    };

    /**
     * 取消选中节点
     * @param zTreeObj: ztree对象
     * @param id: 节点ID（如果id没定义，则取消所有选中的节点）
     */
    static unSelectNode(zTreeObj, id) {
        if (id) {
            let _node = TreeManager.getNodeById(zTreeObj, id);

            zTreeObj.cancelSelectedNode(_node);
        } else {
            let selectedNodes = zTreeObj.getSelectedNodes();
            if (selectedNodes.length > 0) {
                zTreeObj.cancelSelectedNode();
            }
        }
    };
}
