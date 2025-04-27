/**
 * 读取文件内容
 * @param file 文件
 */
export function readAsText(file: File): Promise<string> {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onload = function () {
            const text = fileReader.result as string;
            resolve(text);
        }
        fileReader.onerror = function (e) {
            reject(e);
        }
        fileReader.readAsText(file);
    });
}

/**
 * 字符串转换为 Blob 对象
 * @param str 字符串
 */
export function stringToBlob(str: string): Blob {
    return new Blob([str], {type: 'text/plain'});
}


/**
 * Uint8Array数组转字符串
 * @param uint8Array Uint8Array数组
 */
export function uint8ArrayToString(uint8Array: Uint8Array): string {
    let dataString = "";
    for (let i = 0; i < uint8Array.length; i++) {
        dataString += String.fromCharCode(uint8Array[i]);
    }
    return dataString

}

export function svg2png(svg: SVGSVGElement): Promise<string> {
    // 创建一个Image对象，用于保存生成的图片
    // 创建一个Canvas元素
    const canvas = document.createElement('canvas');
    // 获取Canvas上下文对象
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return Promise.reject("创建canvas对象错误");
    }
    // 获取SVG的宽高
    const svgRect = svg.getBoundingClientRect();
    // 设置Canvas的宽高与SVG相同
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
    // 创建一个新的Image对象，用于绘制SVG
    const svgImage = new Image();
    // 将SVG转为Base64编码的data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;
    return new Promise<string>((resolve, reject) => {
        // 在Image对象中加载SVG
        svgImage.onload = () => {
            // 将SVG绘制到Canvas上
            ctx.drawImage(svgImage, 0, 0);
            // 将Canvas转为图片
            resolve(canvas.toDataURL('image/png'));
        };
        svgImage.onerror = e => reject(e);
        // 加载SVG
        svgImage.src = svgUrl;
    })
}


export function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function base64toBlob(base64: string, type = 'application/octet-stream'): Blob {
    const bStr = atob(base64);
    let n = bStr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bStr.charCodeAt(n);
    }
    return new Blob([u8arr], {type});
}

export function blobToBase64(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                resolve(reader.result as string);
            } else {
                reject("解析失败")
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
