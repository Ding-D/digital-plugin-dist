/**
 * 发起对话接口基础响应结构
 */
export interface ChatBaseResponse {
    code: number;
    msg: string;
    data?: any;
}
/**
 * 发起对话流式响应事件类型
 */
export type ChatStreamEventType = 'conversation.chat.created' | 'conversation.chat.in_progress' | 'conversation.chat.failed' | 'conversation.chat.completed' | 'conversation.message.delta' | 'conversation.message.completed' | 'done' | 'error';
/**
 * 发起对话流式响应数据结构 (type为answer, content-type为text的)
 */
export interface ChatStreamAnswerResponse {
    id: string;
    conversation_id: string;
    bot_id: string;
    status: string;
    usage?: {
        token_count?: number;
        output_count?: number;
        input_count?: number;
    };
    type: 'answer';
    content_type: 'text';
    content?: string;
    reasoning_content?: string;
    last_error?: {
        msg: string;
        code?: string;
    };
    event?: ChatStreamEventType;
}
/**
 * 发起对话流式响应数据结构
 */
export interface ChatStreamResponse {
    id: string;
    conversation_id: string;
    bot_id: string;
    status: string;
    usage?: {
        token_count?: number;
        output_count?: number;
        input_count?: number;
    };
    messages?: Array<{
        id: string;
        conversation_id: string;
        bot_id: string;
        role: 'user' | 'assistant';
        type: 'question' | 'answer' | 'follow_up';
        content_type: 'text' | 'object_string';
        content: string;
        reasoning_content?: string;
        created_at?: number;
        updated_at?: number;
    }>;
}
/**
 * 发起对话非流式响应数据结构
 */
export interface ChatNonStreamResponse extends ChatBaseResponse {
    data: ChatStreamResponse;
}
/**
 * 执行工作流响应数据结构
 */
export interface WorkflowRunResponse extends ChatBaseResponse {
    data: string;
}
/**
 * 解析后的工作流执行结果
 */
export interface WorkflowRunData {
    success: boolean;
    output?: any;
    error?: string;
    execute_id?: string;
    [key: string]: any;
}
/**
 * 工作流流式响应事件类型
 */
export type WorkflowStreamEventType = 'Message' | 'Done' | 'Error';
/**
 * 工作流流式响应数据结构
 */
export interface WorkflowStreamResponse {
    event: WorkflowStreamEventType;
    content?: string;
    error?: string;
    execute_id?: string;
    [key: string]: any;
}
/**
 * 工作流流式完成响应数据结构
 */
export interface WorkflowStreamDoneResponse extends WorkflowStreamResponse {
    event: 'Done';
    output?: any;
    success?: boolean;
}
/**
 * 流式响应基础结构
 */
export interface StreamBaseResponse {
    event?: string;
    data?: any;
    [key: string]: any;
}
/**
 * API错误响应结构
 */
export interface ApiErrorResponse {
    code: number;
    msg: string;
    data?: any;
}
/**
 * 使用情况统计
 */
export interface UsageStats {
    token_count?: number;
    output_count?: number;
    input_count?: number;
}
export type BotHistory = {
    user_id: string;
    bot_id: string;
    conversation_id: string;
    content: string;
    content_type: string;
    meta_data: null | any;
    role: 'user' | 'assistant';
    type: 'question' | 'answer' | 'follow_up';
    section_id: string;
    reasoning_content: string;
    created_at: number;
    stream: string;
};
export type WorkflowHistory = {
    bot_id: string;
    content: string;
    content_type: 'text';
    conversation_id: string;
    created_at: number;
    execute_id: string;
    interrupt_data: null;
    stream: 'false' | 'true';
    usage: string;
    user_id: string;
    workflow_id: string;
};
export type WorkflowHistoryContentObj = {
    output: string;
};
/**
 * 对话历史项
 */
export type ConversationHistoryItem = BotHistory | WorkflowHistory;
/**
 * 获取对话历史响应
 */
export interface ConversationHistoryResponse extends ChatBaseResponse {
    data: ConversationHistoryItem[];
    time: number;
    total: number;
    per_page: string;
    current_page: string;
    last_page: number;
}
