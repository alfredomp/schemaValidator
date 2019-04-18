var request = require('request')
var Ajv = require('ajv');


var sendRequest = async (options) => {
    return new Promise(function(resolve,reject) {

        request(options, function (error, response, body) {
            if (error) {
                console.log('Error', error);
                reject(error)
            } else if (response && ( response.statusCode == '200' || response.statusCode == '201')) {
                //console.log("response:",response)
                resolve(body)
            } else {
                console.log('Request error.');
                console.log('  Status Code:', response.statusCode);
                console.log('  Body:', body);
                reject('Request error. Status Code:' + response.statusCode + ' Body:' + body)
            }
        }) // request
    })
}

// Main function
var main = async () => {

	// --------------------------------------------------------------------------
  // Simple test

 //  var schema = {
 //    "$id": "http://example.com/schemas/schema.json",
 //    "type": "object",
	//   "properties": {
	//     "foo": { "$ref": "defs.json#/definitions/int" },
	//     "bar": { "$ref": "defs.json#/definitions/str" }
	//   }
	// };

	// var defsSchema = {
	//   "$id": "http://example.com/schemas/defs.json",
	//   "definitions": {
	//     "int": { "type": "integer" },
	//     "str": { "type": "string" }
	//   }
	// };

	// var ajv = new Ajv({schemas: [schema, defsSchema]});
	// var validate = ajv.getSchema('http://example.com/schemas/schema.json');

	// --------------------------------------------------------------------------
	// Test with the schemas in the code

 //  var schema_amp = {
	//   "$id":"https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/workflow.json",
	//   "$schema": "http://json-schema.org/draft-07/schema#",
	//   "title": "SPINE Workflow",
	//   "type": "object",
	//   "properties": {
	//     "uuid": {
	//       "description":"Workflow UUID",
	//       "type":"string"
	//     },
	//     "name": {
	//       "description":"Workflow name",
	//       "type":"string"
	//     },
	//     "description": {
	//       "description":"Workflow description",
	//       "type":"string"
	//     },
	//     "version": {
	//       "description":"Workflow version",
	//       "type":"string"
	//     },
	//     "owner": {
	//       "description":"Workflow owner",
	//       "type":"string"
	//     },
	//     "privacy": {
	//       "description":"Workflow privacy",
	//         "type":"string",
	//         "enum":["PUBLIC","PRIVATE"]
	//       },
	//     "creationDate": {
	//       "description":"Workflow date of creation",
	//       "type":"string"
	//     },
	//     "inputs":{
	//       "description": "Object with the inputs of the Workflow",
	//       "$ref":"core.json#/definitions/spineInput"
	//     },
	//     "constants":{
	//       "description": "Object with the constant inputs of the Workflow",
	//       "$ref":"core.json#/definitions/spineInput"
	//     },
	//     "outputs":{
	//       "description": "Object with the outputs of the Workflow",
	//       "$ref":"core.json#/definitions/spineOutput"
	//     },
	//     "tasks":{
	//       "type": "object",
	//       "description": "The list of task. Another workflow can be a task for a workflow.",
	//       "minProperties": 1,
	//       "patternProperties" : {
	//         ".*" : {
	//           "type": "object",
	//           "properties": {
	//             "type":{
	//               "description":"Task description",
	//               "type":"string"
	//             },
	//             "taskId":{
	//               "description":"UUID of the task or workflow descriptor",
	//               "type":"string"
	//             }
	//           }
	//         }
	//       }
	//     },
	//     "connectionsBetweenWorkflowAndTasks": {
	//       "type": "object",
	//       "description": "The connections between the workflow input/output and the tasks input/output.",
	//       "properties": {
	//         "inputs": {
	//           "type": "object",
	//           "description": "The connections between the workflow input/constants and the tasks input.",
	//           "minProperties": 1,
	//           "patternProperties" : {
	//             ".*" : {
	//               "type": "object",
	//               "properties": {
	//                 "workflowInput":{
	//                   "description":"ID of the workflow input",
	//                   "type":"string"
	//                 },
	//                 "task":{
	//                   "description":"Task on which to connect the workflow input",
	//                   "type":"object",
	//                   "properties": {
	//                     "name":{
	//                       "description":"Task key",
	//                       "type":"string"
	//                     },
	//                     "input": {
	//                       "description":"ID of the task input to connected to the workflow input",
	//                       "type":"string"
	//                     }
	//                   }
	//                 }
	//               }
	//             }
	//           }
	//         },
	//         "outputs": {
	//           "type": "object",
	//           "description": "The connections between the workflow outputs and the tasks outputs.",
	//           "minProperties": 1,
	//           "patternProperties" : {
	//             ".*" : {
	//               "type": "object",
	//               "properties": {
	//                 "workflowOutput":{
	//                   "description":"ID of the workflow output",
	//                   "type":"string"
	//                 },
	//                 "task":{
	//                   "description":"Task on which to connect the workflow output",
	//                   "type":"object",
	//                   "properties": {
	//                     "name":{
	//                       "description":"Task key",
	//                       "type":"string"
	//                     },
	//                     "output": {
	//                       "description":"ID of the task output to connected to the workflow output",
	//                       "type":"string"
	//                     }
	//                   }
	//                 }
	//               }
	//             }
	//           }
	//         }
	//       }
	//     },
	//     "connectionsBetweenTasks":{
	//       "description": "Connections between the outputs and inputs of the tasks and internal workflows",
	//       "patternProperties" : {
	//         ".*": {
	//           "type": "object",
	//           "properties": {
	//             "fromTask": {
	//               "description": "Output of a task to connect",
	//               "type": "object",
	//               "properties": {
	//                 "name":{
	//                   "description":"Name of the task",
	//                   "type": "string"
	//                 },
	//                 "output":{
	//                   "description":"Name of the output in the task",
	//                   "type": "string"
	//                 }
	//               },
	//               "required":["name", "output"]
	//             },
	//             "toTask": {
	//               "description": "Intput of a task to be connect",
	//               "type": "object",
	//               "properties": {
	//                 "name":{
	//                   "description":"Name of the task",
	//                   "type": "string"
	//                 },
	//                 "input":{
	//                   "description":"Name of the input in the task",
	//                   "type": "string"
	//                 }
	//               },
	//               "required":["name", "input"]
	//             }
	//           },
	//           "required":["fromTask", "toTask"]
	//         }
	//       }
	//     },
	//     "transitions":{
	//       "description": "State transitions in the workflow. A transition with only 'to' means that it comes from the inputs of the workflow, a transition with only 'from' means that the results transit to the outputs of the workflow",
	//       "type": "object",
	//       "patternProperties" : {
	//         ".*": {
	//           "type": "object",
	//           "properties": {
	//             "to": {
	//               "description": "Targeted task, just the names, to be fired when the by the transition.",
	//               "type": "array",
	//               "items":{
	//                 "type":"string"
	//               }
	//             },
	//             "from": {
	//               "description": "Source task, when all the source task are done, the transition is fired.",
	//               "type": "array",
	//               "items":{
	//                 "type":"string"
	//               }
	//             }
	//           },
	//           "anyOf": [
	//             {
	//               "required":["to"]
	//             },
	//             {
	//               "required":["from"]
	//             }
	//           ]
	//         }
	//       }
	//     }
	//   },
	//   "required": ["name","uuid","description","version","owner","privacy",
	//     "creationDate","inputs","outputs", "constants",
	//     "tasks","connectionsBetweenWorkflowAndTasks","connectionsBetweenTasks",
	//   "transitions"],
	//   "additionalProperties": false
	// }

	// var defsSchema_amp = {
 //  "$id":"https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/core.json",
	//   "$schema": "http://json-schema.org/draft-07/schema#",
	//   "title": "SPINE Core",
	//   "definitions": {
	//     "spineType": {
	//       "$id" : "#spineType",
	//       "description": "SPINE Type",
	//       "type": "string",
	//       "enum": ["imageFile","imageEntity","auxiliaryImageFile","imagingVariable",
	//         "String", "Number","roiAnnotationGroup",
	//         "imagingVariableGroup","lookupTable"]
	//     },
	//     "imageType": {
	//       "$id" : "#imageType",
	//       "description": "SPINE Image Type",
	//       "type": "string",
	//       "enum": ["T1w","T2w","T2star","T1map","T2map", "FLAIR", "PDT2","PDmap",
	//         "Anatomical", "DWI","DiscreteLabelMap","ProbabilisticLabelMap"]
	//     },
	//     "auxiliaryFileType": {
	//       "$id" : "#auxiliaryFileType",
	//       "description": "SPINE Aux. Image Type",
	//       "type": "string",
	//       "enum": ["bvec","bval"]
	//     },
	//     "format": {
	//       "$id" : "#format",
	//       "description": "Format",
	//       "type": "string",
	//       "enum": ["nii","nii.gz","dicom.gz","minc","nrrd","dicom"]
	//     },
	//     "filter": {
	//       "$id" : "#filter",
	//       "description": "Filter for inputs. To be defined",
	//       "type": "object"
	//     },
	//     "spineInput": {
	//       "$id" : "#spineInput",
	//       "description": "SPINE definition for inputs for workflows and tasks",
	//       "type": "object",
	//       "minProperties": 1,
	//       "patternProperties" : {
	//         ".*" : {
	//           "type": "object",
	//           "properties": {
	//             "name": {
	//               "description":"Human readable name for the input",
	//               "type":"string"
	//             },
	//             "description": {
	//               "description":"Human readable description for the input",
	//               "type":"string"
	//             },
	//             "isList": {
	//               "description":"True if the Input is a list.",
	//               "type":"boolean"
	//             },
	//             "type":{
	//               "description":"Input type",
	//               "$ref":"#/definitions/spineType"
	//             },
	//             "format":{
	//               "description":"Input format",
	//               "$ref":"#/definitions/format"
	//             },
	//             "imageType":{
	//               "description":"Image type if input type is imageFile or imageEntity",
	//               "$ref":"#/definitions/imageType"
	//             },
	//             "auxiliaryFileType":{
	//               "description":"Image type if input type is auxiliaryImageFileimageFile",
	//               "$ref":"#/definitions/auxiliaryFileType"
	//             },
	//             "imagingVariable":{
	//               "description":"Imaging variable ID",
	//               "type":"string"
	//             },
	//             "filter":{
	//               "description":"Filter for this input based on input parameters",
	//               "$ref":"#/definitions/filter"
	//             },
	//             "idInDescriptor": {
	//               "description":"ID of the corresponding Tool Input in the Tool Descriptor. Required if it is the Input of a Task",
	//               "type":"string"
	//             }
	//           },
	//           "required": [],
	//           "oneOf": [
	//             {
	//               "properties":{
	//                 "type": {"enum": ["imageFile"]}
	//               },
	//               "required":["imageType", "format"]
	//             },
	//             {
	//               "properties":{
	//                 "type": {"enum": ["imageEntity"]}
	//               },
	//               "required":["imageType", "format"]
	//             },
	//             {
	//               "properties":{
	//                 "type": {"enum": ["auxiliaryImageFile"]}
	//               },
	//               "required":["auxiliaryFileType", "format"]
	//             }
	//           ],
	//           "dependencies": {
	//             "imageType": {
	//               "properties": {
	//                 "type": {
	//                   "enum": ["imageFile"]
	//                 }
	//               }
	//             },
	//             "auxiliaryFileType": {
	//               "properties": {
	//                 "type": {
	//                   "enum": ["auxiliaryImageFile"]
	//                 }
	//               }
	//             },
	//             "format": {
	//               "properties": {
	//                 "type": {
	//                   "enum": ["imageFile","imageEntity","auxiliaryImageFile"]
	//                 }
	//               }
	//             }
	//           }
	//         }
	//       }
	//     },
	//     "spineOutput": {
	//       "$id" : "#spineOutput",
	//       "description": "SPINE definition for inputs for workflows and tasks",
	//       "type": "object",
	//       "minProperties": 1,
	//       "patternProperties" : {
	//         ".*" : {
	//           "type": "object",
	//           "properties": {
	//             "type":{
	//               "description":"Output type",
	//               "$ref":"#/definitions/spineType"
	//             },
	//             "typeImageFile":{
	//               "description":"Output Image File Type",
	//               "type":"string"
	//             },
	//             "typeAuxiliaryImageFile":{
	//               "description":"Output Image File Type",
	//               "type":"string"
	//             },
	//             "typeImagingVariable":{
	//               "description":"Output Image File Type",
	//               "type":"string"
	//             },
	//             "fileType":{
	//               "description":"Output File Type",
	//               "type":"string"
	//             },
	//             "idInDescriptor": {
	//               "description":"Id of the Output in the descriptor",
	//               "type":"string"
	//             }
	//           },
	//           "required": ["type", "idInDescriptor"],
	//           "oneOf": [
	//             {
	//               "properties":{
	//                 "type": {"enum": ["imageFile"]}
	//               },
	//               "required":["typeImageFile", "fileType"]
	//             },
	//             {
	//               "properties":{
	//                 "type": {"enum": ["auxiliaryImageFile"]}
	//               },
	//               "required":["typeAuxiliaryImageFile", "fileType"]
	//             },
	//             {
	//               "properties":{
	//                 "type": {"enum": ["imagingVariable"]}
	//               },
	//               "required":["typeImagingVariable"]
	//             }
	//           ],
	//           "dependencies": {
	//             "typeImageFile": {
	//               "properties": {
	//                 "type": {
	//                   "enum": ["imageFile"]
	//                 }
	//               }
	//             },
	//             "typeAuxiliaryImageFile": {
	//               "properties": {
	//                 "type": {
	//                   "enum": ["auxiliaryImageFile"]
	//                 }
	//               }
	//             },
	//             "typeImagingVariable": {
	//               "properties": {
	//                 "type": {
	//                   "enum": ["imagingVariable"]
	//                 }
	//               }
	//             },
	//             "fileType": {
	//               "properties": {
	//                 "type": {
	//                   "enum": ["imageFile", "auxiliaryImageFile"]
	//                 }
	//               }
	//             }
	//           }
	//         }
	//       }
	//     }
	//   }
	// }

	// try{
	// 	var ajv_amp = new Ajv({schemas: [schema_amp, defsSchema_amp]});
	// 	var validate_amp = ajv_amp.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/workflow.json');

	// 	console.log("validate_amp:", validate_amp)
	// }
 //  catch(e){
 //  	console.log('Error ajv_amp:', e)
  // }

	// --------------------------------------------------------------------------
	// Test getting the schemas from github

  // Get the schemas
  let optionsWorkflow = {
    url: 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/workflow.json',
    method: 'GET'
  };

  var workflowSchemaString = await sendRequest(optionsWorkflow)
  var workflowSchema = JSON.parse(workflowSchemaString)


  let optionsCore = {
    url: 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/core.json',
    method: 'GET'
  };

  var coreSchemaString = await sendRequest(optionsCore)
  var coreSchema = JSON.parse(coreSchemaString)


  // Validations steps

  try{

    var ajvOptions = {
	    schemas: [workflowSchema, coreSchema],
	    allErrors: true
	  }

	  var ajv_url = new Ajv(ajvOptions); // options can be passed, e.g. {allErrors: true}

	  var validate_url = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/workflow.json');

		console.log("validate_url:", validate_url)

  }
  catch(e){
  	console.log('Error creating validate_url:', e)
  }

}

try{
  main()
}catch(err)
{
  console.log(err);
}