/*
{
            "browseName": "baseMotor",
            "nodeId": "baseMotor", 
            "minimumSamplingInterval": 3000, 
            "dataType": "Boolean",
            "getFunc": "generate_sequence_double_30"
        },
*/

import {NodeObj,NodeVar} from '../config/classes/node-classes.js'

var myNodeObj,i=0;
myNodeObj = new NodeObj("MyFactoryDevices","MyFactoryDevicesId")
myNodeObj.addNode(new NodeVar("ConveyorSpeed","ConveyorSpeedId",1000,"Double","generate_sequence_double_30"))
myNodeObj.addNode(new NodeVar("MotorCurrent","MotorCurrentId",500,"Double","generate_sequence_double"))
for(i;i<1000;i++){
    myNodeObj.addNode(new NodeVar("MotorRpm-"+i,"MotorRpmId"+i,1000,"Double","generate_sequence_double"))
}
myNodeObj.addNode(new NodeVar("MotorRpm","MotorRpmId",100,"Double","generate_sequence_double"))
console.log(JSON.stringify(myNodeObj, null, 4))