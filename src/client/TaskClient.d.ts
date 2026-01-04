import type { TaskTemplate, DomItem } from '../types';
declare class TaskClient {
    static task_status_map: {
        '-1': string;
        '0': string;
        '1': string;
        '2': string;
        '3': string;
    };
    static task_template: {
        name: string;
        key: string;
        task_status: string;
        dom_list: never[];
        ai_config: {
            message_list: never[];
        };
        show_action_btn: boolean;
        action_btn: string;
        next_task_key: string;
    };
    static dom_status: {
        required: boolean;
        show_title_bar: boolean;
        show_title: boolean;
        need_random_value: boolean;
        is_need_edit: boolean;
    };
    static dom_public_keys: {
        title: string;
        type: string;
        info: string;
        name: string;
        value: string;
        value_list: never[];
        placeholder: string;
        placeholder_html: string;
    };
    static dom_map: {
        text: {
            default: {
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                is_need_edit: boolean;
                type: string;
                html: string;
                title: string;
                info: string;
                name: string;
                value: string;
                value_list: never[];
                placeholder: string;
                placeholder_html: string;
            };
        };
        textarea: {
            default: {
                need_random_value: boolean;
                is_need_edit: boolean;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                title: string;
                type: string;
                placeholder: string;
                placeholder_html: string;
                input_type: string;
                maxlength: number;
                info: string;
                name: string;
                value: string;
                value_list: never[];
            };
        };
        select: {
            default: {
                need_random_value: boolean;
                is_need_edit: boolean;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                title: string;
                type: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                select_type: string;
                options: never[];
                info: string;
                name: string;
                value_list: never[];
            };
            select_human: {
                is_need_edit: boolean;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                title: string;
                type: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                info: string;
                name: string;
                value_list: never[];
            };
            select_voice: {
                is_need_edit: boolean;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                title: string;
                type: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                info: string;
                name: string;
                value_list: never[];
            };
            select_subscribe: {
                is_need_edit: boolean;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                title: string;
                type: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                info: string;
                name: string;
                value_list: never[];
            };
            select_task: {
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                is_need_edit: boolean;
                title: string;
                type: string;
                placeholder: string;
                placeholder_html: string;
                html: string;
                info: string;
                name: string;
                value: string;
                value_list: never[];
            };
        };
        picker_view: {
            default: {
                need_random_value: boolean;
                is_need_edit: boolean;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                title: string;
                type: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                options: never[];
                info: string;
                name: string;
                value_list: never[];
            };
            picker_and_input: {
                need_random_value: boolean;
                is_need_edit: boolean;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                title: string;
                type: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                options: never[];
                info: string;
                name: string;
                value_list: never[];
            };
        };
        choose_message: {
            default: {
                is_need_edit: boolean;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                title: string;
                type: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                info: string;
                name: string;
                value_list: never[];
            };
        };
        choose_photo: {
            default: {
                is_need_edit: boolean;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                title: string;
                type: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                info: string;
                name: string;
                value_list: never[];
            };
        };
    };
    task_list: TaskTemplate[];
    constructor(options?: {
        task_list?: TaskTemplate[];
    });
    static get_task_status_map(): {
        '-1': string;
        '0': string;
        '1': string;
        '2': string;
        '3': string;
    };
    static get_dom_value(origin_dom: DomItem): any;
    static get_dom_format_value(origin_dom: DomItem): any;
    static get_dom(key: string, n_dom: Record<string, any>, sub_key?: string): typeof TaskClient | {
        required: boolean;
        show_title_bar: boolean;
        show_title: boolean;
        need_random_value: boolean;
        is_need_edit: boolean;
        type: string;
        html: string;
        title: string;
        info: string;
        name: string;
        value: string;
        value_list: never[];
        placeholder: string;
        placeholder_html: string;
    } | {
        need_random_value: boolean;
        is_need_edit: boolean;
        required: boolean;
        show_title_bar: boolean;
        show_title: boolean;
        title: string;
        type: string;
        placeholder: string;
        placeholder_html: string;
        input_type: string;
        maxlength: number;
        info: string;
        name: string;
        value: string;
        value_list: never[];
    } | {
        is_need_edit: boolean;
        required: boolean;
        show_title_bar: boolean;
        show_title: boolean;
        need_random_value: boolean;
        title: string;
        type: string;
        value: null;
        placeholder: string;
        placeholder_html: string;
        info: string;
        name: string;
        value_list: never[];
    };
    get_new_task(): {
        name: string;
        key: string;
        task_status: string;
        dom_list: never[];
        ai_config: {
            message_list: never[];
        };
        show_action_btn: boolean;
        action_btn: string;
        next_task_key: string;
    };
    set_next_task(task: TaskTemplate | null, task_key: string, next_task: string): void;
    get_next_task(task: TaskTemplate | null, task_key: string): TaskTemplate | null;
    get_task_list(): TaskTemplate[];
    creat_task_list(task_key?: string): this;
    add_task_list_item(): this;
    get_task_list_item(task_key: string): TaskTemplate | null;
    get_task_list_index(task_key: string): number;
    get_last_task_list_idx(): number;
    get_last_task_list_item(): TaskTemplate;
    set_task_list_item(idx: number, key: string, value: any): void;
    edit_task_list_item(idx: number, task_option: Partial<TaskTemplate>): this;
    add_next(task_option: TaskTemplate): this;
    get_next(last_task_key: string): TaskTemplate | null;
}
export default TaskClient;
