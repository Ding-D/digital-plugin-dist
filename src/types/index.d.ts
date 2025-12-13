import FrontendSecurity from '../utils/frontend-security';
export interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data?: T;
}
export interface ErrorInfo {
    code: number;
    message: string;
    solution: string;
    details?: any;
}
export interface CozeMessage {
    role: 'user' | 'assistant';
    content: string;
    reasoning_content?: string;
    content_type: 'text' | 'object_string';
    type?: 'question' | 'answer';
    follow_up?: string[];
    task?: any;
    is_show_reply_again?: boolean;
    is_show_copy?: boolean;
    is_show_consume?: boolean;
    is_custom_message?: boolean;
}
export interface CozeFile {
    type: 'image' | 'file';
    file_id?: string;
    file_url?: string;
}
export interface CozeStreamState {
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
}
export interface CozeWorkflowState {
    content: string;
    reasoning_content: string;
    error: any;
    isStreamFinished: boolean;
    isAccumulateMessage: boolean;
    consume_num: number;
}
export interface ActionConfig {
    name: string;
    type: 'uni' | 'vue';
    command: string;
    attrs: string[];
    options?: any;
    handleOptions?: (linkEvent: any) => any;
}
export interface ActionMap {
    [key: string]: ActionConfig;
}
export interface TaskStatusMap {
    [key: string]: string;
}
export interface TaskTemplate {
    name: string;
    key: string;
    task_status: string;
    dom_list: DomItem[];
    ai_config: {
        message_list: any[];
    };
    show_next_btn: boolean;
    next_btn: string;
    next_task_key: string;
    next_task?: string;
}
export interface DomItem {
    type: string;
    title?: string;
    info?: string;
    name?: string;
    value?: any;
    placeholder?: string;
    placeholder_html?: string;
    required?: boolean;
    show_title_bar?: boolean;
    show_title: boolean;
    need_random_value?: boolean;
    is_need_edit?: boolean;
    maxlength?: number;
    select_type?: 'single' | 'multiple';
    options?: any[];
    value_list?: any[];
    input_type?: string;
    html?: string;
}
export interface Utils {
    cozeUtil: CozeUtil;
    frontendSecurity: FrontendSecurity;
    TextEncoder: (val: string) => Uint8Array;
    TextDecoder: (val: Uint8Array) => string;
    deepClone: <T>(val: T) => T;
    isEmpty: (val: any) => boolean;
    isNumber: (val: any) => boolean;
    URLSearchParams: (init?: string | object | string[]) => URLSearchParamsLike;
}
export interface LinkEvent {
    innerText?: string;
    [key: string]: any;
}
export interface ActionHandleOptions {
    (linkEvent: LinkEvent): any;
}
export interface ActionConfigExtended extends ActionConfig {
    handleOptions?: ActionHandleOptions;
}
declare global {
    const uni: any;
}
export interface CozeUtil {
    generate_user_messages: (input: string, fileList?: CozeFile[]) => CozeMessage[];
    generate_assistant_message: (content: string, reasoning_content: string) => CozeMessage;
}
export interface URLSearchParamsLike {
    toString: () => string;
}
export type Platform = 'Web' | 'Uniapp';
export interface RequestConfig {
    postConsume?: (params: {
        type: number;
    }) => Promise<ApiResponse>;
    getToken?: () => Promise<ApiResponse<{
        access_token: string;
    }>>;
}
export interface CozeClientOptions {
    cozeToken?: string;
    urlType?: string;
    platform?: Platform;
    request?: RequestConfig;
    urlConfig?: any;
    token_callback?: (token: string) => void;
    consume_id?: number;
    is_consume?: boolean;
}
export interface SendMessageOptions {
    body?: any;
    params?: Record<string, any>;
    callback: (data: any) => void;
    clientOptions?: Partial<CozeClientOptions>;
}
export interface RequestTask {
    onChunkReceived?: (res: {
        data: ArrayBuffer;
    }) => void;
    onHeadersReceived?: (res: any) => void;
    abort?: () => void;
}
export interface SimulateOptions {
    reasoning_content_random?: number;
    content_radom?: number;
}
