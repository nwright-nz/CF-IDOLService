/*
 * Cloud Foundry Services Connector
 * Copyright (c) 2014 ActiveState Software Inc. All rights reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

'use strict';


var Broker = require('cf-services-connector');
var Config = require('./config/idol-service');

var https = require('https');
var broker = new Broker(Config);
var apiKey = process.env.APIKEY;
var plan = "";

broker.start();

broker.on('provision', function (req, next) {
    //create the text index - How to get the params from the service plan?
	plan = req.params.plan_id;
	
	var options = {
	host: "api.idolondemand.com",
	port: 443,
	path: '/1/api/sync/createtextindex/v1?index=test&flavor=' + plan + '&apikey=' + apiKey ,
	method: 'POST'
	};
	
	console.log(options);
	
	request.post('https://api.idolondemand.com/1/api/sync/createtextindex/v1', {form:{apikey:apiKey, index:'test', flavor:plan}},
	function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});
	

    var reply = { apiKey : plan };
    console.log("API KEY is: " + apiKey);
	console.log("Plan is " + plan);
    next(reply);
});

broker.on('unprovision', function (req, next) {
    next();
});

broker.on('bind', function (req, next) {
    var reply = {};

    reply.credentials = {
        echo: 'echo',
        anotherEcho: 'anotherEcho',
    };
    next(reply);
});

broker.on('unbind', function (req, next) {
    next();
});

// broker.stop();
