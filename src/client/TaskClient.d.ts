import type { TaskTemplate, DomItem } from '../types';
declare class AI_Task {
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
        show_next_btn: boolean;
        next_btn: string;
        next_task_key: string;
    };
    static dom_map: {
        text: {
            default: {
                title: string;
                info: string;
                value: string;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                is_need_edit: boolean;
            };
        };
        textarea: {
            default: {
                type: string;
                input_type: string;
                info: string;
                name: string;
                title: string;
                value: string;
                placeholder: string;
                placeholder_html: string;
                value_list: never[];
                maxlength: number;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                is_need_edit: boolean;
            };
        };
        select: {
            default: {
                title: string;
                type: string;
                info: string;
                select_type: string;
                name: string;
                options: never[];
                value: null;
                value_list: never[];
                placeholder: string;
                placeholder_html: string;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                is_need_edit: boolean;
            };
            select_human: {
                title: string;
                type: string;
                name: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                is_need_edit: boolean;
            };
            select_voice: {
                title: string;
                type: string;
                name: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                is_need_edit: boolean;
            };
            select_subscribe: {
                title: string;
                type: string;
                name: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                is_need_edit: boolean;
            };
            select_task: {
                title: string;
                type: string;
                info: string;
                name: string;
                options: never[];
                value: null;
                placeholder: string;
                placeholder_html: string;
                html: string;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                is_need_edit: boolean;
            };
        };
        picker_view: {
            default: {
                title: string;
                type: string;
                info: string;
                name: string;
                options: never[];
                value: null;
                value_list: never[];
                placeholder: string;
                placeholder_html: string;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                is_need_edit: boolean;
            };
        };
        choose_message: {
            default: {
                title: string;
                type: string;
                info: string;
                name: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                is_need_edit: boolean;
            };
        };
        choose_photo: {
            default: {
                title: string;
                type: string;
                info: string;
                name: string;
                value: null;
                placeholder: string;
                placeholder_html: string;
                required: boolean;
                show_title_bar: boolean;
                show_title: boolean;
                need_random_value: boolean;
                is_need_edit: boolean;
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
    static get_new_default_dom(key: string, n_dom: Record<string, any>, sub_key?: string): typeof AI_Task | {
        title: string;
        info: string;
        value: string;
        required: boolean;
        show_title_bar: boolean;
        show_title: boolean;
        need_random_value: boolean;
        is_need_edit: boolean;
    } | {
        title: string;
        type: string;
        info: string;
        name: string;
        value: null;
        placeholder: string;
        placeholder_html: string;
        required: boolean;
        show_title_bar: boolean;
        show_title: boolean;
        need_random_value: boolean;
        is_need_edit: boolean;
    };
    random_update_dom_value(dom: DomItem): DomItem;
    random_update_dom_list(dom_list: DomItem[]): DomItem[];
    get_task(task_key: string): TaskTemplate[] | ((dom: DomItem) => DomItem) | ((dom_list: DomItem[]) => DomItem[]) | ((task_key: string) => TaskTemplate[] | ((dom: DomItem) => DomItem) | ((dom_list: DomItem[]) => DomItem[]) | /*elided*/ any | (() => {
        name: string;
        key: string;
        task_status: string;
        dom_list: never[];
        ai_config: {
            message_list: never[];
        };
        show_next_btn: boolean;
        next_btn: string;
        next_task_key: string;
    }) | ((task: TaskTemplate | null, task_key: string, next_task: string) => void) | ((task: TaskTemplate | null, task_key: string) => TaskTemplate | null) | (() => TaskTemplate[]) | ((task_key?: string) => this) | (() => this) | ((task_key: string) => TaskTemplate | null) | ((task_key: string) => number) | (() => number) | (() => TaskTemplate) | ((idx: number, key: string, value: any) => void) | ((idx: number, task_option: Partial<TaskTemplate>) => this) | ((task_option: TaskTemplate) => this) | ((last_task_key: string) => TaskTemplate | null)) | (() => {
        name: string;
        key: string;
        task_status: string;
        dom_list: never[];
        ai_config: {
            message_list: never[];
        };
        show_next_btn: boolean;
        next_btn: string;
        next_task_key: string;
    }) | ((task: TaskTemplate | null, task_key: string, next_task: string) => void) | ((task: TaskTemplate | null, task_key: string) => TaskTemplate | null) | (() => TaskTemplate[]) | ((task_key?: string) => this) | (() => this) | ((task_key: string) => TaskTemplate | null) | ((task_key: string) => number) | (() => number) | (() => TaskTemplate) | ((idx: number, key: string, value: any) => void) | ((idx: number, task_option: Partial<TaskTemplate>) => this) | ((task_option: TaskTemplate) => this) | ((last_task_key: string) => TaskTemplate | null);
    get_new_task(): {
        name: string;
        key: string;
        task_status: string;
        dom_list: never[];
        ai_config: {
            message_list: never[];
        };
        show_next_btn: boolean;
        next_btn: string;
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
export default AI_Task;
