/// <reference types="vite/client" />
import { AxiosInstance } from "axios";

interface RouteMeta {
  hidden?: boolean;
  icon: JSX.Element;
}

type HashAlgorithm =
  | "md5"
  | "sha1"
  | "sha224"
  | "sha256"
  | "sha384"
  | "sha512"
  | "ripemd160"
  | "sm3"
  | "sha3-224"
  | "sha3-256"
  | "sha3-384"
  | "sha3-512"
  | "blake2b"
  | "blake2s";

declare global {
  interface Window {
    preload: {
      // axios
      axios: AxiosInstance;
      util: {
        crypto: {
          encodeBase64: (value: string) => string;
          md5: (value: string) => string;
          hash(s: string, algorithm: HashAlgorithm): string;
        };
        iconv: {
          parseBuffer(buffer: Buffer, charset: string): string;
          parseArrayBuffer(arrayBuffer: ArrayBuffer, charset: string): string;
          convertCharset(
            content: string,
            source: string,
            target?: string,
          ): string;
          transferToUtf8(s: string | ArrayBuffer, charset: string): string;
        };
      };
    };
  }
}
