
import * as multer from 'multer';

import Config from './config';

const mimeTypeImgMap = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/gif': '.gif'
};

const mimeTypeSpreadsheetMap = {
  'text/csv': '.csv',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-excel.addin.macroenabled.12': '.xlam',
  'application/vnd.ms-excel.sheet.binary.macroenabled.12': '.xlsb',
  'application/vnd.ms-excel.template.macroenabled.12': '.xltm',
  'application/vnd.ms-excel.sheet.macroenabled.12': '.xlsm',
  'application/vnd.kde.kspread': '.ksp',
  'application/vnd.oasis.opendocument.spreadsheet': '.ods',
  'application/vnd.oasis.opendocument.spreadsheet-template': '.ots',
  'application/vnd.sun.xml.calc': '.sxc',
  'application/vnd.sun.xml.calc.template': '.stc',
  'application/vnd.stardivision.calc': '.sdc'
};

const mimeTypeVideosMap = {
  'video/x-flv' : '.flv',
  'video/mp4': '.mpg',
  'application/x-mpegURL': '.m3u8',
  'video/MP2T': '.ts',
  'video/3gpp': '.3gp',
  'video/quicktime': '.mov',
  'video/x-msvideo': '.avi',
  'video/x-ms-wmv': '.wmv'
};

export default function uploads(config: Config) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      // const path = mimeTypeImgMap[file.mimetype] ? config.imgDest : config.filesDest;
      const path = './';
      cb(undefined, path);
    },
    filename(req, file, cb) {
      const fileName = file.originalname.substr(0, file.originalname.lastIndexOf('.'));
      const name = fileName.toLowerCase().split(' ').join('-');
      // tslint:disable-next-line:max-line-length
      const ext = mimeTypeImgMap[file.mimetype] || mimeTypeSpreadsheetMap[file.mimetype] || mimeTypeVideosMap[file.mimetype];
      cb(undefined, `${name}-${Date.now()}${ext || ''}`);
    },
  });
  return multer({ storage, limits: { fileSize: 50000000 } });
}
