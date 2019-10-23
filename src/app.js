const { exec } = require('child_process');

// newline: it depends on operative system
let newline = '\n';


/**
 * Parse data from grep output
 *
 * @param {string} data - output string from grep command
 * @returns {Object} json with filename as key and description as array value 
 */

const getAns = data => {
  let ans = {};

  data.forEach(item => {
    let idx = item.indexOf(':');
    let filename = item.substring(0, idx);
    let desc = item.substring(idx + 1);
    if (ans.hasOwnProperty(filename))
      ans[filename].push(desc);
    else {
      ans[filename] = [desc];
    }
  });
  return ans;
};

/**
 * Search for text inside files under expecified folder
 *
 * @param {string} text - string to search
 * @param {string} folder - path of folder where text will be searched
 * @param {string} exclude_dir - string with path of excluded dirs comma separated  
 * @param {string} exclude - string with pattern of filenames to exclude (commam separated)
 * @return {Promise}  when resolve a Json with filenames as key and array of description as value is returned
*/

const search = (text, folder = "./", exclude_dir = "node_modules", exclude = "*.json") => {

  let command = `grep -Ri --exclude-dir="${exclude_dir}" --exclude="${exclude}" "${text}" ${folder}`;

  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject('err:', err);
      stdout = stdout.split(newline);
      stdout.pop();
      let ans = getAns(stdout);
      return resolve(ans);
    });
  });

};


module.exports = search;



// testing

search('babel', './')
  .then(data => console.log('ans:\n', data))
  .catch(err => console.log(err));


