// Multer options
const multer = require('multer');
const { v4: uuid4 } = require('uuid');
const path = require('path');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const newPath = path.join(__dirname, '..', 'public', 'images');

    cb(null, newPath);
  },
  filename: (req, file, cb) => {
    const newName = `${uuid4()}-${file.originalname}`;

    cb(null, newName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports.multerFiles = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});
