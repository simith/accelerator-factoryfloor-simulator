

 class NodeVar {
    constructor(browseName,nodeId,minimumSamplingInterval,dataType,getFunc) {
      this.browseName = browseName;
      this.nodeId = nodeId;
      this.minimumSamplingInterval = minimumSamplingInterval;
      this.dataType = dataType;
      this.getFunc = getFunc;
    }
}

class NodeObj {

    constructor(browseName,nodeId) {
      this.browseName = browseName;
      this.nodeId = nodeId;
      this.list = []
    }

    addNode(nodeVar){
        this.list.push(nodeVar)
    }
}

export {NodeVar, NodeObj};