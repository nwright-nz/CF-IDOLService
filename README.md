# CF-IDOLService
System service to dynamically provision, bind and deprovision IDOL OnDemand Unstructured Text Indexes

#Introduction
This CloudFoundry service utilises the Stackato open source service broker (https://github.com/ActiveState/cf-services-connector-nodejs) to create a new service that provisions a new unstructured text index in IDOL OnDemand.
The following operations are included:

Provision - Creates a new text index. The flavor of the text index is specified by the service plan
Bind - passes the index name and api key to make available to the bound application
Deprovision - Deletes the text index from IDOL OnDemand

This is a basic implementation to help test the use of IDOL OnDemand text indexes in an application.

#Install Service
To install the service :
Edit the manifest.yml file and include your IDOL OnDemand API key
Edit the config\idol-service.json file to include the url of your cloud foundry instance (this has been tested on Helion Development Platform so should have work fine on native stackato implementations also)

Deploy the application to your platform.

#Create Service Broker
Once the application is deployed, a new service broker needs to be created by running the following command:
create-service-broker --username demouser --password demopassword --url http://idol-service.YOUR-URL-HERE IDOL-ServiceBroker --public

This will create the service plans, and make them public.

#Create service instance
To create a service instance run :
create-service IDOL-Text-Index-Service <name of the service> <application you wish to bind - optional>

Select the appropriate flavor for the text index (for flavor options see : https://www.idolondemand.com/developer/docs/IndexFlavors.html)

The service will be created, the text index will be created (the name of this will be the flavor plus a 4 character random string). The binding will make the credentials available to the application.

#Using service

An example is below for node.js to get the service details:
````
var services = process.env.VCAP_SERVICES;
// Parse the JSON so that we can extract the individual components needed for
// using MySQL
services = JSON.parse(services);
var apiKey = services["IDOL-Text-Index-Service"][0].credentials.apikey;
var index = services["IDOL-Text-Index-Service"][0].credentials.index;
  
response.write("The API Key is : " + apiKey + "\n");
response.write("The index name is : " + index + "\n");
````

All the service information is stored in the VCAP_SERVICES environment variable, and must be parsed to retrieve the credentials.

You can then use the API calls here to interact with your unstructured text index:
https://www.idolondemand.com/developer/apis






