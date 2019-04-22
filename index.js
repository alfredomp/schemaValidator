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

  // Get the schemas
  let baseSchema_Url = 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/'

  let optionsWorkflow = {
    url: baseSchema_Url + 'workflow.schema.json',
    method: 'GET'
  };

  let optionsCore = {
    url: baseSchema_Url + 'core.schema.json',
    method: 'GET'
  };

  let optionsRoi = {
    url: baseSchema_Url + 'roi.schema.json',
    method: 'GET'
  };

  let optionsAnnotation = {
    url: baseSchema_Url + 'annotation.schema.json',
    method: 'GET'
  };

  var workflowSchemaString = await sendRequest(optionsWorkflow)
  var workflowSchema = JSON.parse(workflowSchemaString)

  var coreSchemaString = await sendRequest(optionsCore)
  var coreSchema = JSON.parse(coreSchemaString)

  var roiSchemaString = await sendRequest(optionsRoi)
  var roiSchema = JSON.parse(roiSchemaString)

  var annotationSchemaString = await sendRequest(optionsAnnotation)
  var annotationSchema = JSON.parse(annotationSchemaString)

  // Validate schemas

  try{

  	console.log("Validate schemas:")

    var ajvOptions = {
	    schemas: [workflowSchema, coreSchema, roiSchema, annotationSchema],
	    allErrors: true
	  }

	  var ajv_url = new Ajv(ajvOptions); // options can be passed, e.g. {allErrors: true}

	  var validateWorkflow = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/workflow.schema.json');

    if(validateWorkflow)
	  	console.log("validateWorkflow OK")

	  var validateAnnotation = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/annotation.schema.json');

	  if(validateAnnotation)
	  	console.log("validateAnnotation OK")

	  var validateRoi = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/roi.schema.json');

	  if(validateRoi)
	  	console.log("validateRoi OK")

	  console.log("")

  }
  catch(e){
  	console.log('Error creating validate_url:', e)
  }

  // Load schema instances to be validated
  let baseInstance_Url = 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/examples/annotationWorkflow/'

  let optionsRoiExample = {
    url: baseInstance_Url + 'roi_notSubmitted.json',
    method: 'GET'
  };

  let optionsAnnotationExample = {
    url: baseInstance_Url + 'annotation_notSubmitted.json',
    method: 'GET'
  };

  // Validate schema instances
  console.log("Validate instances:")

  var roiInstance = JSON.parse(await sendRequest(optionsRoiExample))
  var annotationInstance = JSON.parse(await sendRequest(optionsAnnotationExample))

  var validAnnotation = validateAnnotation(annotationInstance)
  if (!validAnnotation){
  	console.log("Not valid annotation. Error:", validateAnnotation.errors);
  }
  else{
  	console.log("Annotation instance OK")
  }

  var validRoi = validateRoi(roiInstance)
  if (!validRoi){
  	console.log("Not valid roi. Error:", validRoi.errors);
  }
  else{
  	console.log("Roi instance OK")
  }


}

try{
  main()
}catch(err)
{
  console.log(err);
}