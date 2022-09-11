const fs = require("fs");

// helper function to delete an existing file
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      // error occurred, so throw it again
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
