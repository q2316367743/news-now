/// <reference types="vite/client" />

interface RouteMeta {
  hidden?: boolean;
  icon: JSX.Element;
}

interface OpenFileOption {
  title?: string,
  defaultPath?: string,
  buttonLabel?: string,
  filters?: { name: string, extensions: string[] }[],
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>,
  message?: string,
  securityScopedBookmarks?: boolean
}

type HashAlgorithm =
  | 'md5'
  | 'sha1'
  | 'sha224'
  | 'sha256'
  | 'sha384'
  | 'sha512'
  | 'ripemd160'
  | 'sm3'
  | 'sha3-224'
  | 'sha3-256'
  | 'sha3-384'
  | 'sha3-512'
  | 'blake2b'
  | 'blake2s';

interface Window {
  preload: {
    /**
     * 打开一个文件，并返回File对象
     * @param options 参数
     * @return 返回File对象
     */
    openFile(options: OpenFileOption): Promise<File>,
    /**
     * 从url下载一个文件到指定目录
     * @param url 链接
     * @param path 要保存的文件路径，包含文件名
     */
    downloadFileFromUrl(url: string, path: string): Promise<void>,
    /**
     * 下载一个文件
     * @param data 文件内容，可以使blob(file)或ArrayBuffer或者链接或者DATA URL
     * @param name 文件名
     * @return 文件保存的路径
     */
    downloadFile(data: string | Blob | ArrayBuffer, name: string): Promise<string>,
    // axios
    axios: any;
    util: {
      crypto: {
        encodeBase64: (value: string) => string,
        md5: (value: string) => string,
        hash(s: string, algorithm: HashAlgorithm): string
      }
    }
  }
}