// Packages
const express = require('express');
const router = express.Router();
const axios = require('axios');

const http = require('http');
const https = require('https');
const URL = require('url').URL;
const path = require('path');
const util = require('util');

// Status Codes
const SUCCESS = 200;
const BAD_REQUEST = 400;

// Other Constants
const GH_API_URL = 'https://api.github.com';

const CLIENT_ID = '2487ad34400c78289657';
const CLIENT_SECRET = 'be5d2e74be4b876f61bfb9c68e700696b64ee3f8';

// Language Enum
const Language = Object.freeze({
  JAVA:   Symbol(1),
  JS:     Symbol(2),
  NET:    Symbol(3),
  PYTHON: Symbol(4),
  RUBY:   Symbol(5),
  TS:     Symbol(6)
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
  //let ghurl = new URL('https://github.com/yang573/dependency-tree');
  console.log(ghurl);

  verifyRepo(ghurl).then(
    function(result) {
      return buildTree(result, 0);
    }
  ).then(
    function(result) {
      console.log('buildTree');
      console.log(result);
      console.log(result.children[0]);
      res.send(JSON.stringify({
        status: SUCCESS,
        message: result
      }));
    }
  ).catch(
    function(error) {
      console.log('error');
      console.log(error);
      res.send(util.inspect({
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
function buildTree(repoInfo, depth) {
  return new Promise(function(resolve, reject) {
    console.log('buildTree');
    if (depth >= 2)
      resolve(EMPTY_NODE);

    let options = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'dependency-tree'
      }
    };

    packageUrl = repoInfo.contents_url.replace('{+path}', 'package.json');
    axios(packageUrl, options).then(
      function(result) {
        if (result.status != SUCCESS)
          reject(new Error(result.statusText));
        else {
          const rootValue = new GitHubRepo(repoInfo.name, repoInfo.html_url);
          const rootNode = new TreeNode(rootValue);
          loopDependencies(result.data.dependencies, depth).then(
            function(result) {
              for (let dependency in result) {
                const childValue = new GitHubRepo(result[dependency].name, result[dependency].html_url);
                const childNode = new TreeNode(childValue);
                rootNode.addNode(childNode);
              }
              resolve(rootNode);
            }
          ).catch(
            function(error) {
              console.log('loop error');
              reject(error);
            }
          );
        }
      }
    ).catch(
      function(error) {
        console.log(error);
        reject(new Error(error));
      }
    );
  });
}

function loopDependencies(dependencies, depth) {
  return new Promise(function(resolve, reject) {
    let dependencyArray = [];
    depth++;
    for (let dependency in dependencies) {
      console.log(dependency);
      if (!dependency.startsWith('@angular'))
        dependencyArray.push(getDependencies(dependency));
    }

    Promise.all(dependencyArray).then(
      function(results) {
        for (let result in results) {
          console.log('Promises.all success');
          //console.log(result);
        }
        resolve(results);
      }
    ).catch(
      function(error) {
        console.log('Promises.all error');
        //console.log(error);
        reject(error);
      }
    );
  });
}

// ghurl: a URL object
// returns a TreeNode containing a GitHubRepo object
// that represents the given dependency name
function getDependencies(dependencyName) {
  return new Promise(function(resolve, reject) {

    let options = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3',
        'User-Agent': 'dependency-tree'
      },
      params: {
        'q': dependencyName + ' language:JavaScript language:TypeScript',
        // 'page': 1,
        'per_page': 1
        // 'client_id': CLIENT_ID,
        // 'client_secret': CLIENT_SECRET
      }
    };

    let url = GH_API_URL + '/search/repositories';
    axios(url, options).then(
      function(result) {
        if (result.status != SUCCESS) {
          console.log('Error status internal findRepo');
          //console.log(result);
          reject(new Error(result.statusText));
        } else {
          console.log('Success internal findRepo');
          //console.log(result);
          const firstRepo = result.data.items[0];
          console.log(firstRepo);
          resolve(firstRepo);
        }
      }
    ).catch(
      function(error) {
        console.log('Error internal findRepo');
        //console.log(error);
        reject(error);
      }
    );
  });
}

// function getDependencies(ghurl) {
//   return new Promise(function(resolve, reject) {
//     let options = {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/vnd.github.v3.raw',
//         'User-Agent': 'dependency-tree'
//       }
//     };
//
//     //let repo = client.repo(ghurl.pathname.substring(1));
//     let repo = GH_API_URL + '/repo' + ghurl.pathname;
//     axios(repo, options).then(
//       function(result) {
//         repo += '/contents/package.json';
//       },
//       function(error) {
//         // TODO: Make this return an empty node;
//         return;
//       }
//     ).then(
//       function(result) {
//
//       },
//       function(error) {
//
//       }
//     );
//
//     repo.info(function(err, data, headers) {
//       if (err != null) {
//         reject(new Error('Error: Invalid GitHub url'));
//       } else {
//         repo = new GitHubRepo(repoData.name, repoData.html_url);
//         // DEBUG
//         console.log(data);
//         console.log(headers);
//         resolve(data);
//       }
//     });
//   });
// }

/** Mock Data **/
let mockData = {
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
