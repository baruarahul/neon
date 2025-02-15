require('dotenv').config();
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const ApiError = require('./ApiError');

// const Validator = require('validatorjs');

const readFile2String = (srcFile) => {
  const fileData = fs.readFileSync(srcFile, { encoding: 'utf8', flag: 'r' });
  return fileData;
};

/**
 * Convert base64 to string
 *
 * @param {*} b64
 * @returns
 */
const fromB64 = (b64) => {
  const str = Buffer.from(b64, 'base64').toString('ascii');
  return str;
};

const classifyFileType = (mimetype) => {
  const typeMappings = {
    text: ['text/plain', 'text/css', 'text/csv'],
    image: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/svg+xml',
      'image/webp',
      'image/x-icon',
      'image/tiff',
    ],
    video: [
      'video/mp4',
      'video/mov',
      'video/avi',
      'video/ogg',
      'video/webm',
      'video/x-matroska',
      'video/mpeg',
      'video/quicktime',
    ],
    audio: ['audio/mpeg', 'audio/aac', 'audio/wav'],
    html: ['text/html'],
    iframe: [],
  };

  for (const [type, mimeList] of Object.entries(typeMappings)) {
    if (mimeList.includes(mimetype)) return type;
  }

  return 'text'; // Default to 'text' if unknown, you can change this.
};

const getMimeTypeFromExtension = (extension) => {
  const mimeTypes = {
    '.aac': 'audio/aac',
    '.bin': 'application/octet-stream',
    '.bmp': 'image/bmp',
    '.css': 'text/css',
    '.csv': 'text/csv',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.eot': 'application/vnd.ms-fontobject',
    '.gz': 'application/gzip',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.html': 'text/html',
    '.gif': 'image/gif',
    '.mp3': 'audio/mpeg',
    '.mpeg': 'video/mpeg',
    '.mp4': 'video/mp4',
    '.ogg': 'video/ogg',
    '.ogv': 'video/ogg',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
    '.mkv': 'video/x-matroska',
    '.otf': 'font/otf',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.rar': 'application/x-rar-compressed',
    '.rtf': 'application/rtf',
    '.svg': 'image/svg+xml',
    '.swf': 'application/x-shockwave-flash',
    '.tar': 'application/x-tar',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain',
    '.wav': 'audio/wav',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xml': 'application/xml',
    '.zip': 'application/zip',
    '.7z': 'application/x-7z-compressed',
  };

  return mimeTypes[extension] || 'application/octet-stream'; // default to binary stream if unknown
};

/**
 * Convert string to base64
 *
 * @param {*} str
 * @returns
 */
const toB64 = (str) => {
  const buff = Buffer.from(str);
  return buff.toString('base64');
};

const generateCharacter = (length = 5) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toUpperCase();
};

const createResponse = (data = [], message = 'Ok', httpCode = 200, count) => {
  if (data) {
    if (data.length === undefined) {
      data = [data];
    }
  } else {
    data = [];
  }
  count = count === undefined ? data.length : 0;
  return {
    httpCode,
    message,
    count,
    data,
  };
};

const createErrResponse = (aError, message = 'Error', httpCode = 400) => {
  if (!aError.length) aError = [aError];
  return {
    httpCode,
    message,
    errors: aError || [
      {
        type: 'uncaught_exception',
        message: 'Unable to process request due to error. Please contact administrator.',
      },
    ],
  };
};

const joiError2Msg = (joiErr) => {
  const errorList = [];
  joiErr.error.details.forEach((e) => {
    errorList.push({ type: 'VALIDATION_ERROR', message: e.message });
  });
  return errorList;
};

/**
 * Create an error object for throwing at caller
 */
class Exception {
  constructor(type, message, note) {
    this.type = type;
    this.message = message;
    this.note = note;
  }
}

const createValidationErr = (mongooseValidationErrors, message = 'Error', httpCode = 422) => {
  const errorList = [];
  Object.keys(mongooseValidationErrors).forEach((errItem) => {
    const msg = `${mongooseValidationErrors[errItem].message}`.replace('Path ', '');
    errorList.push({ type: 'VALIDATION_ERROR', message: msg });
  });

  return {
    httpCode,
    message,
    errors: errorList,
  };
};

const createErrorObj = (errorType, errorMsg) => [{ field: errorType, message: errorMsg }];

const groomRecord = (record, customGrooming, options = { removeId: false }) => {
  if (Array.isArray(record)) {
    record = record.map((item) => groomRecord(item, customGrooming, options));
    return record;
  }
  if (customGrooming) {
    customGrooming(record);
  }
  if (!options.removeId) record.id = record._id;
  delete record._id;
  delete record.__v;
  return record;
};

const addCreatedAt = (record) => {
  record.createdAt = record._id.getTimestamp();
};

const verifyToken = async (token) => {
  // console.log(token);
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      } else {
        resolve(decoded);
      }
    });
  });
};

/** decode JWT Token  */
const decodeJWTToken = (token) => {
  const tokenArr = token.split(' ');
  const { payload } = jwt.decode(tokenArr[1], { complete: true });
  // console.log(payload);
  return {
    userName: payload.payload.userName,
    userId: payload.payload.userId,
    roleId: payload.payload.roleId,
  };
};

/** Custom Validation */
const validator = (event, rules) => {
  const validation = new Validator(event, rules);
  if (validation.fails()) {
    const error = [];
    Object.keys(validation.errors.errors).map((val) => {
      error.push({
        type: 'validation_error',
        message: validation.errors.errors[val][0],
      });
    });
    return {
      isValid: false,
      errors: error,
    };
  }
  return {
    isValid: true,
    response: null,
  };
};

// Function to generate OTP
function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i += 1) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

const validateIpRegExp =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const validateMacRegExp = /^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$/;

const validateObjectIdRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

const validateEmailRegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
/** validation Of Ip address  */
function validateIPaddress(ipaddress) {
  // console.log(ipaddress);
  if (validateIpRegExp.test(ipaddress)) {
    return true;
  }

  return false;
}

/**
 * Standard response creator for REST API
 */
const StdResponse = {
  resp200: (respBody) => createResponse(respBody, 'OK', 200),
  resp201: (respBody) => createResponse(respBody, 'Record created', 201),
  resp404: (respBody) => createResponse(respBody, 'Record not found', 404),
  resp400: (errList) => {
    // TODO: add logic to notify administrator here
    return createErrResponse(errList, 'Processing Error');
  },
  resp500: (errList) => {
    return createErrResponse(errList, 'General Server Error');
  },
  resp401: (errList) => {
    return createErrResponse(errList, 'User is not authenticated');
  },
  resp403: (errList) => {
    return createErrResponse(errList, 'User is not authorized to access the resource');
  },
};

/**
 * Convert object to lean. Usefull for the mongoose returned objects
 */
const toLean = (obj) => {
  if (!obj) return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Generate and Compare Hashed Password
 */

const generateHashPassword = function (password) {
  const hashRound = Number(process.env.HASH_SALT) || 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, hashRound, function (err, hash) {
      err && reject(err);
      resolve(hash);
    });
  });
};

const compareHashPassword = function (password, hashString) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashString, function (err, result) {
      err && reject(err);
      resolve(result);
    });
  });
};

// ** Checks if the data type is an Array and if it is empty
const isValidArray = (val) => {
  return Array.isArray(val) && val.length > 0;
};

// ** Checks if the data type is a Number
const isValidNumber = (val) => {
  return typeof val === 'number' && !Number.isNaN(val);
};

// ** Checks if the data type is an Object (JSON)
const isValidObject = (val) => {
  return !Array.isArray(val) && typeof val === 'object' && !!val;
};

// ** Checks if the data type is a Boolean
const isValidBoolean = (val) => {
  return typeof val === 'boolean';
};

// ** Checks if the data type is a string and if it is empty
const isValidString = (val) => {
  return typeof val === 'string' && val.length > 0;
};

const modifyToKebabCase = (val) => {
  /* eslint-disable */
  return isValidString(val)
    ? val
        .split(' ')
        .map((v) => v.toLowerCase())
        .join('-')
    : '';
  /* eslint-enable */
};

const getWeekNumber = (d) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
};

const formatCategoryByGroup = (groupBy, date) => {
  switch (groupBy) {
    case 'day':
      return new Date(date).toISOString().split('T')[0];
    case 'week':
      return `Week ${getWeekNumber(new Date(date))}`;
    case 'month':
      return new Date(date).toLocaleString('default', { month: 'short' });
    case 'hour':
    default:
      return new Date(date).getHours() + ':00';
  }
};

const postProcessDate = (dateString, groupBy) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  if (groupBy === 'day') {
    return dateString.split(' ')[0]; // Only the YYYY-MM-DD part
  }

  if (groupBy === 'week') {
    const [year, week] = dateString.split('-');
    const startDateOfWeek = new Date(year);
    startDateOfWeek.setDate(1 + (week - 1) * 7); // Assuming week starts on Sunday
    return `${startDateOfWeek.getDate()}. WK-${week}`;
  }

  if (groupBy === 'month') {
    const [year, month] = dateString.split('-');
    const monthName = months[parseInt(month, 10) - 1]; // Convert "08" to 8, then get the 8th month name
    return `${year.slice(2)}' ${monthName}`;
  }

  if (groupBy === 'hour') {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month] = datePart.split(':');
    return `${day}/${month} ${timePart}`;
  }

  return dateString;
};

const transformEventDataForApexCharts = (aggregatedData, groupBy) => {
  const infoLogData = [];
  const alertLogData = [];
  const categories = [];

  aggregatedData.forEach((data) => {
    const formattedDate = postProcessDate(data._id.date, groupBy);
    categories.push(formattedDate);
    infoLogData.push(data.infoLogsCount);
    alertLogData.push(data.alertLogsCount);
  });

  return {
    series: [
      {
        name: 'Logs Generated',
        data: infoLogData,
      },
      {
        name: 'Alert Logs',
        data: alertLogData,
      },
    ],
    xaxis: {
      categories: categories,
      title: {
        text: groupBy.charAt(0).toUpperCase() + groupBy.slice(1),
      },
    },
  };
};

const transformAlertDataForApexCharts = (aggregatedData, groupBy) => {
  const categories = [];
  const dataByStatusAndDate = {};

  aggregatedData.forEach((data) => {
    const formattedDate = postProcessDate(data._id.date, groupBy);
    const status = data._id.status;

    if (!dataByStatusAndDate[status]) {
      dataByStatusAndDate[status] = {};
    }

    dataByStatusAndDate[status][formattedDate] = data.count;

    if (categories.indexOf(formattedDate) === -1) {
      categories.push(formattedDate);
    }
  });

  const series = Object.keys(dataByStatusAndDate).map((status) => {
    const dataForStatus = categories.map((date) => dataByStatusAndDate[status][date] || 0);
    return {
      name: status,
      data: dataForStatus,
    };
  });

  return {
    series: series,
    xaxis: {
      categories: categories,
      title: {
        text: groupBy.charAt(0).toUpperCase() + groupBy.slice(1),
      },
    },
  };
};

const transformLayer = (layer, index) => {
  const commonFields = {
    layerId: layer._id,
    name: layer.name,
    type: layer.type,
    icon: layer.icon,
    x: layer.x,
    y: layer.y,
    w: layer.w,
    h: layer.h,
    i: layer.i,
    moved: layer.moved,
    static: layer.static,
    resizeHandles: layer.resizeHandles,
    transition: layer.transition,
    transitionDuration: layer.transitionDuration,
    fit: layer.fit,
    zIndex: index,
  };

  switch (layer.type) {
    case 'video':
    case 'image':
      return {
        ...commonFields,
        mimetype: layer.mimetype,
        ext: layer.ext,
        tags: layer.tags,
        color: layer.color,
        status: layer.status,
        createdBy: layer.createdBy,
        defaultDuration: layer.defaultDuration,
        thumbnailUrl: layer.thumbnailUrl,
        isShared: layer.isShared,
        isProtected: layer.isProtected,
        fileKey: layer.fileKey,
        fileKeySignedURL: layer.fileKeySignedURL,
        fileKeySignedURLExpiry: layer.fileKeySignedURLExpiry,
      };
    case 'text':
      return {
        ...commonFields,
        content: layer.content,
        fontSize: layer.fontSize,
        contentAlign: layer.contentAlign,
        fontFamily: layer.fontFamily,
        fontWeight: layer.fontWeight,
        fontColor: layer.fontColor,
        lineHeight: layer.lineHeight,
        letterSpacing: layer.letterSpacing,
        backgroundColor: layer.backgroundColor,
      };
    case 'url':
      return {
        ...commonFields,
        url: layer.url,
      };
    default:
      return commonFields;
  }
};

const transformLayout = (layout, contentArray) => {
  const contentRec = contentArray.filter((x) => {
    return x.layoutId.toString() === layout._id.toString();
  });
  let slotRules = null;
  let caDuration = 5;
  if (contentRec.length > 0) {
    slotRules = contentRec[0].rules;
    caDuration = contentRec[0].duration;
  }

  return {
    layoutId: layout._id,
    name: layout.name,
    desc: layout.desc,
    aspectRatio: layout.aspectRatio,
    backgroundColor: layout.backgroundColor,
    backgroundTransparency: layout.backgroundTransparency,
    tags: layout.tags,
    excludedTags: layout.excludedTags,
    isIncludeStatic: layout.isIncludeStatic,
    type: layout.type,
    sequence: layout.sequence,
    duration: caDuration,
    coolDown: layout.coolDown,
    layers: layout.layers.map((layer, index) => transformLayer(layer, index)),
    rules: slotRules,
    status: layout.status,
    screenShotStatus: layout.screenShotStatus,
    acknowledgedBy: layout.acknowledgedBy,
    createdBy: layout.createdBy,
    businessRef: layout.businessRef,
    workspaceRef: layout.workspaceRef,
    fileKey: layout.fileKey,
    timestamps: {
      createdAt: layout.createdAt,
      updatedAt: layout.updatedAt,
    },
  };
};

const transformSchedule = (schedule) => {
  if (!schedule) {
    return null;
  }

  return {
    title: schedule.title,
    desc: schedule.desc,
    priority: schedule.priority,
    rrule: schedule.rrule,
    allDay: schedule.allDay,
    start: schedule.start,
    end: schedule.end,
    businessRef: schedule.businessRef,
    type: schedule.type,
    workspaceRef: schedule.workspaceRef,
    playlist: schedule.playlist,
  };
};

module.exports = {
  isValidString,
  isValidBoolean,
  isValidArray,
  isValidNumber,
  isValidObject,
  modifyToKebabCase,
  fromB64,
  toB64,
  readFile2String,
  generateCharacter,
  createResponse,
  createErrResponse,
  createValidationErr,
  createErrorObj,
  groomRecord,
  verifyToken,
  decodeJWTToken,
  addCreatedAt,
  validator,
  generateOTP,
  validateIPaddress,
  toLean,
  joiError2Msg,
  postProcessDate,
  transformEventDataForApexCharts,
  transformAlertDataForApexCharts,
  Exception,
  generateHashPassword,
  compareHashPassword,
  getMimeTypeFromExtension,
  classifyFileType,
  transformLayout,
  transformSchedule,
};
