const { unlink } = require('fs');

module.exports.deleteFile = filePath => {
  unlink(filePath, err => {
    console.log(`Deleted ${filePath}`);
  });
};
