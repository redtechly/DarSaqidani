"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _config = _interopRequireDefault(require("../config.js"));

var _utils = require("../utils.js");

var _cloudinary = require("cloudinary");

var _streamifier = _interopRequireDefault(require("streamifier"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var upload = (0, _multer["default"])();

var uploadRouter = _express["default"].Router();

uploadRouter.post('/dinary', _utils.isAuth, upload.single('file'), function _callee(req, res) {
  var streamUpload, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
          });

          streamUpload = function streamUpload(req) {
            return new Promise(function (resolve, reject) {
              var stream = _cloudinary.v2.uploader.upload_stream(function (error, result) {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              });

              _streamifier["default"].createReadStream(req.file.buffer).pipe(stream);
            });
          };

          _context.next = 4;
          return regeneratorRuntime.awrap(streamUpload(req));

        case 4:
          result = _context.sent;
          res.send(result);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
/** 
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});


const s3 = new aws.S3();
const storageS3 = multerS3({
  s3,
  bucket: 'resturantchatbot',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadS3 = multer({ storage: storageS3 });

uploadRouter.post('/s3',
    uploadS3.single('image'), (req, res) => {
    res.send(req.file.location);
});

*/

var _default = uploadRouter;
exports["default"] = _default;