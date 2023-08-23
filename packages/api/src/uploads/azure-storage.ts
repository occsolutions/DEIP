
import { FileService, FileUtilities } from 'azure-storage';

import * as fs from 'fs';

import Config from './config';

export default class AsureStore {
  private storage: FileService;
  private share: string = 'pulsefs';
  private imgDest: string;
  private filesDest: string;
  private videoDest: string;

  constructor(config: Config) {
    this.storage = new FileService(config.azureConnection);
    this.imgDest = config.imgDest;
    this.filesDest = config.filesDest;
    this.videoDest = config.videoDest;
    this.iniShare();
  }

  public sendFile(path: string, name?: string) {
    return this.uploadFile(this.filesDest, path, name);
  }

  public sendImg(path: string, name?: string) {
    return this.uploadFile(this.imgDest, path, name);
  }

  public sendVideo(path: string, name?: string) {
    return this.uploadFile(this.videoDest, path, name);
  }

  public getUrl(folder, file) {
    const date = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: FileUtilities.SharedAccessPermissions.READ,
        Start: date,
        Expiry: expiryDate,
      },
    };

    const sasToken = this.storage.generateSharedAccessSignature(this.share, folder, file, sharedAccessPolicy);
    return this.storage.getUrl(this.share, folder, file, sasToken, true);
  }

  public getImgUrl(file) {
    return this.getUrl(this.imgDest, file);
  }

  public getVideoUrl(file) {
    return this.getUrl(this.videoDest, file);
  }

  public getFile(folder: string, file: string) {
    return new Promise((resolve, reject) => {
      this.storage.getFileToStream(this.share, folder, file, fs.createWriteStream(file), (error, serverFile) => {
        if (!error) {
          return resolve(serverFile);
        }
        return reject(error);
      });
    });
  }

  public getVideoFile(file: string) {
    return this.getFile(this.videoDest, file);
  }

  public getFileToLocale(folder: string, file: string) {
    return new Promise((resolve, reject) => {
      this.storage.getFileToLocalFile(this.share, folder, file, file, (error, serverFile) => {
        if (!error) {
          return resolve(serverFile);
        }
        return reject(error);
      });
    });
  }

  public getVideoToLocale(file: string) {
    return this.getFileToLocale(this.videoDest, file);
  }

  public getImageToLocale(file: string) {
    return this.getFileToLocale(this.imgDest, file);
  }

  private iniShare() {
    this.storage.createShareIfNotExists(this.share, (error, result, response) => {
      if (!error) {
        this.iniFolders();
      } else {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    });
  }

  private iniFolders() {
    this.sentFolders(this.imgDest.split('/'));
    this.sentFolders(this.filesDest.split('/'));
    this.sentFolders(this.videoDest.split('/'));
  }

  private sentFolders(folders: string[], parent: string = '') {
    if (folders.length) {
      let folder = folders.shift();
      folder = parent ? `${parent}/${folder}` : folder;
      this.createFolder(folder, (result, response) => {
        if (folders.length) {
          this.sentFolders(folders, folder);
        }
      });
    }
  }

  private createFolder(folder, callback) {
    this.storage.createDirectoryIfNotExists(this.share, folder, (error, result, response) => {
      if (!error) {
        callback(result, response);
      } else {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    });
  }

  private uploadFile(folder: string, localPath: string, name?: string) {
    name = name || (localPath.split('/')).pop();
    return new Promise((resolve, reject) => {
      this.storage.createFileFromLocalFile(this.share, folder, name, localPath, (error, result, response) => {
        if (!error) {
          return resolve({ result, response });
        }
        return reject(error);
      });
    });
  }
}
