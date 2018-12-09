// Packages
const express = require('express');
const router = express.Router();

const http = require('http');
const https = require('https');
const url = require('URL');
const path = require('path');
const jQuery = require('jquery');

// Status Codes
const SUCCESS = http.STATUS_CODES[200];
const BAD_REQUEST = http.STATUS_CODES[400];

// Other Constants
const GH_API_URL = 'https://api.github.com';

// Language Enum
const Language = Object.freeze({
  JAVA:   Symbol(1),
  JS:     Symbol(2),
  NET:    Symbol(3),
  PYTHON: Symbol(4),
  RUBY:   Symbol(5)
});

/** Classes **/

class GitHubRepo {
  constructor(name, url) {
    this.name = name;
    this.url = url;
    //this.languages = [];
  }
}

class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addNode(node) {
    if (node instanceof TreeNode) {
      this.children.push(node);
      return true;
    }
    else {
      console.log(`Error: ${node} is not a TreeNode`);
      return false;
    }
  }
}

/** Mock Data **/
let mockData1 = {
	"value": {
		"name": "Parent",
		"url": "https://github.com/yang573/dependency-tree"
	},
	"children": [
		{
			"value": {
				"name": "Express",
				"url": "https://github.com/expressjs/express"
			},
			"children": []
		},
		{
			"value": {
				"name": "JQuery",
				"url": "https://github.com/jquery/jquery"
			},
			"children": []
		},
	]
};

let mockData2 = {
	"value": {
		"name": "Parent",
		"url": "https://github.com/yang573/dependency-tree"
	},
	"children": []
};

/** Server Calls **/

router.get('/traverse-repo', function(req,res) {
  console.log('get /traverse-repo received');
  console.log(req.query.url);
  res.status(200).json(mockData1);
});

module.exports = router;
