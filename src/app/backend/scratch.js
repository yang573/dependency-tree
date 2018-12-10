// Packages
const http = require('http');
const https = require('https');
const url = require('URL');
const path = require('path');
const express = require('express');
//const readline = require('readline');
//const fs = require('fs');

//const x = require('./github-api');
//module.exports = app;

// Setup
const app = express();
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// Get GitHub API functions


// Status Codes
const SUCCESS = http.STATUS_CODES[200];
const BAD_REQUEST = http.STATUS_CODES[400];

const hostname = '127.0.0.1';
const port = 3000;

// Other Constants
const GH_API_URL = 'https://api.github.com';

// POST Parser Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Language Enum
const Language = Object.freeze({
  JAVA:   Symbol(1),
  JS:     Symbol(2),
  NET:    Symbol(3),
  PYTHON: Symbol(4),
  RUBY:   Symbol(5)
});

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

app.get('/traverse-repo', (res, req) => {
  console.log('In /traverse-repo block');
  console.log(req.body.url);
  let ghurl = new URL(req.body.url);
  //let ghurl = new URL(req.param('url'));
  let repoInfo = verifyRepo(ghurl).catch(
    function(error) {
      res.send(JSON.stringify({
        status: BAD_REQUEST,
        message: error
      }));
    }
  );

  let root = buildTree(repoInfo);
  res.send(JSON.stringify({
    status: SUCCESS,
    message: root
  }));
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

/** Data Access **/
/**
 * Verifies the url, and gets the repo information.
 * @param  {URL} The GitHub repo
 * @return {Error} or {JSON} of repo information
 */
function verifyRepo(ghurl) {
  return new Promise(function(resolve, reject) {
    if (ghurl.hostname != 'github.com')
      reject(new Error('Error: Not a GitHub url'));

    let repo = GH_API_URL + '/repo' + ghurl.pathname;
    let options = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'dependency-tree'
      }
    };

    // Check if repo exists
    fetch(repo, options).then(
      function(result) {
        if (!result.ok)
          reject(new Error(result.statusText));

        resolve(result.json());
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

    packageUrl = repoInfo.languages_url.replace('{+path}', 'package.json');
    fetch(packageUrl, options).then(
      function(result) {
        if (!result.ok)
          reject(new Error(result.statusText));
      },
      function(error) {
        reject(new Error(error));
      }
    );
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
    fetch(repo, options).then(
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

// fs.writeFile("data.json", JSON.stringify(data), (err) => {
//   if (err) {
//     console.log(err);
//   }
// });
// fs.writeFile("headers.json", JSON.stringify(headers), (err) => {
//   if (err) {
//     console.log(err);
//   }
// });

// Verify that link is correct
//let ghurl = new URL('https://github.com/yang573/dependency-tree');
let nodeRepo, root;
let repoData, isValid;
if (ghurl.hostname != 'github.com') {
  isValid = false;
} else {
  //let repo = client.repo(ghurl.pathname.substring(1));
  repo.info(function(err, data, headers) {
    if (err != null) {
      console.log(err);
      isValid = false;
    } else {
      repoData = data;
      repo = new GitHubRepo(repoData.name, repoData.html_url);
      isValid = true;

      // fs.writeFile("data.json", JSON.stringify(data), (err) => {
      //   if (err) {
      //     console.log(err);
      //   }
      // });
      // fs.writeFile("headers.json", JSON.stringify(headers), (err) => {
      //   if (err) {
      //     console.log(err);
      //   }
      // });

      // DEBUG
      console.log(data);
      console.log(headers);
    }

    console.log('Repo Test');
  });
}

// Construct a TreeNode and get children
if (!isValid) {
  // send error back to site
  console.log(`Error: ${ghurl} is not a valid GitHub repository URL.`);
} else {
  root = new TreeNode(nodeRepo);

  let options = {
  //protocol: 'https:',
  host: 'api.github.com',
  //port: 443,
  //path: repoData.languages_url,
  method: 'GET',
  headers: {
    'Accept': 'application/vnd.github.v3.raw',
    'User-Agent': 'dependency-tree'
    }
  };

  for (let i = 1; i < 5; i++) {
  }
  // send root back to site
}

// let languagesPath = '/repos'.concat(ghurl.pathname, '/languages');
//
//
// let req = https.request(options, (res) => {
//   console.log(`STATUS: ${res.statusCode}`);
//   console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//   res.setEncoding('utf8');
//   res.on('data', (chunk) => {
//     console.log(chunk);
//   });
//   res.on('end', () => {
//     console.log('Finished');
//   });
// });
//
// req.end();
//
// //let pathname = '/repos/yang573/dependency-tree/contents/package.json';
// let pathname = '/repos'.concat(ghurl.pathname, '/contents/package.json');
//
// options.pathname = pathname;
//
// req = https.request(options, (res) => {
//   console.log(`STATUS: ${res.statusCode}`);
//   console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//   res.setEncoding('utf8');
//   res.on('data', (chunk) => {
//     console.log(chunk);
//   });
//   res.on('end', () => {
//     console.log('Finished');
//   });
// });
//
// req.on('error', (e) => {
//   console.log(`Error: ${e.message}`);
// });
//
// req.end();
