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
	// Test getting the schemas from github

  // Get the schemas
  let optionsWorkflow = {
    url: 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/workflow.schema.json',
    method: 'GET'
  };

  let optionsCore = {
    url: 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/core.schema.json',
    method: 'GET'
  };

  let optionsRoi = {
    url: 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/roi.schema.json',
    method: 'GET'
  };

  let optionsAnnotation = {
    url: 'https://raw.githubusercontent.com/alfredomp/SPINE-json-schema/master/schemas/annotation.schema.json',
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

  // Validations steps

  try{

    var ajvOptions = {
	    schemas: [workflowSchema, coreSchema, roiSchema, annotationSchema],
	    allErrors: true
	  }

	  var ajv_url = new Ajv(ajvOptions); // options can be passed, e.g. {allErrors: true}

	  var validate_workflow = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/workflow.schema.json');

	  console.log("validate_workflow:", validate_workflow, '\n\n')

	  var validate_annotation = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/workflow.schema.json');

	  console.log("validate_annotation:", validate_annotation)

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