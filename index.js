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

var getJsonFromUrl = async (url, print=false) => {

  console.log("Loading:", url)
  let options = {
    url: url,
    method: 'GET'
  };

  stringVersion = await sendRequest(options)
  jsonVersion = JSON.parse(stringVersion)

  if(print)
    console.log("Json:", jsonVersion)

  return jsonVersion
}

var validateSchema = async (ajv_url, schemaId) => {
  console.log("Validating:", schemaId)
  var validatedSchema = ajv_url.getSchema(schemaId);

  if(validateSchema)
    console.log("Schema validated: OK")
  else
    console.log("ERROR validating schema.")

  return validatedSchema
}

var validateInstance = async (validatingFunction, instance, instanceName, print=false) => {

  console.log("Validating instance:", instanceName)


  if(print)
    console.log('Instance:', instance)

  var validated = validatingFunction(instance)
  if (!validated){
    console.log("Not valid. Error:", validatingFunction.errors);
  }
  else{
    console.log("Valid instance OK")
  }
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
  var materializedTaskSchemaName = 'materializedTask.schema.json'
  var materializedTaskResultSchemaName = 'materializedTaskResult.schema.json'

  var workflowSchema = {}
  var taskSchema = {}
  var coreSchema = {}
  var roiSchema = {}
  var annotationSchema = {}
  var toolSchema = {}
  var materializedTaskSchema = {}
  var materializedTaskResultSchema = {}

  // Load the schemas
  console.log("Load the schemas")
  if(url_schemas){
    let baseSchema_Url = 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/'

    taskSchema = await getJsonFromUrl(baseSchema_Url + taskSchemeName)
    workflowSchema = await getJsonFromUrl(baseSchema_Url + workflowSchemeName)
    coreSchema = await getJsonFromUrl(baseSchema_Url + coreSchemaName)
    roiSchema = await getJsonFromUrl(baseSchema_Url + roiSchemaName)
    annotationSchema = await getJsonFromUrl(baseSchema_Url + annotationSchemaName)
    toolSchema = await getJsonFromUrl(baseSchema_Url + toolSchemaName)
    materializedTaskSchema = await getJsonFromUrl(baseSchema_Url + materializedTaskSchemaName)
    materializedTaskResultSchema = await getJsonFromUrl(baseSchema_Url + materializedTaskResultSchemaName)
  }
  else{
    let folderpath = '/Users/alfredito/workspace/work/SPINE-json-schema/schemas/'

    taskSchema = require(folderpath + taskSchemeName)
    workflowSchema = require(folderpath + workflowSchemeName)
    coreSchema = require(folderpath + coreSchemaName)
    roiSchema = require(folderpath + roiSchemaName)
    annotationSchema = require(folderpath + annotationSchemaName)
    toolSchema = require(folderpath + toolSchemaName)
    materializedTaskSchema = require(folderpath + materializedTaskSchemaName)
    materializedTaskResultSchema = require(folderpath + materializedTaskResultSchemaName)
  }

  // Validate schemas
  console.log("")
  try{

  	console.log("Validate schemas:")

    var ajvOptions = {
	    schemas: [taskSchema, workflowSchema, coreSchema, roiSchema, annotationSchema,
       toolSchema, materializedTaskSchema, materializedTaskResultSchema],
	    allErrors: true
	  }

	  var ajv_url = new Ajv(ajvOptions); // options can be passed, e.g. {allErrors: true}

    let baseSchemaId = 'https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/'

    var validateTask = await validateSchema(ajv_url, baseSchemaId + taskSchemeName)
    var validateWorkflow = await validateSchema(ajv_url, baseSchemaId + workflowSchemeName)
    var validateCore = await validateSchema(ajv_url, baseSchemaId + coreSchemaName)
    var validateRoi = await validateSchema(ajv_url, baseSchemaId + roiSchemaName)
    var validateAnnotation = await validateSchema(ajv_url, baseSchemaId + annotationSchemaName)
    var validateTool = await validateSchema(ajv_url, baseSchemaId + toolSchemaName)
    var validateMaterializedTask = await validateSchema(ajv_url, baseSchemaId + materializedTaskSchemaName)
    var validateMaterializedTaskResult = await validateSchema(ajv_url, baseSchemaId + materializedTaskResultSchemaName)
  }
  catch(e){
  	console.log('Error creating validate_url:', e)
  }

  // Load schema instances to be validated
  console.log("")
  console.log("Load schema instances")
  let url_instances = false

  var roiInstanceFileName = 'roi_notSubmitted.json'
  var annotationInstanceFileName = 'annotation_notSubmitted.json'
  var toolInstanceFileName = 'tool_annotationThreeViewers.json'
  var taskInstanceFileName = 'task-annotation.json'
  var materializedTaskInstanceFileName = 'materialized-task.json'
  var materializedTaskResultsInstanceFileName = 'materialized-task-results.json'

  var roiInstance = {}
  var annotationInstance = {}
  var toolInstance = {}
  var taskInstance = {}
  var materializedTaskInstance = {}
  var materializedTaskResultsInstance = {}

  if(url_instances){
    let baseInstance_Url = 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/examples/annotationWorkflow/'

    roiInstance = await getJsonFromUrl(baseInstance_Url + roiInstanceFileName)
    annotationInstance = await getJsonFromUrl(baseInstance_Url + annotationInstanceFileName)
    toolInstance = await getJsonFromUrl(baseInstance_Url + toolInstanceFileName)
    taskInstance = await getJsonFromUrl(baseInstance_Url + taskInstanceFileName)
    materializedTaskInstance = await getJsonFromUrl(baseInstance_Url + materializedTaskInstanceFileName)
    materializedTaskResultsInstance = await getJsonFromUrl(baseInstance_Url + materializedTaskResultsInstanceFileName)
  }
  else{
    let folderpath = '/Users/alfredito/workspace/work/SPINE-json-schema/examples/annotationWorkflow/'

    roiInstance = require(folderpath + roiInstanceFileName)
    annotationInstance = require(folderpath + annotationInstanceFileName)
    toolInstance = require(folderpath + toolInstanceFileName)
    taskInstance = require(folderpath + taskInstanceFileName)
    materializedTaskInstance = require(folderpath + materializedTaskInstanceFileName)
    materializedTaskResultsInstance = require(folderpath + materializedTaskResultsInstanceFileName)
  }

  // Validate schema instances
  console.log("")
  console.log("Validate instances:")

  await validateInstance(validateAnnotation, annotationInstance, Object.keys({annotationInstance})[0])
  await validateInstance(validateRoi, roiInstance, Object.keys({roiInstance})[0])
  await validateInstance(validateTool, toolInstance, Object.keys({toolInstance})[0])
  await validateInstance(validateTask, taskInstance, Object.keys({taskInstance})[0])
  await validateInstance(validateMaterializedTask, materializedTaskInstance, Object.keys({materializedTaskInstance})[0])
  await validateInstance(validateMaterializedTaskResult, materializedTaskResultsInstance, Object.keys({materializedTaskResultsInstance})[0])

}

try{
  main()
}catch(err)
{
  console.log(err);
}