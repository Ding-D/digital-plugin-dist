import cloneDeep from 'lodash.clonedeep';
import TextDecoderPolyfill from './miniprogram-text-decoder.js';
import TextEncoderPolyfill from './miniprogram-text-encoder.js';
import cozeUtil from './coze';
const utils = {
    cozeUtil,
    TextEncoder(val) {
        return new TextEncoderPolyfill().encode(val);
    },
    TextDecoder(val) {
        return new TextDecoderPolyfill().decode(val);
    },
    deepClone(val) {
        return cloneDeep(val);
    },
    isEmpty: function (val) {
        if (utils.isNumber(val))
            return false;
        if (val === '' || val === undefined || val === null) {
            return true;
        }
        else {
            return false;
        }
    },
    isNumber(val) {
        return Number.isFinite(val);
    },
    URLSearchParams(init = '') {
        let params = new Map();
        // 初始化处理
        if (typeof init === 'string') {
            // 去掉开头的问号
            const searchString = init.startsWith('?') ? init.slice(1) : init;
            if (searchString) {
                searchString.split('&').forEach(pair => {
                    const [key, value = ''] = pair.split('=');
                    if (key) {
                        const decodedKey = decodeURIComponent(key);
                        const decodedValue = decodeURIComponent(value);
                        if (params.has(decodedKey)) {
                            // 如果键已存在，转换为数组或添加到数组
                            const existing = params.get(decodedKey);
                            if (Array.isArray(existing)) {
                                existing.push(decodedValue);
                            }
                            else {
                                params.set(decodedKey, [existing, decodedValue]);
                            }
                        }
                        else {
                            params.set(decodedKey, decodedValue);
                        }
                    }
                });
            }
        }
        else if (init && Array.isArray(init)) {
            // URLSearchParams或类似对象
            init.forEach((value, key) => {
                params.set(key, value);
            });
        }
        else if (init && typeof init === 'object') {
            // 处理对象或URLSearchParams实例
            if (init instanceof Map) {
                params = new Map(init);
            }
            else {
                // 普通对象
                Object.keys(init).forEach(key => {
                    const value = init[key];
                    if (Array.isArray(value)) {
                        params.set(key, value);
                    }
                    else {
                        params.set(key, String(value));
                    }
                });
            }
        }
        return {
            // 返回查询字符串
            toString() {
                const pairs = [];
                for (const [key, value] of params) {
                    if (Array.isArray(value)) {
                        value.forEach(val => {
                            pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
                        });
                    }
                    else {
                        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                    }
                }
                return pairs.join('&');
            }
        };
    }
};
export default utils;
