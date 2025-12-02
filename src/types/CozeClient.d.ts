export declare namespace CozeClient {
    type UrlType = 'bot.chat' | 'workflow.run' | 'workflow.stream_run';
    type Platform = 'Uniapp';
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
        postConsume: (params: {
            type: number;
        }) => Promise<any>;
        getToken: () => Promise<any>;
    }
    interface RequestHandlers {
        postConsume: (fn: (params: {
            type: number;
        }) => Promise<any>) => void;
        getToken: (fn: () => Promise<any>) => void;
    }
    interface InitOptions {
        cozeToken?: string;
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
        content: string;
        reasoning_content: string;
        error: any;
        conversationId: string | null;
        chatId: string | null;
        botId: string | null;
        chatStatus: string | null;
        usage: any;
        isStreamFinished: boolean;
        isAccumulateMessage: boolean;
        follow_up: string[];
        consume_num: number;
        task?: any;
        type: string;
    }
    interface CallbackData extends Partial<StreamState> {
        type: string;
        isFinished: boolean;
        data?: any;
        delta?: string;
        nodeId?: string;
        nodeTitle?: string;
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
