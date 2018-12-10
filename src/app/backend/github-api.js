// Packages
const express = require('express');
const router = express.Router();

const http = require('http');
const https = require('https');
const URL = require('url').URL;
const path = require('path');
const axios = require('axios');

// Status Codes
const SUCCESS = 200;
const BAD_REQUEST = 400;

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

/** Server Calls **/

router.get('/traverse-repo*', function(req,res) {
  console.log('get /traverse-repo received');
  console.log(req.query.url);
  let ghurl = new URL(req.query.url);
  console.log(ghurl);

  verifyRepo(ghurl).then(
    function(result) {
      return buildTree(result);
    }
  ).then(
    function(result) {
      console.log('buildTree');
      console.log(result);
      res.send(JSON.stringify({
        status: SUCCESS,
        message: mockData1
      }));
    }
  ).catch(
    function(error) {
      console.log('error');
      console.log(error);
      res.send(JSON.stringify({
        status: BAD_REQUEST,
        message: error
      }));
    }
  );
});

module.exports = router;

/**
 * Verifies the url, and gets the repo information.
 * @param  {URL} The GitHub repo
 * @return {Error} or {JSON} of repo information
 */
function verifyRepo(ghurl) {
  return new Promise(function(resolve, reject) {
    if (ghurl.hostname.localeCompare('github.com') != 0)
    {
      console.log('Error: Not a GitHub url');
      reject(new Error('Error: Not a GitHub url'));
    }

    let repo = GH_API_URL + '/repos' + ghurl.pathname;
    let options = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'dependency-tree'
      }
    };

    // Check if repo exists
    axios(repo, options).then(
      function(result) {
        console.log('verifyRepo internal');
        // console.log(result);
        // console.log(result.status);
        if (result.status != SUCCESS)
          reject(new Error(result.statusText));
        else
          resolve(result.data);
      },
      function(error) {
        reject(new Error(`Error: ${ghurl} is not a valid GitHub repository URL.`));
      }
    );
  });
}

// ghurl: a URL object
// returns a TreeNode containing a GitHubRepo object
// that represents the given url
function buildTree(repoInfo) {
  return new Promise(function(resolve, reject) {
    let options = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'dependency-tree'
      }
    };

    // console.log('repoInfo');
    // console.log(repoInfo);
    packageUrl = repoInfo.contents_url.replace('{+path}', 'package.json');
    axios(packageUrl, options).then(
      function(result) {
        if (result.status != SUCCESS)
          reject(new Error(result.statusText));

        const rootValue = new GitHubRepo(repoInfo.name, repoInfo.html_url);
        const rootNode = new TreeNode(rootValue);
        for (let dependency in result.data.dependencies) {
          let
        }
          resolve(result.data);
      },
      function(error) {
        reject(new Error(error));
      }
    );
    //.then();
  });
}

// ghurl: a URL object
// returns a TreeNode containing a GitHubRepo object
// that represents the given url
function getDependencies(ghurl) {
  return new Promise(function(resolve, reject) {

    let options = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'dependency-tree'
      }
    };

    //let repo = client.repo(ghurl.pathname.substring(1));
    let repo = GH_API_URL + '/repo' + ghurl.pathname;
    axios(repo, options).then(
      function(result) {
        repo += '/contents/package.json';
      },
      function(error) {
        // TODO: Make this return an empty node;
        return;
      }
    ).then(
      function(result) {

      },
      function(error) {

      }
    );

    repo.info(function(err, data, headers) {
      if (err != null) {
        reject(new Error('Error: Invalid GitHub url'));
      } else {
        repo = new GitHubRepo(repoData.name, repoData.html_url);
        // DEBUG
        console.log(data);
        console.log(headers);
        resolve(data);
      }
    });
  });
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
			"children": [
        {
          "value": {
            "name": "accepts",
            "url": "https://github.com/jshttp/accepts"
          },
          "children": []
        }
      ]
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
