const {readFile} = require('node:fs');
const {basename} = require('node:path');
const {URL} = require("node:url");
const https = require("node:https");
const http = require("node:http");
const axios = require("axios");
const crypto = require("crypto");

/**
 * 获取一个文件
 * @param options {options: {
 *     title?: string,
 *     defaultPath?: string,
 *     buttonLabel?: string,
 *     filters?: { name: string, extensions: string[] }[],
 *     properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>,
 *     message?: string,
 *     securityScopedBookmarks?: boolean
 *   }} 参数
 * @return {Promise<File>} 返回blob对象
 */
function openFile(options) {
  return new Promise((resolve, reject) => {
    const paths = utools.showOpenDialog(options);
    const path = paths[0];
    if (path) {
      readFile(path, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const blob = new Blob([data], {type: 'application/octet-stream'});
        resolve(new File([blob], basename(path)));
      })
    }
  })
}

/**
 * 从url下载一个文件
 * @param url 文件地址
 * @param path 保存的地址
 * @return {Promise<void>}
 */
function downloadFileFromUrl(url, path) {
  const file = fs.createWriteStream(path);
  const link = new URL(url);

  return new Promise((resolve, reject) => {
    file.on('finish', function () {
      file.close();
      resolve();
    }).on('error', e => {
      file.close();
      reject(e);
    });

    (link.protocol.startsWith("https") ? https : http).get(link, (response) => {
      response.pipe(file);
    }).on('error', (error) => {
      reject(error);
    }).end();
  })

}

/**
 * 下载一个文件
 * @param data {string | Blob | ArrayBuffer} 文件内容，可以使blob(file)或ArrayBuffer或者链接或者DATA URL
 * @param name {string} 文件名
 * @return {Promise<string>};
 */
async function downloadFile(data, name) {
  const target = utools.showSaveDialog({
    title: '请选择文件保存位置',
    buttonLabel: '保存',
    defaultPath: path.join(utools.getPath('downloads'), name),
    properties: ['createDirectory']
  });
  if (!target) {
    return Promise.reject(new Error("请选择文件保存位置"))
  }
  return new Promise(async (resolve, reject) => {
    if (data instanceof ArrayBuffer) {
      fs.writeFile(target, new Uint8Array(data), e => {
        if (e) {
          return reject(e)
        }
        resolve(target);
      });
    } else if (data instanceof Blob) {
      const ab = await data.arrayBuffer();
      fs.writeFile(target, new Uint8Array(ab), e => {
        if (e) {
          return reject(e)
        }
        resolve(target);
      });
    } else {
      // 如果是链接
      if (/^https?:\/\//.test(data)) {
        return downloadFileFromUrl(data, target)
          .then(() => resolve(target))
          .catch(reject);
      } else if (/^data:(.*?);base64,/.test(data)) {
        // 数据URL
        let byteCharacters = atob(
          data.replace(/^data:(.*?);base64,/, "")
        );
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        fs.writeFile(target, byteArray, e => {
          if (e) {
            return reject(e)
          }
          resolve(target);
        });
      } else {
        reject(new Error("文件内容未知"))
      }
    }
  })
}


function hash(s, algorithm) {
  return crypto.createHash(algorithm).update(s).digest('hex');
}

function md5(value) {
  return hash(value, 'md5');
}

function encodeBase64(value) {
  return Buffer.from(value).toString('base64');
}

window.preload = {
  openFile, downloadFileFromUrl, downloadFile,
  axios: axios.create({
    timeout: 15000,
    adapter: 'http'
  }),
  util: {
    crypto: {
      encodeBase64, md5, hash
    }
  }
}