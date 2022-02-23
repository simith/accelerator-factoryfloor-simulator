import  {
    OPCUAServer,
    nodesets
} from "node-opcua";

 
  import _ from "underscore";
  import fs from 'fs';

  import Validator from  'jsonschema'; 
  import * as methods from './functions.js';   // path to functions.js
  import {nodeVar,nodeObj}  from './schemas/schema.js';   // path to functions.js
  
  var addressSpace,namespace;
  var server;
 
  var model_name="sorting-machine"; // only one model allowed by the simulator
  //var model_name = "test-device-001"
  var config_dir = "./config/";
  var port_number = 44500;
  /**
   * Traverse and create the OPC UA config on the Server 
   * Note: This is a recursive function that follows the lists in each object
 *   @param baseFolder {string / UAObject} The Folder to laod the variables and objects in
 *   @param inst  {json object} The data model to load into the address space from the config
 */

  function traverse_config(baseFolder,inst){

    var thisFolder;
    var baseObjectsFolder = baseFolder;

    console.log("Entering traverse_config")
    if(inst.hasOwnProperty('list')){
    //add an Object 
    baseObjectsFolder = namespace.addFolder(baseObjectsFolder, {
                                     browseName: inst.browseName
                                    });

    _.map(inst.list,function(content){
        
        if(content.hasOwnProperty('list')){

            traverse_config(baseObjectsFolder,content)
        }
        else
        {
            //add a variable to the object
            addVariable(namespace,
                        baseObjectsFolder,
                        content.browseName,
                        "Double",
                        content.minimumSamplingInterval,
                        content.getFunc)
            //console.log(content);
            console.log("Added variable to Folder")
        }
    });
    }
    else
    {
      console.log("We have nothing to traverse, we need a rootNode - Error")
    }
}

/**
 * @param model_name {string} The data model to load into the address space
 * 
 * @return {json object} The json object loaded from the file - TODO: handle errors (file not found and others)
 *  
 */

function read_config(model_name){

    let rawdata = fs.readFileSync(config_dir+model_name+'.json');
    let json_object = JSON.parse(rawdata);
    return json_object;
}

/**
 * @param json_object {json object} A Json object
 * @param json_schema {json schema object} A json schema object from jsonschema
 * 
 * @return 
 * true - success validating configuration
 * false - failed to validate the configuration 
 */
function validate_config(json_object,json_schema){

    var lresult;
    var lreturn = true;
    var v;

    v = new Validator.Validator();
    v.addSchema(nodeVar);
    lresult = v.validate(json_object,json_schema);
    console.log(lresult);

    if(lresult.errors.length > 0)
        lreturn = false
      
    return lreturn;
}


/**
 * @param server {OPCUAServer} server
 */
function constructAddressSpace(server) {

    var json_obj;
    var lreturn = true;

    addressSpace = server.engine.addressSpace;
    namespace = addressSpace.getOwnNamespace();
    json_obj = read_config(model_name);
    console.log(json_obj);
   
    if(validate_config(json_obj,nodeObj)){
        traverse_config("ObjectsFolder",json_obj);
    }  
    else
    {
        console.log("Failed to validate the config object, check your data model");
        lreturn = false;
    }

    console.log("returning from constructAddressSpace with "+lreturn)
    return lreturn;
}

/**
 * @param server {OPCUAServer} server instance
 * @param component_of {UAObject} Device or Object container
 * @param variable_browse_name {string} Browse name of the variable (OPC UA)
 * @param variable_type {string} type of the variable as string
 * @param sampling_frequency {integer} the sampling frequency for this variable
 * @param get_fx {string} function name for get value of the variable, set not yet supported (TODO) -simith
 */
function addVariable(namespace,
                     component_of,
                     variable_browse_name,
                     variable_type,
                     sampling_frequency,
                     get_fx){

    namespace.addVariable({
                        componentOf: component_of,
                        browseName: variable_browse_name,
                        dataType: variable_type,    
                        minimumSamplingInterval: sampling_frequency,
                        value: { 
                                get:() =>  { return methods[get_fx]()} 
                            }
                    });
}

// main function
(async () => {
    try {
        // Let create an instance of OPCUAServer
            server = new OPCUAServer({
            port: port_number,        // the port of the listening socket of the server
            nodeset_filename: [
                nodesets.standard,
                nodesets.di
            ],
            buidIfo: {
                productName: "Rackspace IIoT Smart Factory Simulation Server (OPC UA)",
                buildNumber: "7658",
                buildDate: new Date(2020, 6, 14)
            }
        });
        await server.initialize();
        if(constructAddressSpace(server)){
        
            await server.start();
            console.log("Server is now listening ... ( press CTRL+C to stop) ");
            server.endpoints[0].endpointDescriptions().forEach(function(endpoint) {
                console.log(endpoint.endpointUrl, endpoint.securityMode.toString(), endpoint.securityPolicyUri.toString());
            });
        }
        else
        {
            console.log("Simulator failed to cnstruct address space...exiting now");
            process.exit(-1);
        }

        process.on("SIGINT", async () => {
            await server.shutdown();
            console.log("Server is shutting down");

        });
    } 
    catch (err) {
        console.log(err);
        process.exit(-1);
    }
})();