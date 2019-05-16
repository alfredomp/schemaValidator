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

  // Create a meta object for each schema
  var task = {schemaName: 'task.schema.json'}
  var workflow = {schemaName: 'workflow.schema.json'}
  var core = {schemaName: 'core.schema.json'}
  var roi = {schemaName: 'roi.schema.json'}
  var annotation = {schemaName: 'annotation.schema.json'}
  var annotationForm = {schemaName: 'annotationForm.schema.json'}
  var tool = {schemaName: 'tool.schema.json'}
  var materializedTask = {schemaName: 'materializedTask.schema.json'}
  var materializedTaskResult = {schemaName: 'materializedTaskResult.schema.json'}
  var taskExecutor = {schemaName: 'taskExecutor.schema.json'}
  var taskResult = {schemaName: 'taskResult.schema.json'}
  var workflowExecutor = {schemaName: 'workflowExecutor.schema.json'}
  var workflowResult = {schemaName: 'workflowResult.schema.json'}
  var experiment = {schemaName: 'experiment.schema.json'}
  var statisticalModel = {schemaName: 'statisticalModel.schema.json'}

  // All the schemas in an array
  var allMetaSchemas = [task, workflow, core, roi, annotation, annotationForm, tool, materializedTask,
   materializedTaskResult, taskExecutor, taskResult, workflowExecutor, workflowResult,
   experiment, statisticalModel]

  // Load the schema for each metaobject
  console.log("Load the schemas")
  if(url_schemas){

    let baseSchema_Url = 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/'

    for(i in allMetaSchemas){
      allMetaSchemas[i].schema = await getJsonFromUrl(baseSchema_Url + allMetaSchemas[i].schemaName)
    }

  }
  else{
    let folderpath = '/Users/alfredito/workspace/work/SPINE-json-schema/schemas/'

    for(i in allMetaSchemas){
      allMetaSchemas[i].schema = require(folderpath + allMetaSchemas[i].schemaName)
    }
  }

  // Validate each schemas
  console.log("")
  try{

  	console.log("Validate schemas:")

    // Add all the schemas to an array to be passed to the ajv constructor
    let schemas = []
    for(i in allMetaSchemas){
      schemas.push(allMetaSchemas[i].schema)
    }

    var ajvOptions = {
      schemas: schemas,
	    allErrors: true
	  }

	  var ajv_url = new Ajv(ajvOptions); // options can be passed, e.g. {allErrors: true}

    let baseSchemaId = 'https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/'

    // Validate each schema. This creates a validationFunction in each meta object
    for(i in allMetaSchemas){
      allMetaSchemas[i].validationFunction = await validateSchema(ajv_url, baseSchemaId + allMetaSchemas[i].schemaName)
    }

  }
  catch(e){
  	console.log('Error creating validate_url:', e)
  }

  // Load schema instances to be validated
  console.log("")
  console.log("Load schema instances")

  let url_instances = false

  // Create metaobjects for each instance
  var taskInstance = {fileName: 'task-annotation.json'}
  var workflowInstance = {fileName: 'workflow-annotation.json'}
  var roiInstance = {fileName: 'roi_notSubmitted.json'}
  var annotationInstance = {fileName: 'annotation_notSubmitted.json'}
  var toolInstance = {fileName: 'tool_annotationThreeViewers.json'}
  var materializedTaskInstance = {fileName: 'materialized-task.json'}
  var materializedTaskResultsInstance = {fileName: 'materialized-task-results.json'}
  var taskExecutorInstance = {fileName: 'task-annotation-executor.json'}
  var taskResultInstance = {fileName: 'task-annotation-results.json'}
  var workflowExecutorInstance = {fileName: 'workflow-annotation-executor.json'}
  var workflowResultInstance = {fileName: 'workflow-annotation-results.json'}
  var experiment_POST_Instance = {fileName: 'experiment_POST.json'}
  var experiment_PUT_GET_Instance = {fileName: 'experiment_PUT_GET.json'}
  var statisticalModel_SPINE_GLM_Instance = {fileName: 'statisticalModel_SPINE_GLM.json'}
  var statisticalModel_Author_GLM_Instance = {fileName: 'statisticalModel_Author_GLM.json'}

  var allMetaInstances = [taskInstance, workflowInstance, roiInstance, 
    annotationInstance, toolInstance, materializedTaskInstance, 
    materializedTaskResultsInstance, taskExecutorInstance, taskResultInstance,
    workflowExecutorInstance, workflowResultInstance, experiment_POST_Instance,
    experiment_PUT_GET_Instance, statisticalModel_SPINE_GLM_Instance, 
    statisticalModel_Author_GLM_Instance]

  // Define the functions to be used to load the json files, i.e., url or file
  var loadJsonFunction = getJsonFromUrl
  var baseLocation = 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/examples/annotationWorkflow/'

  if(!url_instances){
    loadJsonFunction = require
    baseLocation = '/Users/alfredito/workspace/work/SPINE-json-schema/examples/annotationWorkflow/'
  }

  // Loaad the instance json for each meta instance
  for(i in allMetaInstances){
    allMetaInstances[i].instance = await loadJsonFunction(baseLocation + allMetaInstances[i].fileName)
  }

  // Validate schema instances
  console.log("")
  console.log("Validate instances:")

  await validateInstance(task.validationFunction, taskInstance.instance, taskInstance.fileName)
  await validateInstance(workflow.validationFunction, workflowInstance.instance, workflowInstance.fileName)
  await validateInstance(roi.validationFunction, roiInstance.instance, roiInstance.fileName)
  await validateInstance(annotation.validationFunction, annotationInstance.instance, annotationInstance.fileName)
  await validateInstance(tool.validationFunction, toolInstance.instance, toolInstance.fileName)
  await validateInstance(materializedTask.validationFunction, materializedTaskInstance.instance, materializedTaskInstance.fileName)
  await validateInstance(materializedTaskResult.validationFunction, materializedTaskResultsInstance.instance, materializedTaskResultsInstance.fileName)
  await validateInstance(taskExecutor.validationFunction, taskExecutorInstance.instance, taskExecutorInstance.fileName)
  await validateInstance(taskResult.validationFunction, taskResultInstance.instance, taskResultInstance.fileName)
  await validateInstance(workflowExecutor.validationFunction, workflowExecutorInstance.instance, workflowExecutorInstance.fileName)
  await validateInstance(workflowResult.validationFunction, workflowResultInstance.instance, workflowResultInstance.fileName)
  //await validateInstance(experiment.validationFunction, experiment_POST_Instance.instance, experiment_POST_Instance.fileName)
  await validateInstance(experiment.validationFunction, experiment_PUT_GET_Instance.instance, experiment_PUT_GET_Instance.fileName)
  await validateInstance(statisticalModel.validationFunction, statisticalModel_SPINE_GLM_Instance.instance, statisticalModel_SPINE_GLM_Instance.fileName)

  await validateInstance(statisticalModel.validationFunction, statisticalModel_Author_GLM_Instance.instance, statisticalModel_Author_GLM_Instance.fileName)
  

}

try{
  main()
}catch(err)
{
  console.log(err);
}