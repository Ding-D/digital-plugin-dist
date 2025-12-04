import util from '../utils';
class CozeClient {
    constructor(options) {
        this.platform = 'MP'; // Wen MP
        this.request = {
            postConsume: undefined,
            getToken: undefined
        };
        this.requestHandleMap = {
            postConsume: (p) => (this.request.postConsume = p || CozeClient.empty_promise),
            getToken: (p) => (this.request.getToken = p || CozeClient.empty_promise)
        };
        this.requestClient = null;
        this.appid = '';
        this.secret_key = '';
        this.urlType = 'bot.chat';
        this.urlConfig = {
            token: '',
            bot: {
                chat: 'https://api.coze.cn/v3/chat',
                conversation: {
                    create: 'https://api.coze.cn/v1/conversation/create'
                }
            },
            workflow: {
                run: 'https://api.coze.cn/v1/workflow/run',
                stream_run: 'https://api.coze.cn/v1/workflow/stream_run'
            }
        };
        this.urlConfigHandleMap = {
            token: (url) => (this.urlConfig.token = url),
            bot: {
                chat: (url) => (this.urlConfig.bot.chat = url),
                conversation: {
                    create: (url) => (this.urlConfig.bot.conversation.create = url)
                }
            },
            workflow: {
                run: (url) => (this.urlConfig.workflow.run = url),
                stream_run: (url) => (this.urlConfig.workflow.stream_run = url)
            }
        };
        this.streamUrlTypeMap = {
            'bot.chat': true,
            'workflow.stream_run': true
        };
        // token = 'd455c2261c83ac6c60bbb47b09814a4c';
        this.token = '';
        this.conversation_id = ''; // 对话 ID
        this.tokenLoading = false;
        this.is_consume = true; // 是否消耗积分
        this.consume_id = 9;
        this.consume_loading = false; // 等待消耗积分响应
        this.streamBuffer = ''; // 用于缓冲不完整的SSE消息
        this.init(options);
    }
    // !================================  参数注册区 =================================!
    init(options) {
        const { token, // Coze Token
        urlType = 'bot.chat', // API 类型
        platform = 'MP', // 平台
        request, // 请求
        urlConfig = {}, // API 地址
        requestClient, appid, secret_key } = options || {};
        if (!appid || !secret_key) {
            throw new Error('appid 或 secret_key 不能为空');
        }
        if (appid)
            this.appid = appid;
        if (secret_key)
            this.secret_key = secret_key;
        if (urlConfig)
            this.init_url_config(urlConfig);
        if (urlType)
            this.init_url_type(urlType);
        if (platform)
            this.platform = platform;
        if (token)
            this.token = token;
        if (request)
            this.init_request(request);
        if (requestClient)
            this.requestClient = requestClient;
        this.init_consume(options || {});
    }
    // 更新三方接口请求
    init_request(request) {
        if (!request)
            return;
        const recursion = (data, handle) => {
            if (!data)
                return;
            if (typeof data === 'object') {
                for (const k in data) {
                    recursion(data[k], handle[k]);
                }
            }
            if (typeof data === 'function') {
                handle(data);
            }
        };
        recursion(request, this.requestHandleMap);
    }
    // 更新扣子接口地址配置
    init_url_config(urlConfig) {
        if (!urlConfig)
            return;
        const recursion = (data, handle) => {
            if (!data)
                return;
            if (typeof data === 'object') {
                for (const k in data) {
                    recursion(data[k], handle[k]);
                }
            }
            if (typeof data === 'string') {
                handle(data);
            }
        };
        recursion(urlConfig, this.urlConfigHandleMap);
    }
    // 更新接口类型
    init_url_type(urlType) {
        if (urlType)
            this.urlType = urlType;
    }
    init_consume(options) {
        const { consume_id, is_consume } = options;
        if (consume_id !== undefined &&
            !util.isEmpty(consume_id) &&
            util.isNumber(consume_id)) {
            this.consume_id = consume_id;
        }
        else {
            this.consume_id = 9;
        }
        if (!util.isEmpty(is_consume)) {
            this.is_consume = !!is_consume;
            // 如果不需要消耗积分，则将消耗积分数量设置为0
            if (!this.is_consume)
                this.consume_id = -1;
        }
        else {
            this.is_consume = true;
        }
    }
    init_client_options(options) {
        if (options.urlType)
            this.init_url_type(options.urlType);
        this.init_consume({
            consume_id: util.isEmpty(options.consume_id) ? 9 : options.consume_id,
            is_consume: util.isEmpty(options.is_consume) ? true : options.is_consume
        });
    }
    // 更新请求地址
    get_url() {
        const urlRoutes = this.urlType.split('.');
        let url = util.deepClone(this.urlConfig); // deep clone
        for (let i = 0; i < urlRoutes.length; i++) {
            if (!url[urlRoutes[i]]) {
                throw new Error(`CozeClient constructor Error: API type ${urlRoutes[i]} is not supported.`);
            }
            url = url[urlRoutes[i]];
        }
        return url;
    }
    // !================================  主功能区 =================================!
    // ? 发送消息  ==================================
    sendMessage(options) {
        if (!this.token) {
            throw new Error('CozeClient sendMessage Error: Not have token , pleace request the token.');
        }
        const { 
        // body, // 非必需
        params, // 非必需
        callback = () => { }, // 必需
        clientOptions = {} // 非必需
         } = options || {};
        this.init_client_options(clientOptions);
        let url = this.get_url();
        if (params) {
            // 如果params存在，则将其添加到url中
            const urlParams = util.URLSearchParams(params);
            url += `?${urlParams.toString()}`;
        }
        try {
            return this.startRequest(url, options);
        }
        catch (error) {
            console.error('🚀 ~ CozeClient ~ sendMessage ~ error:', error);
            const errorInfo = this.get_errorinfo(error);
            callback({
                type: 'error',
                content: '',
                error: errorInfo,
                isFinished: true
            });
            return null;
        }
    }
    // ? 请求接口  ==================================
    // 根据接口类型，选择接口调用
    startRequest(url, options) {
        // @ts-ignore
        const requestTask = this['request' + 'By' + this.platform](Object.assign({
            url
        }, options));
        return requestTask;
    }
    // H5使用fetch进行请求处理
    async requestByWeb(options) {
        const { url, body, header, callback = () => { } } = options || {};
        const chcek_is_stream_url = this.chcek_is_stream_url(); // 判断是否实流式回复
        if (chcek_is_stream_url) {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                    ...(header || {})
                },
                body: JSON.stringify(this.handle_request_body(body))
            });
            if (!response.ok) {
                throw new Error(`CozeClient requestByWeb Error: ${response.statusText}`);
            }
            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            // uni.hideLoading();
            const handleResponse = this.handleWebResponse();
            if (handleResponse) {
                // @ts-ignore
                handleResponse.call(this, reader, decoder, callback);
            }
            else {
                throw new Error('CozeApiClient sendMessage Error: No handleResponse function found for the API type.');
            }
            return response;
        }
        else {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(this.handle_request_body(body))
            });
            if (!response.ok) {
                throw new Error(`CozeClient requestByWeb Error: ${response.statusText}`);
            }
            const handleResponse = this.handleWebResponse();
            if (handleResponse) {
                // @ts-ignore
                handleResponse.call(this, response, callback);
            }
            else {
                throw new Error('CozeApiClient sendMessage Error: No handleResponse function found for the API type.');
            }
            return response;
        }
    }
    // 小程序使用Request进行请求处理
    requestByMP(options) {
        const { url, body, callback = () => { } } = options || {};
        const chcek_is_stream_url = this.chcek_is_stream_url(); // 判断是否实流式回复
        if (chcek_is_stream_url) {
            const requestTask = uni.request({
                url: url,
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                data: JSON.stringify(this.handle_request_body(body)),
                enableChunked: true, // 开启分块传输
                success: (res) => {
                    if (res.statusCode !== 200 || res.data.code !== 0) {
                        callback({
                            type: 'error',
                            content: '回答失败，请稍后再试',
                            error: new Error(`Request failed with status ${res.statusCode}`),
                            isFinished: true
                        });
                    }
                    else {
                        const handleConsumeEnd = (consume_num) => {
                            callback({
                                type: 'consume_end',
                                consume_num,
                                isFinished: true
                            });
                        };
                        this.consumeIntegral(handleConsumeEnd);
                    }
                },
                fail: (err) => {
                    console.error('🚀 ~ handleRequestByWeixin ~ fail:', err);
                    callback({
                        type: 'error',
                        error: err,
                        isFinished: true
                    });
                }
            });
            // 监听数据块接收事件
            requestTask.onChunkReceived((res) => {
                try {
                    // 将ArrayBuffer转换为字符串
                    const decode = util.TextDecoder(new Uint8Array(res.data));
                    if (!decode)
                        return;
                    const handleResponse = this.handleMPResponse();
                    if (handleResponse) {
                        // @ts-ignore
                        handleResponse.call(this, decode, callback);
                    }
                    else {
                        throw new Error('CozeClient sendMessage Error: No handleResponse function found for the API type.');
                    }
                }
                catch (error) {
                    console.error('🚀 ~ onChunkReceived ~ error:', error);
                    console.error('🚀 ~ onChunkReceived ~ error:', res);
                    requestTask.abort(); // 终止请求
                    callback({
                        content: '回复失败，请稍后再试',
                        type: 'error',
                        error: error,
                        isFinished: true
                    });
                }
            });
            // 监听请求完成事件
            requestTask.onHeadersReceived((res) => { });
            return requestTask;
        }
        else {
            uni.request({
                url: url,
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                data: JSON.stringify(body),
                success: (res) => {
                    if (res.statusCode !== 200) {
                        callback({
                            type: 'error',
                            error: new Error(`Request failed with status ${res.statusCode}`),
                            isFinished: true
                        });
                    }
                    else {
                        const is_success = this.check_workflow_is_success(res);
                        if (is_success) {
                            const handleConsumeEnd = (consume_num) => {
                                const n_callback = (data) => {
                                    callback({
                                        type: 'consume_end',
                                        data,
                                        consume_num,
                                        isFinished: true
                                    });
                                };
                                // @ts-ignore
                                this.handleMPResponse()?.call(this, res, n_callback);
                            };
                            this.consumeIntegral(handleConsumeEnd);
                        }
                        else {
                            const n_callback = (data) => {
                                callback({
                                    type: 'consume_end',
                                    data,
                                    consume_num: 0,
                                    isFinished: true
                                });
                            };
                            // @ts-ignore
                            this.handleMPResponse()?.call(this, res, n_callback);
                        }
                    }
                },
                fail: (err) => {
                    console.error('🚀 ~ handleRequestByWeixin ~ fail:', err);
                    callback({
                        type: 'error',
                        error: err,
                        isFinished: true
                    });
                }
            });
            return null;
        }
    }
    // ? 接口响应处理  ==================================
    // 获取web端对应的响应处理函数
    handleWebResponse() {
        if (this.platform == 'Web') {
            switch (this.urlType) {
                case 'bot.chat':
                    return this.handleWebBotResponse;
                case 'workflow.run':
                    return this.handleWorkflowRunResponse;
                case 'workflow.stream_run':
                    return this.handleWebWorkflowRunStream;
                default:
                    return null;
            }
        }
        return null;
    }
    // 获取小程序端对应的响应处理函数
    handleMPResponse() {
        if (this.platform == 'MP') {
            switch (this.urlType) {
                case 'bot.chat':
                    return this.handleMPBotResponse;
                case 'workflow.run':
                    return this.handleWorkflowRunResponse;
                case 'workflow.stream_run':
                    return this.handleMPWorkflowRunStreamResponse;
                default:
                    return null;
            }
        }
        return null;
    }
    // ? web端 接口响应处理  ==============
    // web  bot回复处理
    async handleWebBotResponse(reader, decoder, callback) {
        let state = CozeClient.get_stream_state();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                // 处理剩余缓冲区中的数据
                if (this.streamBuffer.trim()) {
                    const parts = this.split_decode(this.streamBuffer);
                    this.botWebCallback(state, parts, callback);
                }
                this.streamBuffer = ''; // 清空缓冲区
                state.isStreamFinished = true;
                callback &&
                    callback({
                        ...state,
                        isFinished: true
                    });
                break;
            }
            const decode = decoder.decode(value, { stream: true });
            if (!decode)
                continue;
            // 将解码的数据添加到缓冲区
            this.streamBuffer += decode;
            // 检查缓冲区中是否有完整的SSE消息（以 \n\n 分隔）
            const messages = this.streamBuffer.split('\n\n');
            // 如果最后一个元素不为空，说明消息不完整，继续累积
            if (messages[messages.length - 1] !== '') {
                continue;
            }
            // 处理完整的消息（除了最后一个空元素）
            for (let i = 0; i < messages.length - 1; i++) {
                const message = messages[i];
                if (message.trim()) {
                    const parts = this.split_decode(message);
                    this.botWebCallback(state, parts, callback);
                }
            }
            // 将剩余的不完整消息保留在缓冲区
            this.streamBuffer = messages[messages.length - 1];
        }
    }
    // web  工作流流式回复处理
    async handleWebWorkflowRunStream(reader, decoder, callback) {
        let state = CozeClient.get_stream_state();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                state.isStreamFinished = true;
                break;
            }
            const decode = decoder.decode(value, { stream: true });
            if (!decode)
                continue;
            this.workflowStreamCallback(state, decode, callback);
        }
    }
    // ? 小程序端 接口响应处理  ==============
    // 小程序智能体回复处理
    async handleMPBotResponse(decode, callback) {
        let state = CozeClient.get_stream_state();
        try {
            this.botMPCallback(state, decode, callback);
        }
        catch (error) {
            console.error('Bot 处理错误:', error);
            callback({
                type: 'error',
                error: {
                    // @ts-ignore
                    message: error?.message || '',
                    code: 'STREAM_PROCESS_ERROR'
                },
                isFinished: false
            });
        }
    }
    // 小程序工作流流式回复处理
    async handleMPWorkflowRunStreamResponse(decode, callback) {
        let state = CozeClient.get_stream_state();
        try {
            this.workflowStreamCallback(state, decode, callback);
        }
        catch (error) {
            console.error('Bot Stream 处理错误:', error);
            callback({
                ...state,
                type: 'error',
                // @ts-ignore
                content: error?.message || '',
                isFinished: false
            });
        }
    }
    // ? 多端 非流式接口响应处理  ==============
    // 工作流非响应式回复处理
    async handleWorkflowRunResponse(response, callback) {
        let data = response.data; // 从响应中获取数据部分
        if (data.code == 0) {
            // 检查响应状态码是否为0（成功）
            let workflowResponseData = JSON.parse(data.data); // 解析数据中的JSON字符串
            callback && callback(workflowResponseData); // 如果回调函数存在，则调用它并传递解析后的数据
        }
        else {
            // 处理响应状态码不为0的情况
            callback && callback(null);
        }
    }
    // ? 接口响应回调处理  ==================================
    // 处理bot的decode并执行callback
    async botMPCallback(state, decode, callback) {
        const parts = this.split_decode(decode);
        console.log('botMPCallback,parts', decode, parts);
        let eventType = null;
        for (const part of parts) {
            if (!part.trim())
                continue;
            const data = this.get_part_data(part);
            if (!data) {
                eventType = this.get_part_type(part); // 如果当前流式数据存在内容类型，则获取其类型 一份流式数据由内容类型以及内容两部分组成
                continue;
            }
            // 更新会话状态信息
            state.chatId = data.id;
            state.conversationId = data.conversation_id;
            state.botId = data.bot_id;
            state.chatStatus = data.status;
            state.usage = data.usage;
            // 当流式回复返回的数据结构为JSON数据时，才会存在errInfo
            if (data.errInfo) {
                return callback({
                    ...state,
                    type: 'error',
                    isFinished: true,
                    content: data.errInfo.message
                });
            }
            switch (eventType) {
                case 'conversation.chat.created':
                    callback({
                        ...state,
                        type: 'chat_created',
                        isFinished: false
                    });
                    break;
                case 'conversation.chat.in_progress':
                    callback({
                        ...state,
                        type: 'chat_in_progress',
                        isFinished: false
                    });
                    break;
                case 'event:conversation.chat.failed':
                    callback({
                        ...state,
                        type: 'chat_failed',
                        content: data.last_error?.msg || '回复失败，请稍后再试',
                        isFinished: true
                    });
                    break;
                case 'conversation.chat.completed':
                    callback({
                        ...state,
                        type: 'chat_completed',
                        isFinished: false
                    });
                    break;
                case 'conversation.message.delta':
                    if (data.content_type === 'text') {
                        if (data.reasoning_content) {
                            state.reasoning_content = data.reasoning_content || '';
                        }
                        else {
                            state.content = data.content || '';
                        }
                    }
                    callback({
                        ...state,
                        type: 'message_delta',
                        isFinished: false
                    });
                    break;
                case 'conversation.message.completed':
                    if (data.type === 'follow_up') {
                        callback({
                            ...state,
                            type: 'message_follow_up',
                            content: data.content,
                            isFinished: false
                        });
                    }
                    else {
                        callback({
                            ...state,
                            type: 'message_completed',
                            isFinished: false
                        });
                    }
                    break;
                case 'done':
                    state.isStreamFinished = true;
                    // 提前展示消耗的积分数量，在流式回复处理完后，才会调用算力积分扣除接口
                    callback({
                        ...state,
                        type: 'consume_end',
                        consume_num: this.get_consume_num(this.consume_id),
                        isFinished: false
                    });
                    callback({
                        ...state,
                        type: 'done',
                        isFinished: true
                    });
                    break;
                case 'error':
                    callback({
                        ...state,
                        type: 'error',
                        isFinished: true
                    });
                    break;
            }
        }
    }
    async botWebCallback(state, parts, callback) {
        console.log('botWebCallback,parts', parts);
        let eventType = null;
        for (const part of parts) {
            if (!part.trim())
                continue;
            const data = this.get_part_data(part);
            if (!data) {
                eventType = this.get_part_type(part); // 如果当前流式数据存在内容类型，则获取其类型 一份流式数据由内容类型以及内容两部分组成
                continue;
            }
            // 更新会话状态信息
            state.chatId = data.id;
            state.conversationId = data.conversation_id;
            state.botId = data.bot_id;
            state.chatStatus = data.status;
            state.usage = data.usage;
            // 当流式回复返回的数据结构为JSON数据时，才会存在errInfo
            if (data.errInfo) {
                return callback({
                    ...state,
                    type: 'error',
                    isFinished: true,
                    content: data.errInfo.message
                });
            }
            switch (eventType) {
                case 'conversation.chat.created':
                    callback({
                        ...state,
                        type: 'chat_created',
                        isFinished: false
                    });
                    break;
                case 'conversation.chat.in_progress':
                    callback({
                        ...state,
                        type: 'chat_in_progress',
                        isFinished: false
                    });
                    break;
                case 'event:conversation.chat.failed':
                    callback({
                        ...state,
                        type: 'chat_failed',
                        content: data.last_error?.msg || '回复失败，请稍后再试',
                        isFinished: true
                    });
                    break;
                case 'conversation.chat.completed':
                    callback({
                        ...state,
                        type: 'chat_completed',
                        isFinished: false
                    });
                    break;
                case 'conversation.message.delta':
                    if (data.content_type === 'text') {
                        if (data.reasoning_content) {
                            state.reasoning_content = data.reasoning_content || '';
                        }
                        else {
                            state.content = data.content || '';
                        }
                    }
                    callback({
                        ...state,
                        type: 'message_delta',
                        isFinished: false
                    });
                    break;
                case 'conversation.message.completed':
                    if (data.type === 'follow_up') {
                        callback({
                            ...state,
                            type: 'message_follow_up',
                            content: data.content,
                            isFinished: false
                        });
                    }
                    else {
                        callback({
                            ...state,
                            type: 'message_completed',
                            isFinished: false
                        });
                    }
                    break;
                case 'done':
                    state.isStreamFinished = true;
                    // 提前展示消耗的积分数量，在流式回复处理完后，才会调用算力积分扣除接口
                    callback({
                        ...state,
                        type: 'consume_end',
                        consume_num: this.get_consume_num(this.consume_id),
                        isFinished: false
                    });
                    callback({
                        ...state,
                        type: 'done',
                        isFinished: true
                    });
                    break;
                case 'error':
                    callback({
                        ...state,
                        type: 'error',
                        isFinished: true
                    });
                    break;
            }
        }
    }
    // 处理workflowStream的decode并执行callback
    async workflowStreamCallback(state, decode, callback) {
        const parts = this.split_decode(decode);
        let eventType = null;
        for (const part of parts) {
            if (!part.trim())
                continue;
            const data = this.get_part_data(part);
            if (!data) {
                eventType = this.get_part_type(part); // 如果当前流式数据为内容类型，则获取其类型
                continue;
            }
            if (data.errInfo) {
                return callback({
                    ...state,
                    type: 'done',
                    isFinished: true,
                    content: data.errInfo.message
                });
            }
            switch (eventType) {
                case 'Message':
                    // 处理消息事件
                    if (data.content) {
                        // 尝试解析可能的 JSON 内容
                        let messageContent = data.content;
                        try {
                            const jsonContent = JSON.parse(messageContent);
                            if (jsonContent.output) {
                                // 如果是最后的汇总消息，跳过
                                continue;
                            }
                        }
                        catch (e) {
                            // 不是 JSON，使用原始内容
                        }
                        state.content = messageContent;
                        callback({
                            ...state,
                            type: 'message',
                            content: state.content,
                            delta: messageContent,
                            nodeId: data.node_seq_id,
                            nodeTitle: data.node_title,
                            isFinished: data.node_is_finish
                        });
                    }
                    break;
                case 'Done':
                    callback({
                        ...state,
                        type: 'consume_end',
                        consume_num: this.get_consume_num(this.consume_id),
                        isFinished: false
                    });
                    // 处理完成事件
                    callback({
                        ...state,
                        type: 'complete',
                        content: state.content,
                        isFinished: true,
                        isStreamFinished: true
                    });
                    break;
                case 'Error':
                    callback({
                        ...state,
                        type: 'error',
                        content: '工作流执行失败',
                        isFinished: true
                    });
                    break;
            }
        }
    }
    // !================================  工具区 =================================!
    check_workflow_is_success(response) {
        let data = response.data; // 从响应中获取数据部分
        if (data.code == 0) {
            let workflow_response = JSON.parse(data.data); // 解析数据中的JSON字符串
            const is_has_success = Object.keys(workflow_response).includes('success');
            if (is_has_success && workflow_response.success === false) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    }
    // 错误处理方法
    get_errorinfo(error) {
        let errorInfo = {
            code: 5000, // 默认服务器错误
            message: '未知错误',
            solution: '请稍后重试',
            details: null
        };
        if (typeof error === 'object') {
            // API 错误响应
            if (error.code) {
                const errorData = CozeClient.ERROR_CODES[error.code];
                if (errorData) {
                    errorInfo = {
                        code: error.code,
                        message: error.msg || errorData.message,
                        solution: errorData.solution,
                        details: error
                    };
                }
                else {
                    errorInfo.message = error.message || '未知错误';
                    errorInfo.details = error;
                }
            }
            // // #ifdef H5
            // // fetch 请求错误
            // else if (error instanceof Response) {
            //   errorInfo.code = error.status;
            //   errorInfo.message = error.statusText;
            //   errorInfo.details = error;
            // }
            // // #endif
            // 其他错误
            else {
                errorInfo.message = error.message || '未知错误';
                errorInfo.details = error;
            }
        }
        // 打印错误信息方便调试
        console.error('Coze Responese Error error:', error);
        console.error('Coze Responese Error errorInfo:', errorInfo);
        return errorInfo;
    }
    // 分割每一段的流式回复
    split_decode(decode) {
        const parts = decode.split('\n').filter(part => !!part.trim());
        return parts;
    }
    /**
     * 事件类型检查
     * */
    get_part_type(part) {
        if (part.startsWith('event:')) {
            const eventType = part.replace('event:', '').trim();
            return eventType;
        }
        else if (part.startsWith('data:')) {
            return 'data';
        }
        return 'unknown';
    }
    // 获取数据部分的对象
    get_part_data(part) {
        if (!part)
            return null;
        try {
            const res = JSON.parse(part);
            // 如果能序列化，表示流式接口返回的是 JSON 对象
            // 同时也说明接口返回的是报错信息
            const errInfo = this.get_errorinfo(res);
            return { content: errInfo.message, errInfo };
        }
        catch (error) {
            try {
                if (part.startsWith('event:'))
                    return null;
                return JSON.parse(part.replace('data:', ''));
            }
            catch (error2) {
                console.error('CozeClient get_part_data error:', error2);
                return null;
            }
        }
    }
    // 判断api接口是否需要流式处理
    chcek_is_stream_url() {
        return this.streamUrlTypeMap[this.urlType] || false;
    }
    // 设置token
    set_token(token) {
        this.token = token;
    }
    // 根据fileList，输出content_type为object_string的EnterMessage Object
    get_content_filelist(fileList) {
        return {
            content_type: 'object_string',
            content: JSON.stringify(fileList)
        };
    }
    // 接口参数处理
    handle_request_body(body) {
        const n_body = util.deepClone(body);
        if (n_body.custom_variables) {
            n_body.custom_variables = this.handle_custom_variables(n_body.custom_variables);
        }
        return n_body;
    }
    handle_custom_variables(custom_variables) {
        if (!custom_variables)
            return {};
        const n_custom_variables = util.deepClone(custom_variables);
        // 解构用户的extra数据到body中
        if (n_custom_variables.extra) {
            n_custom_variables.extra = this.split_body_extra(n_custom_variables.extra);
            Object.entries(n_custom_variables.extra).forEach(([key, value]) => {
                n_custom_variables[key] = JSON.stringify(value);
            });
            // 删除原extra参数
            delete n_custom_variables.extra;
        }
        return n_custom_variables;
    }
    split_body_extra(extra) {
        if (!extra)
            return {};
        const n_extra = {};
        Object.entries(extra).forEach(([key, value]) => {
            const n_value = util.deepClone(value);
            switch (key) {
                case 'category':
                    n_extra['extra_' + key] = n_value === 0 ? '个人' : '企业';
                    break;
                default:
                    n_extra['extra_' + key] = n_value;
                    break;
            }
        });
        return {
            ...n_extra
        };
    }
    // 模拟AI回复输出
    simulate_bot_reply(callback, origin_message, options) {
        let timer = null;
        const { reasoning_content_random = 3, content_radom = 3 } = options || {};
        return new Promise((resolve, reject) => {
            if (timer)
                clearInterval(timer);
            try {
                if (!callback || !origin_message)
                    return;
                let message = util.deepClone(origin_message);
                if (typeof message == 'string')
                    message = Object.assign(CozeClient.get_stream_state(), {
                        type: '',
                        content: message,
                        isFinished: false
                    });
                const { content, reasoning_content, follow_up, task, consume_num } = message;
                const state = util.deepClone(CozeClient.stream_state);
                state.type = 'message_delta';
                let content_len = content ? content.length : 0;
                let content_list = [];
                let reasoning_content_len = reasoning_content
                    ? reasoning_content.length
                    : 0;
                let reasoning_content_list = [];
                let n_follow_up = util.deepClone(follow_up || []);
                if (reasoning_content_len) {
                    let idx = 0;
                    while (reasoning_content_len > 0) {
                        const len = Math.ceil(Math.random() * reasoning_content_random);
                        if (reasoning_content_len - len < 0) {
                            reasoning_content_list.push({
                                ...state,
                                reasoning_content: reasoning_content?.slice(idx, idx + reasoning_content_len),
                                isFinished: false
                            });
                            reasoning_content_len = 0;
                        }
                        else {
                            reasoning_content_list.push({
                                ...state,
                                reasoning_content: reasoning_content?.slice(idx, idx + len),
                                isFinished: false
                            });
                            idx += len;
                            reasoning_content_len -= len;
                        }
                    }
                }
                if (content_len) {
                    let idx = 0;
                    while (content_len > 0) {
                        const len = Math.ceil(Math.random() * content_radom);
                        if (content_len - len < 0) {
                            content_list.push({
                                ...state,
                                content: content?.slice(idx, idx + content_len),
                                isFinished: false
                            });
                            content_len = 0;
                        }
                        else {
                            content_list.push({
                                ...state,
                                content: content?.slice(idx, idx + len),
                                isFinished: false
                            });
                            idx += len;
                            content_len -= len;
                        }
                    }
                }
                timer = setInterval(() => {
                    if (reasoning_content_list.length) {
                        callback(reasoning_content_list.shift() || null);
                    }
                    else if (content_list.length) {
                        callback(content_list.shift() || null);
                    }
                    else if (n_follow_up.length) {
                        callback({
                            ...state,
                            type: 'message_follow_up',
                            content: n_follow_up.shift(),
                            isFinished: false
                        });
                    }
                    else {
                        callback({
                            ...state,
                            type: 'custom_task',
                            task,
                            isFinished: false
                        });
                        callback({
                            ...state,
                            type: 'consume_end',
                            consume_num,
                            isFinished: false
                        });
                        callback({
                            type: 'done',
                            isFinished: true
                        });
                        resolve(true);
                        if (timer)
                            clearInterval(timer);
                    }
                }, 30);
            }
            catch (err) {
                console.error('🚀 ~ CozeClient ~ simulate_bot_reply ~ catch ~ err:', err);
                if (timer)
                    clearInterval(timer);
                reject(false);
            }
        });
    }
    get_consume_num(consume_id = 9) {
        const consume_num = util.deepClone(CozeClient.consume_map)[String(consume_id)];
        return consume_num;
    }
    static get_stream_state() {
        return util.deepClone(CozeClient.stream_state);
    }
    // !================================  接口调用区 =================================!
    // 扣除用户积分
    async consumeIntegral(handleConsumeEnd) {
        handleConsumeEnd(this.get_consume_num(this.consume_id));
        // try {
        //   if (!this.is_consume) {
        //     handleConsumeEnd(0);
        //     return;
        //   }
        //   const res = await this.request.postConsume?.({
        //     type: this.consume_id
        //   });
        //   this.consume_loading = true;
        //   handleConsumeEnd(
        //     res && res.code === 0 ? this.get_consume_num(this.consume_id) : 0
        //   );
        // } catch (err) {
        //   console.error('🚀 ~ CozeClient ~ consumeIntegral ~ err:', err);
        //   this.consume_loading = true;
        // }
    }
    // 更新扣子API请求所需的token 异步
    getToken() {
        return new Promise((resolve, reject) => {
            if (this.token) {
                resolve(this.token);
            }
            else {
                this.tokenLoading = true;
                uni.request({
                    url: this.urlConfig.token,
                    method: 'POST',
                    dataType: 'json',
                    header: {
                        'content-type': 'application/json'
                        // 'platform': 'mini-weixin'
                    },
                    data: {
                        appid: this.appid,
                        secret_key: this.secret_key
                    },
                    success: (res) => {
                        if (res.statusCode == 200 && res.data.code == 0) {
                            let token = res.data?.data?.access_token;
                            this.set_token(token);
                        }
                        resolve(res);
                    },
                    fail: (err) => {
                        reject(err);
                    },
                    complated: () => {
                        this.tokenLoading = false;
                    }
                });
            }
        });
    }
    // 创建会话
    createConversation(options) {
        return new Promise((resolve, reject) => {
            try {
                const { header = {}, data = {} } = options || {};
                if (!this.token) {
                    resolve(null);
                    return;
                }
                uni.request({
                    url: this.urlConfig.bot.conversation.create,
                    header: {
                        'content-type': 'application/json',
                        'Authorization': 'Bearer ' + this.token,
                        ...header
                    },
                    method: 'POST',
                    data: {
                        // bot_id: this.bot.bot_id,
                        ...data
                    },
                    success: (res) => {
                        let data = res.data;
                        if (data && data.code == 0) {
                            this.conversation_id = data.data.id;
                            resolve(data.data);
                        }
                        else {
                            resolve(null);
                        }
                    },
                    fail: (err) => {
                        console.error('🚀 ~ CozeClient ~ createConversation ~ err:', err);
                        resolve(null);
                    }
                });
            }
            catch (err) {
                console.error('🚀 ~ CozeClient ~ createConversation ~ err:', err);
                resolve(null);
            }
        });
    }
}
// Coze API 错误码映射
CozeClient.ERROR_CODES = {
    // 请求参数错误 4000-4099
    4000: {
        message: '请求参数错误',
        solution: '请参考 API 文档检查请求参数'
    },
    4001: {
        message: '无效的对话',
        solution: '请检查 chat id 后重试'
    },
    4002: {
        message: '无效的会话',
        solution: '请检查 conversation id 后重试'
    },
    4003: {
        message: 'meta data 超过限制',
        solution: '请参考 API 文档检查请求参数'
    },
    4004: {
        message: 'additional messages超过限制',
        solution: '请参考 API 文档检查请求参数'
    },
    4005: {
        message: '无效的消息',
        solution: '请检查 message id 和 content 后重试'
    },
    4006: {
        message: '无效的智能体',
        solution: '请检查智能体id后重试'
    },
    4007: {
        message: '流false仅在自动保存为true时允许',
        solution: '修改请求参数设置，详细说明可参考发起对话'
    },
    4008: {
        message: '用户限流',
        solution: '请明日再试'
    },
    4009: {
        message: '已达系统请求上限',
        solution: '请稍后重试'
    },
    4010: {
        message: 'prompt token 数量超过模型上限',
        solution: '建议缩短问题长度后重试'
    },
    4011: {
        message: 'Coze Token 余额不足',
        solution: '建议充值后重试'
    },
    4012: {
        message: '无效模型',
        solution: '建议更换智能体的模型之后重试'
    },
    4013: {
        message: '模型错误',
        solution: '建议稍后重试'
    },
    4014: {
        message: '问题无法回答',
        solution: '请更换问题后重试'
    },
    4015: {
        message: '智能体未发布到API',
        solution: '请参考准备工作完成 API 调用前的准备工作'
    },
    4016: {
        message: '当前会话已有chat在运行',
        solution: '请等待对话完成后再发起新的对话'
    },
    4019: {
        message: '火山Bot调用按量余额不足',
        solution: '请及时充值'
    },
    4020: {
        message: '火山Bot调用超出RPM峰值',
        solution: '请增加 RPM 的额度'
    },
    4021: {
        message: '工作流未配置',
        solution: '请配置工作流后重试'
    },
    4022: {
        message: '模型欠费',
        solution: '请及时结清欠款恢复账号'
    },
    // 认证和权限错误 4100-4199
    4100: {
        message: '身份验证无效',
        solution: '请检查个人访问令牌(PAT)后重试'
    },
    4101: {
        message: '没有权限访问该资源',
        solution: '请检查个人访问令牌的权限后重试'
    },
    4102: {
        message: '命中风控拦截',
        solution: '请稍后重试，持续报错请提交反馈'
    },
    4104: {
        message: '当前对话不支持取消',
        solution: '确认对话 ID 和对话状态'
    },
    4105: {
        message: '内容包含敏感信息',
        solution: '请检查智能体配置，删除敏感词后重新发布'
    },
    // 资源错误 4200-4299
    4200: {
        message: '资源未找到',
        solution: '建议检查资源 ID 后重试'
    },
    // 文件操作错误 4300-4399
    4300: {
        message: '上传文件为空',
        solution: '请检查文件名称和请求头设置'
    },
    4301: {
        message: '文件上传超过一个',
        solution: '建议分批上传'
    },
    4302: {
        message: '文件大小超过限制',
        solution: '建议更换文件后重试'
    },
    4303: {
        message: '不支持的文件类型',
        solution: '请参考文档支持的文件类型'
    },
    4304: {
        message: '文件无效',
        solution: '建议更换文件后重试'
    },
    4314: {
        message: '未找到执行记录',
        solution: '建议更换 execute_id 或 workflow_id 后重试'
    },
    4315: {
        message: '执行已结束',
        solution: '确认工作流 ID 是否正确'
    },
    // 服务器错误 5000-5999
    5000: {
        message: '服务器内部错误',
        solution: '请稍后重试，持续报错请提交反馈'
    }
};
CozeClient.stream_state = {
    type: '',
    content: '', // 累积的文本内容
    reasoning_content: '', // 累积的推理内容
    error: null, // 错误信息
    conversationId: null, // 对话 ID
    chatId: null, // Chat ID
    botId: null, // 机器人 ID
    chatStatus: null, // 会话状态
    usage: null, // 使用情况
    isStreamFinished: false, // 流是否结束
    isAccumulateMessage: true, // 是否累加消息
    follow_up: [], // 追问建议
    consume_num: 0 // 消耗的算力积分数量
};
CozeClient.empty_response = {
    code: 0,
    msg: 'success',
    data: null
};
CozeClient.empty_promise = () => new Promise(resolve => resolve(CozeClient.empty_response));
CozeClient.consume_map = {
    '-1': 0,
    '9': 1,
    '10': 6,
    '11': 30
};
export default CozeClient;
