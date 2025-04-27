import MessageUtil from "@/utils/modal/MessageUtil";

/**
 * 拷贝
 * @param content 内容
 * @param showMessage 显示消息，默认显示
 */
export function copy(content: string, showMessage: boolean = true) {
    // content为要复制的内容
    // 创建元素用于复制
    const ele = document.createElement('textarea');
    // 设置元素内容
    ele.value = content;
    // 将元素插入页面进行调用
    document.body.appendChild(ele);
    // 复制内容
    ele.select();
    // 将内容复制到剪贴板
    document.execCommand('copy');
    // 删除创建元素
    document.body.removeChild(ele);
    if (showMessage) {
        MessageUtil.success('已成功复制到剪切板');
    }
}

/**
 * 下载
 * @param data 内容
 * @param fileName 文件名
 * @param mineType 文件类型
 */
export function download(data: string | ArrayBuffer | Blob, fileName: string, mineType: string) {
    // 创建 blob
    let blob = data instanceof Blob ? data : new Blob([data], {type: mineType});
    // 创建 href 超链接，点击进行下载
    window.URL = window.URL || window.webkitURL;
    let href = URL.createObjectURL(blob);
    let downA = document.createElement("a");
    downA.href = href;
    downA.download = fileName;
    downA.click();
    // 销毁超连接
    window.URL.revokeObjectURL(href);
}

export function downloadByUrl(url: string, fileName?: string) {
    let downA = document.createElement("a");
    downA.href = url;
    let index = url.lastIndexOf("/");
    if (fileName) {
        downA.download = fileName;
    } else {
        downA.download = url.substring(index + 1, url.length);
    }
    downA.click();
}


export function downloadByBase64(base64: string, fileName?: string) {
    let byteCharacters = btoa(
        base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], {
        type: undefined,
    });
    let aLink = document.createElement("a");
    aLink.download = fileName || "图片名称.png"; //这里写保存时的图片名称
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}

export function generateUUID(): string {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function sleep(timestamp: number) {
    return new Promise<void>(resolve => setTimeout(resolve, timestamp));
}

const colors = [
    'red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue',
    'arcoblue', 'purple', 'pinkpurple', 'magenta', 'gray'];

export function randomColor(str?: string): string {
    let index = Math.floor(Math.random() * colors.length);
    if (str) {
        if (str.length <= colors.length - 1) {
            index = str.length;
        } else {
            index = str.length % colors.length;
        }
    }
    return colors[index]
}

/**
 * 生成随机字符串
 * @param len 字符串长度
 * @return 字符串
 */
export function getRandomChar(len: number): string {
    const x = "0123456789qwertyuioplkjhgfdsazxcvbnm"; // 需要什么字符这里添加
    let tmp = "";
    const timestamp = new Date().getTime();
    for (let i = 0; i < len; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return timestamp + tmp;
}

export const getImageSize = (src: string): Promise<{ width: number, height: number }> => {
    return new Promise(resolve => {
        let img = new Image()
        img.src = src
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height
            })
        }
        img.onerror = () => {
            resolve({
                width: 100,
                height: 100
            })
        }
    })
}
