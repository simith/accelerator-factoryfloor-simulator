// Schema - TODO: Move to a seperate file
export var nodeVar =  {
    id: "/SimpleNodeVar",
    type: "object",
    properties :{
        nodeId: {"type": "string"},
        minimumSamplingInterval: {"type": "integer"},
        browseName: {"type": "string"},
        dataType : {
            "type": "string",
            "enum": ["Integer","Double"]
        },
        getFunc: {"type":"str"}
    },
    required: ["nodeId","browseName","dataType","minimumSamplingInterval","getFunc"]
  };

export var nodeObj =  {
    id: "/SimpleNodeObj",
    type: "object",
    properties :{
        nodeId: {"type": "string"},
        browseName: {"type": "string"},
        "list": 
        {
            type: "array",
            items: {
            anyOf: [{"$ref":"/SimpleNodeVar"},{"$ref":"/SimpleNodeObj"}]
            }
        }
    },
    required: ["nodeId","browseName"]
  };


