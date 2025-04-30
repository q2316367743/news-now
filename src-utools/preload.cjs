const {openFile, downloadFileFromUrl, downloadFile} = require('./src/common');
const {hash, md5, encodeBase64, transferToUtf8} = require('./src/format');
const axios = require("axios");


window.preload = {
  openFile, downloadFileFromUrl, downloadFile,
  axios: axios.create({
    timeout: 15000,
    adapter: 'http'
  }),
  util: {
    crypto: {
      encodeBase64, md5, hash
    },
    iconv: {
      transferToUtf8
    }
  }
}

window.utools = {
  dbStorage: focusany.dbStorage,
  isDarkColors: focusany.isDarkColors,
  shellOpenExternal: focusany.shellOpenExternal,
  db: {
    put: focusany.db.put,
    get: focusany.db.get,
    remove: focusany.db.remove,
    bulkDocs: focusany.db.bulkDocs,
    allDocs: focusany.db.allDocs,
    postAttachment: focusany.db.postAttachment,
    getAttachment: focusany.db.getAttachment,
    getAttachmentType: focusany.db.getAttachmentType,
    promises: {
      put: (doc) => {
        return Promise.resolve(focusany.db.put(doc))
      },
      get: (id) => {
        return Promise.resolve(focusany.db.get(id));
      },
      remove: (doc) => {
        return Promise.resolve(focusany.db.remove(doc));
      },
      bulkDocs: (docs) => {
        return Promise.resolve(focusany.db.bulkDocs(docs));
      },
      allDocs: (key) => {
        return Promise.resolve(focusany.db.allDocs(key));
      },
      postAttachment: (docId, attachment, type) => {
        return Promise.resolve(focusany.db.postAttachment(docId, attachment, type));
      },
      getAttachment: (docId) => {
        return Promise.resolve(focusany.db.getAttachment(docId));
      },
      getAttachmentType: (docId) => {
        return Promise.resolve(focusany.db.getAttachmentType(docId));
      }
    }
  },
  ubrowser: {
    goto: (url, header) => {
      return {
        run: (prop) => {
          const ubWindow = focusany.createBrowserWindow(
            url, {
              useContentSize: true,
              width: 800,
              height: 600,
              ...prop,
              hasShadow: false,
              backgroundColor: '#00000000',
              webPreferences: {
                zoomFactor: 0,
              },
            }, () => {
              try {
                ubWindow.show();
              } catch (e) {
                focusany.showNotification(`打开小窗失败，${e instanceof Error ? e.message : e}`);
              }
            })
        }
      }
    }
  }
}