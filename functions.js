

"use strict";
import {
    Variant,
    DataType,
} from "node-opcua";
import os from "os";

export var generate_sequence_double = function(){

    // const value = process.memoryUsage().heapUsed / 1000000;
    const percentageMemUsed = 1.0 - (os.freemem() / os.totalmem());
    const value = percentageMemUsed * 90;
    return new Variant({ dataType: DataType.Double, value: value });
  
  }

  export var generate_sequence_double_30 = function(){

    // const value = process.memoryUsage().heapUsed / 1000000;
    const percentageMemUsed = 1.0 - (os.freemem() / os.totalmem());
    const value = percentageMemUsed * 30;
    return new Variant({ dataType: DataType.Double, value: value });
  
  }

  export var generate_sequence_integer = function(){

    var value = Math.floor( Math.random() * (30000 - 1) + 1)
    return new Variant({ dataType: DataType.Int32, value: value });
  }

  export function generate_boolean(){

    var boolVal = false;
    const percentageMemUsed = 1.0 - (os.freemem() / os.totalmem());
    const value = parseInt(percentageMemUsed * 80,10);
    if((value % 2) == 0){
      boolVal = true;
    }
    return new Variant({ dataType: DataType.Boolean, value: boolVal });
  }


 /* export var functions={
    //  name_exported : internal_name
    generate_sequence_double : generate_sequence_double,
    generate_sequence_double_30 : generate_sequence_double_30,
    generate_sequence_integer: generate_sequence_integer,
    generate_boolean: generate_boolean
} */