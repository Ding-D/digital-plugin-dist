export declare namespace CozeClient {
    type UrlType = 'bot.chat' | 'workflow.run' | 'workflow.stream_run';
    type Platform = 'Web' | 'MP';
    interface UrlConfig {
        bot: {
            chat: string;
            conversation: {
                create: string;
            };
        };
        workflow: {
            run: string;
            stream_run: string;
        };
    }
    interface UrlConfigHandlers {
        bot: {
            chat: (url: string) => void;
            conversation: {
                create: (url: string) => void;
            };
        };
        workflow: {
            run: (url: string) => void;
            stream_run: (url: string) => void;
        };
    }
    type RequestClient = Promise<any> | null;
    interface RequestConfig {
        postConsume?: (params: {
            type: number;
        }) => Promise<any>;
        getToken?: () => Promise<any>;
    }
    interface RequestHandlers {
        postConsume: (fn: (params: {
            type: number;
        }) => Promise<any>) => void;
        getToken: (fn: () => Promise<any>) => void;
    }
    interface InitOptions {
        appid: string;
        secret_key: string;
        conversation_id?: string;
        token?: string;
        urlType?: UrlType;
        platform?: Platform;
        requestClient?: RequestClient;
        request?: RequestConfig;
        urlConfig?: Partial<UrlConfig>;
        token_callback?: (token: string | null) => void;
        consume_id?: number;
        is_consume?: boolean;
    }
    interface ConsumeOptions {
        consume_id?: number;
        is_consume?: boolean;
    }
    interface ClientOptions {
        urlType?: UrlType;
        consume_id?: number;
        is_consume?: boolean;
    }
    interface SendMessageOptions {
        body?: any;
        params?: Record<string, any>;
        header?: Record<string, string>;
        callback?: (data: CallbackData) => void;
        clientOptions?: ClientOptions;
    }
    interface StartRequestOptions extends Omit<SendMessageOptions, 'params'> {
    }
    interface RequestOptions extends StartRequestOptions {
        url: string;
    }
    interface UiappResponse {
        data: Object | String | ArrayBuffer;
        statusCode: number;
        header: ResponseInit['headers'];
        cookies: string[];
    }
    interface ResquestBody extends Record<string, any> {
        bot_id: string;
        user_id: string;
        workflow_id?: string;
    }
    interface PlatformRequestOptions {
        url: string;
        body?: any;
        callback?: (data: any) => void;
    }
    interface StreamState {
        /**
         * 消息类型。
         *
         *@value  question: 用户输入内容。
         *@value  answer: 智能体返回给用户的消息内容，支持增量返回。如果工作流绑定了 messge 节点，可能会存在多 answer 场景，此时可以用流式返回的结束标志来判断所有 answer 完成。
         *@value  function_call: 智能体对话过程中调用函数（function call）的中间结果。
         *@value  tool_response: 调用工具 （function call）后返回的结果。
         *@value  follow_up: 如果在智能体上配置打开了用户问题建议开关，则会返回推荐问题相关的回复内容。
         *@value  verbose: 多 answer 场景下，服务端会返回一个 verbose 包，对应的 content 为 JSON 格式，content.msg_type =generate_answer_finish 代表全部 answer 回复完成。
      
         */
        type: 'question' | 'answer' | 'function_call' | 'tool_response' | 'follow_up' | 'verbose';
        /**
         * 消息状态。
         *
         *@value  error: 接口返回的错误信息。
         *@value  consume_end: 消费结束标志。
         */
        stream_type: 'chat_created' | 'chat_in_progress' | 'chat_failed' | 'chat_completed' | 'message_delta' | 'message_follow_up' | 'message_completed' | 'done' | 'message' | 'consume_end' | 'complete' | 'custom_task' | 'error' | 'consume_end';
        id: string;
        content: string;
        /**
         * 消息内容的类型，取值包括：
         *
         * text：文本。
         * object_string：多模态内容，即文本和文件的组合、文本和图片的组合。
         * card：卡片。此枚举值仅在接口响应中出现，不支持作为入参。
         * audio：音频。此枚举值仅在接口响应中出现，不支持作为入参。仅当输入有 audio 文件时，才会返回此类型。当 content_type 为 audio 时，content 为 base64 后的音频数据。音频的编码根据输入的 audio 文件的不同而不同：
         *   输入为 wav 格式音频时，content 为采样率 24kHz，raw 16 bit, 1 channel, little-endian 的 pcm 音频片段 base64 后的字符串
         *   输入为 ogg_opus 格式音频时，content 为采样率 48kHz，1 channel，10ms 帧长的 opus 格式音频片段base64 后的字符串
         */
        content_type: 'text' | 'object_string' | 'card' | 'audio';
        reasoning_content: string;
        conversation_id: string;
        bot_id: string;
        status: string;
        usage: any;
        last_error?: {
            code: number;
            msg: string;
        };
    }
    interface CallbackData extends StreamState {
        isFinished: boolean;
        consume_num?: number;
        response?: any;
        errInfo?: ErrInfo;
        isAccumulateMessage?: boolean;
        follow_up?: string[];
        task?: any;
    }
    interface ErrInfo {
        code: number;
        message: string;
        solution: string;
        details: any;
    }
    interface EnterMessage {
        role: 'user' | 'assistant';
        content?: string;
        type?: 'question' | 'answer' | 'function_call' | 'tool_response';
        content_type?: 'text' | 'object_string';
        meta_data?: Map<string, string>;
    }
    interface ObjectString {
        type: 'text' | 'file' | 'image' | 'audio';
        text?: string;
        file_id?: string;
        file_url?: string;
    }
    interface Callback {
        (data: CallbackData | null): void;
    }
    interface StreamData {
        id?: string;
        conversation_id?: string;
        bot_id?: string;
        status?: string;
        usage?: any;
        content?: string;
        content_type?: string;
        reasoning_content?: string;
        type?: string;
        node_seq_id?: string;
        node_title?: string;
        node_is_finish?: boolean;
        errInfo?: {
            message: string;
        };
    }
    interface RecursionHandler {
        (data: any, handle: any): void;
    }
    interface CustomVariables {
        extra?: Record<string, any>;
        [key: string]: any;
    }
    interface SimulateOptions {
        reasoning_content_random?: number;
        content_radom?: number;
    }
    interface SimulateMessage {
        content?: string;
        reasoning_content?: string;
        follow_up?: string[];
        task?: any;
        consume_num?: number;
    }
    interface ConversationOptions {
        header?: Record<string, string>;
        data?: Record<string, any>;
    }
    interface WorkflowResponse {
        code: number;
        msg?: string;
        data?: string;
    }
    interface UniResponse {
        statusCode: number;
        data: any;
    }
    interface StreamUrlMap {
        [key: string]: boolean;
    }
    interface ErrorInfo {
        code: number;
        message: string;
        solution: string;
        details?: any;
    }
    interface ConsumeMap {
        [key: string]: number;
    }
    interface ErrorCodeMap {
        [code: number]: {
            message: string;
            solution: string;
        };
    }
    type CallbackFunction = (data: any) => void;
    type TokenCallback = (token: string | null) => void;
    type ConsumeCallback = (consumeNum: number) => void;
    type ConversationCallback = (conversationId: string) => void;
}
