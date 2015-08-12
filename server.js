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
var request = require('request');
var random = require('randomstring')
var broker = new Broker(Config);
var apiKey = process.env.APIKEY;
var plan = "";
var index = "";
broker.start();

broker.on('provision', function (req, next) {
    //how do i accept parameters? for the name of the index / the description?
	plan = req.params.plan_id;
    index = plan + "-" + random.generate(4);
	request.post('https://api.idolondemand.com/1/api/sync/createtextindex/v1', {form:{apikey:apiKey, index: index, flavor:plan}},
	function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});
	

    var reply = { apiKey : plan };
    //console.log("API KEY is: " + apiKey);
	//console.log("Plan is " + plan);
    next(reply);
});

broker.on('unprovision', function (req, next) {
    var confCode = "";
    request.post('https://api.idolondemand.com/1/api/sync/deletetextindex/v1', {form:{apikey:apiKey, index: index}},
        function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                console.log(response.statusCode, body);
                var parsedBody = JSON.parse(body);
                confCode = parsedBody.confirm
                request.post('https://api.idolondemand.com/1/api/sync/deletetextindex/v1', {form:{apikey:apiKey, index: index, confirm:confCode}},
                    function(error, response, body){
                        if(error) {
                            console.log(error);
                        } else {
                        }

            });
        }});

    next();
});

broker.on('bind', function (req, next) {
    // What do we need for a bind? Return the index name, and the API Key?
    var reply = {};

    reply.credentials = {
        index: index,
        apikey: apiKey,
    };
    next(reply);
});

broker.on('unbind', function (req, next) {
    next();
});

// broker.stop();
