import { CozeFile, CozeMessage } from '../types';
declare const _default: {
    /**
     * 根据 Coze API v3 规范，构造 additional_messages 数组。
     *
     * @param {string} input - 用户的文本输入。
     * @param {Array<Object>} [fileList=[]] - 用户上传的文件列表。
     *   每个对象应符合 Coze object_string object 的部分格式，例如 { type: 'image', file_id: 'xxx' } 或 { type: 'file', file_url: 'yyy' }。
     * @returns {Array<Object>} - 准备好的 EnterMessage 对象数组，用于发送给 Coze API。
     */
    return_additional_messages(input: string, fileList?: CozeFile[]): CozeMessage[];
};
export default _default;
