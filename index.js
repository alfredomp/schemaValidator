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
	// "properties": {
	//   "foo": { "$ref": "defs.json#/definitions/int" },
	//   "bar": { "$ref": "defs.json#/definitions/str" }
	// }
 //  };

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
	// Test getting the schemas from github
  let url_schemas = false // True if loading the schemas locally

  var taskSchemeName = 'task.schema.json'
  var workflowSchemeName = 'workflow.schema.json'
  var coreSchemaName = 'core.schema.json'
  var roiSchemaName = 'roi.schema.json'
  var annotationSchemaName = 'annotation.schema.json'
  var toolSchemaName = 'tool.schema.json'

  var workflowSchema = {}
  var coreSchema = {}
  var roiSchema = {}
  var annotationSchema = {}
  var toolSchema = {}


  // Get the schemas
  if(url_schemas){
    let baseSchema_Url = 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/'

    let optionsTask = {
      url: baseSchema_Url + workflowSchemeName,
      method: 'GET'
    };

    let optionsWorkflow = {
      url: baseSchema_Url + workflowSchemeName,
      method: 'GET'
    };

    let optionsCore = {
      url: baseSchema_Url + coreSchemaName,
      method: 'GET'
    };

    let optionsRoi = {
      url: baseSchema_Url + roiSchemaName,
      method: 'GET'
    };

    let optionsAnnotation = {
      url: baseSchema_Url + annotationSchemaName,
      method: 'GET'
    };

    let optionsTool = {
      url: baseSchema_Url + toolSchemaName,
      method: 'GET'
    };

    taskSchemaString = await sendRequest(optionsWorkflow)
    taskSchema = JSON.parse(workflowSchemaString)

    workflowSchemaString = await sendRequest(optionsWorkflow)
    workflowSchema = JSON.parse(workflowSchemaString)

    coreSchemaString = await sendRequest(optionsCore)
    coreSchema = JSON.parse(coreSchemaString)

    roiSchemaString = await sendRequest(optionsRoi)
    roiSchema = JSON.parse(roiSchemaString)

    annotationSchemaString = await sendRequest(optionsAnnotation)
    annotationSchema = JSON.parse(annotationSchemaString)

    toolSchemaString = await sendRequest(optionsTool)
    toolSchema = JSON.parse(toolSchemaString)
  }
  else{
    let folderpath = '/Users/alfredito/workspace/work/SPINE-json-schema/schemas/'

    taskSchema = require(folderpath + taskSchemeName)
    workflowSchema = require(folderpath + workflowSchemeName)
    coreSchema = require(folderpath + coreSchemaName)
    roiSchema = require(folderpath + roiSchemaName)
    annotationSchema = require(folderpath + annotationSchemaName)
    toolSchema = require(folderpath + toolSchemaName)
  }

  // Validate schemas

  try{

  	console.log("Validate schemas:")

    var ajvOptions = {
	    schemas: [taskSchema, workflowSchema, coreSchema, roiSchema, annotationSchema, toolSchema],
	    allErrors: true
	  }

	  var ajv_url = new Ajv(ajvOptions); // options can be passed, e.g. {allErrors: true}

    var validateTask = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/task.schema.json');

    if(validateTask)
      console.log("validateTask OK")

	  var validateWorkflow = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/workflow.schema.json');

    if(validateWorkflow)
	  	console.log("validateWorkflow OK")

	  var validateAnnotation = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/annotation.schema.json');

	  if(validateAnnotation)
	  	console.log("validateAnnotation OK")

	  var validateRoi = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/roi.schema.json');

	  if(validateRoi)
	  	console.log("validateRoi OK")

    var validateTool = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/tool.schema.json');

    if(validateTool)
      console.log("validateTool OK")

	  console.log("")

  }
  catch(e){
  	console.log('Error creating validate_url:', e)
  }

  // Load schema instances to be validated

  let url_instances = false

  var roiInstanceFileName = 'roi_notSubmitted.json'
  var annotationInstanceFileName = 'annotation_notSubmitted.json'
  var toolInstanceFileName = 'tool_annotationThreeViewers.json'

  var roiInstance = {}
  var annotationInstance = {}
  var toolInstance = {}

  if(url_instances){
    let baseInstance_Url = 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/examples/annotationWorkflow/'

    let optionsRoiExample = {
      url: baseInstance_Url + roiInstanceFileName,
      method: 'GET'
    };

    let optionsAnnotationExample = {
      url: baseInstance_Url + annotationInstanceFileName,
      method: 'GET'
    };

    let optionsToolExample = {
      url: baseInstance_Url + toolInstanceFileName,
      method: 'GET'
    };

    roiInstance = JSON.parse(await sendRequest(optionsRoiExample))
    annotationInstance = JSON.parse(await sendRequest(optionsAnnotationExample))
    toolInstance = JSON.parse(await sendRequest(optionsToolExample))
  }
  else{
    let folderpath = '/Users/alfredito/workspace/work/SPINE-json-schema/examples/annotationWorkflow/'

    roiInstance = require(folderpath + roiInstanceFileName)
    annotationInstance = require(folderpath + annotationInstanceFileName)
    toolInstance = require(folderpath + toolInstanceFileName)
  }

  // Validate schema instances
  console.log("Validate instances:")

  var validAnnotation = validateAnnotation(annotationInstance)
  if (!validAnnotation){
  	console.log("Not valid annotation. Error:", validateAnnotation.errors);
  }
  else{
  	console.log("Annotation instance OK")
  }

  var validRoi = validateRoi(roiInstance)
  if (!validRoi){
  	console.log("Not valid roi. Error:", validateRoi.errors);
  }
  else{
  	console.log("Roi instance OK")
  }

  var validTool = validateTool(toolInstance)
  if (!validTool){
    console.log("Not valid tool. Error:", validateTool.errors);
    console.log("Not valid tool. Error[0]:", validateTool.errors[0]);
  }
  else{
    console.log("Tool instance OK")
  }

}

try{
  main()
}catch(err)
{
  console.log(err);
}