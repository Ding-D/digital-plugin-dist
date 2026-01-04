import type { ApiResponse, CozeMessage } from '../types';
import type { ConversationHistoryResponse, ConversationHistoryItem } from '../types/coze-api-responses';
import type { CozeClient } from '../types/CozeClient';
declare class CozeClient {
    static ERROR_CODES: {
        4000: {
            message: string;
            solution: string;
        };
        4001: {
            message: string;
            solution: string;
        };
        4002: {
            message: string;
            solution: string;
        };
        4003: {
            message: string;
            solution: string;
        };
        4004: {
            message: string;
            solution: string;
        };
        4005: {
            message: string;
            solution: string;
        };
        4006: {
            message: string;
            solution: string;
        };
        4007: {
            message: string;
            solution: string;
        };
        4008: {
            message: string;
            solution: string;
        };
        4009: {
            message: string;
            solution: string;
        };
        4010: {
            message: string;
            solution: string;
        };
        4011: {
            message: string;
            solution: string;
        };
        4012: {
            message: string;
            solution: string;
        };
        4013: {
            message: string;
            solution: string;
        };
        4014: {
            message: string;
            solution: string;
        };
        4015: {
            message: string;
            solution: string;
        };
        4016: {
            message: string;
            solution: string;
        };
        4019: {
            message: string;
            solution: string;
        };
        4020: {
            message: string;
            solution: string;
        };
        4021: {
            message: string;
            solution: string;
        };
        4022: {
            message: string;
            solution: string;
        };
        4100: {
            message: string;
            solution: string;
        };
        4101: {
            message: string;
            solution: string;
        };
        4102: {
            message: string;
            solution: string;
        };
        4104: {
            message: string;
            solution: string;
        };
        4105: {
            message: string;
            solution: string;
        };
        4200: {
            message: string;
            solution: string;
        };
        4300: {
            message: string;
            solution: string;
        };
        4301: {
            message: string;
            solution: string;
        };
        4302: {
            message: string;
            solution: string;
        };
        4303: {
            message: string;
            solution: string;
        };
        4304: {
            message: string;
            solution: string;
        };
        4314: {
            message: string;
            solution: string;
        };
        4315: {
            message: string;
            solution: string;
        };
        5000: {
            message: string;
            solution: string;
        };
    };
    static stream_state: CozeClient.StreamState;
    static empty_response: ApiResponse;
    static empty_promise: () => Promise<ApiResponse<any>>;
    platform: CozeClient.Platform;
    request: CozeClient.RequestConfig;
    requestHandleMap: {};
    requestClient: CozeClient.RequestClient;
    appid: string;
    secret_key: string;
    urlType: string;
    urlConfig: {
        token: string;
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
        botHistory: string;
        conversationHistory: string;
    };
    urlConfigHandleMap: {
        token: (url: string) => string;
        bot: {
            chat: (url: string) => string;
            conversation: {
                create: (url: string) => string;
            };
        };
        workflow: {
            run: (url: string) => string;
            stream_run: (url: string) => string;
        };
        botHistory: (url: string) => string;
        conversationHistory: (url: string) => string;
    };
    streamUrlTypeMap: Record<string, boolean>;
    token: string;
    tokenLoading: boolean;
    conversation_id: string;
    create_conversation_loading: boolean;
    get_history_loading: boolean;
    get_conversation_history_loading: boolean;
    private streamBuffer;
    constructor(options: CozeClient.InitOptions);
    init(options: CozeClient.InitOptions): void;
    init_request(request: CozeClient.RequestConfig): void;
    init_url_config(urlConfig: Partial<CozeClient.UrlConfig>): void;
    init_url_type(urlType: CozeClient.UrlType): void;
    init_client_options(options: CozeClient.ClientOptions): void;
    get_url(): string;
    sendMessage(options: CozeClient.SendMessageOptions): any;
    startRequest(url: string, options: CozeClient.StartRequestOptions): any;
    requestByWeb(options: CozeClient.RequestOptions): Promise<Response>;
    requestByMP(options: CozeClient.RequestOptions): any;
    handleWebResponse(): ((reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>, decoder: TextDecoder, callback: CozeClient.Callback) => Promise<void>) | ((response: CozeClient.UniResponse, callback: CozeClient.Callback) => Promise<void>) | null;
    handleMPResponse(): ((response: CozeClient.UniResponse, callback: CozeClient.Callback) => Promise<void>) | ((decode: string, callback: CozeClient.Callback) => Promise<void>) | null;
    handleWebBotResponse(reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>, decoder: TextDecoder, callback: CozeClient.Callback): Promise<void>;
    handleWebWorkflowRunStream(reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>, decoder: TextDecoder, callback: CozeClient.Callback): Promise<void>;
    handleMPBotResponse(decode: string, callback: CozeClient.Callback): Promise<void>;
    handleMPWorkflowRunStreamResponse(decode: string, callback: CozeClient.Callback): Promise<void>;
    handleWorkflowRunResponse(response: CozeClient.UniResponse, callback: CozeClient.Callback): Promise<void>;
    MPBotCallback(origon_state: CozeClient.StreamState, decode: string, callback: CozeClient.Callback): Promise<CozeClient.CallbackData | undefined>;
    webBotCallback(state: CozeClient.StreamState, parts: string[], callback: CozeClient.Callback): CozeClient.CallbackData | null;
    workflowStreamCallback(state: CozeClient.StreamState, decode: string, callback: CozeClient.Callback): Promise<void>;
    check_workflow_is_success(response: CozeClient.UniResponse): boolean;
    get_errorinfo(error: any): CozeClient.ErrInfo;
    split_decode(decode: string): string[];
    /**
     * 解码Unicode转义字符（如 \u003c -> <）
     * */
    decode_unicode_escape(str: string): string;
    /**
     * 事件类型检查
     * */
    get_part_type(part: string): string;
    get_part_data(part: string): CozeClient.CallbackData | null;
    check_is_stream_url(): boolean;
    set_token(token: string): void;
    get_content_filelist(fileList: CozeClient.ObjectString[]): {
        content_type: string;
        content: string;
    };
    handle_request_body(body: CozeClient.ResquestBody): CozeClient.ResquestBody;
    handle_custom_variables(custom_variables: Record<string, any>): Record<string, any>;
    split_body_extra(extra: Record<string, any>): {
        [x: string]: any;
    };
    static simulate_bot_reply(callback: CozeClient.Callback, origin_message: CozeMessage, options: {
        reasoning_content_random?: number;
        content_radom?: number;
        time?: number;
    }): Promise<unknown>;
    static get_stream_state(): CozeClient.StreamState;
    convertHistoryToCallbackData(historyItems: ConversationHistoryItem[]): CozeClient.CallbackData[];
    callbackData2Messages(callbackData: CozeClient.CallbackData): CozeMessage | CozeMessage[] | null;
    getToken(): Promise<unknown>;
    createConversation(options: {
        header: any;
        data: any;
    }): Promise<unknown>;
    getBotHistory(options: {
        query: Record<string, string>;
    }): Promise<unknown>;
    getConversationHistory(options: {
        query: Record<string, string>;
    }): Promise<ConversationHistoryResponse | null>;
}
export default CozeClient;
