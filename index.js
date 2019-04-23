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

  let optionsTool = {
    url: baseSchema_Url + 'tool.schema.json',
    method: 'GET'
  };

  var workflowSchemaString = await sendRequest(optionsWorkflow)
  var workflowSchema = JSON.parse(workflowSchemaString)

  var coreSchemaString = await sendRequest(optionsCore)
  var coreSchema = JSON.parse(coreSchemaString)

  var roiSchemaString = await sendRequest(optionsRoi)
  var roiSchema = JSON.parse(roiSchemaString)

  console.log("coreSchema.defintions.roiInOut:", coreSchema.definitions.roiInOut)

  var annotationSchemaString = await sendRequest(optionsAnnotation)
  var annotationSchema = JSON.parse(annotationSchemaString)

  var toolSchemaString = await sendRequest(optionsTool)
  var toolSchema = JSON.parse(toolSchemaString)

  // Validate schemas

  try{

  	console.log("Validate schemas:")

    var ajvOptions = {
	    schemas: [workflowSchema, coreSchema, roiSchema, annotationSchema, toolSchema],
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

    var validateTool = ajv_url.getSchema('https://raw.githubusercontent.com/SPINEProject/SPINE-json-schema/master/schemas/tool.schema.json');

    if(validateTool)
      console.log("validateTool OK")

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

  let optionsToolExample = {
    url: baseInstance_Url + 'tool_annotationThreeViewers.json',
    method: 'GET'
  };

  // Validate schema instances
  console.log("Validate instances:")

  var roiInstance = JSON.parse(await sendRequest(optionsRoiExample))
  var annotationInstance = JSON.parse(await sendRequest(optionsAnnotationExample))
  var toolInstance = JSON.parse(await sendRequest(optionsToolExample))

  var tool = {
    "name": "Lesion annotation with three viewers",
    "description": "This annotation configuration allows the annotation implicit ROIs using points",
    "version": "1.0.2",
    "owner": "user@email.com",
    "privacy": "PUBLIC",
    "creationDate": "April 22, 2019",
    "type": "ANNOTATION",
    
    "annotationTables": {
      "lesion": {
        "defaultAnnotations": [
          {
            "typeAnnotation": "text",
            "annotationProperties": {
              "ontologyId":"https://bioportal.bioontology.org/ontologies/SNOMEDCT",
              "ontologyValue": "http://purl.bioontology.org/ontology/SNOMEDCT/52988006",
              "PreferredName" : "Lesion"
            }
          }
        ],
        "userAnnotations": [
          {
            "title": "Location",
            "typeAnnotation": "text",
            "ontologyId": "https://bioportal.bioontology.org/ontologies/FMA",
            "hasDefaultValue": false,
            "possibleValues": [
              {
                "valueInOntology": "http://purl.org/sig/ont/fma/fma258716",
                "valueToDisplay" : "Left thalamus"
              },
              {
                "valueInOntology": "http://purl.org/sig/ont/fma/fma258714",
                "valueToDisplay" : "Right thalamus"
              },
              {
                "valueInOntology": "http://purl.org/sig/ont/fma/fma7647",
                "valueToDisplay" : "Spinal cord"
              }
            ]
          } 
        ]
      }
    },

    "inputs": {
      "imagesA":{
        "name": "Input images",
        "description": "Input images for the annotation tool",
        "isList": true,
        "filter": {
          "test": "test"
        },
        "type": "imageEntityInOut",
        "imageEntityInOut_FileFormat": "dicom.gz",
        "imageEntityInOut_Type": "ANATOMICAL",
        "required": true
      }
    },

    "outputs": {
      "rois":{
        "name": "Created ROIs",
        "description": "ROIs created with the annotation tool",
        "isList": true,
        "type": "roiInOut",
        "roiInOut_FileFormat": "json"
      }
    },

    "configuration":{
      "viewers": {
        "generalConfiguration":{
          "linking":{
            "linkingControl": true,
            "linkingInitialValue": false
          }
        },
        "specificConfiguration":{
          "left":{
            "name": "left viewer",
            "location": {
              "row": 1,
              "column": 1,
              "rowspan": 1,
              "columnspan": 1
            },
            "windowLevel":{
              "userCanChangeWindowLevel": true
            },
            "displayImages":{
              "possibleImagesToDisplay": ["imagesA"]
            },
            "hasDefaultImageToDisplay": false,
            "displayControls":{
              "orientations": ["axial", "sagittal", "coronal"],
              "defaultOrientation": "axial",
              "smoothing": {
                "smoothingControl": true,
                "smoothingDefault": false
              }
            }
          }
        }
      },

      "widgets":{
        "pointSelector":{
          "roiAnnotationLinks": [
            {
              "nameRoi": "lesion",
              "relationWithRoi": "implicit",
              "implicitRelationWithRoi":"inside",
              "geometryPointer": "point"
            }
          ]
        }
      }
    }
  }

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