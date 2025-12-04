export default {
    /**
     * 根据 Coze API v3 规范，构造 additional_messages 数组。
     *
     * @param {string} input - 用户的文本输入。
     * @param {Array<Object>} [fileList=[]] - 用户上传的文件列表。
     *   每个对象应符合 Coze object_string object 的部分格式，例如 { type: 'image', file_id: 'xxx' } 或 { type: 'file', file_url: 'yyy' }。
     * @returns {Array<Object>} - 准备好的 EnterMessage 对象数组，用于发送给 Coze API。
     */
    return_additional_messages(input, fileList = []) {
        const messages = [];
        // 如果没有输入，则返回空数组
        if (!input && (!fileList || fileList.length === 0)) {
            return [];
        }
        // 处理多模态消息：包含文本和文件
        if (fileList && fileList.length > 0) {
            const objectString = [];
            // 添加文本部分
            if (input) {
                objectString.push({
                    type: 'text',
                    text: input
                });
            }
            // 添加文件部分
            fileList.forEach(file => {
                // 假设 fileList 中的每个对象都已经是符合规范的 object_string object
                objectString.push(file);
            });
            // 根据文档，如果 object_string 中有文本，则必须有文件，反之亦然（有一定限制）
            // 这里我们假设调用者保证了数据的有效性
            messages.push({
                role: 'user',
                content: JSON.stringify(objectString),
                content_type: 'object_string',
                type: 'question'
            });
        }
        else if (input) {
            // 处理纯文本消息
            messages.push({
                role: 'user',
                content: input,
                content_type: 'text',
                type: 'question'
            });
        }
        return messages;
    }
};
