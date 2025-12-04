import util from '../utils';
import ActionClient from './ActionClient';
import { img_choose_photo_dom, p_bot_task_placeholder_html } from '../config/dom-template';
class TaskClient {
    constructor(options = {}) {
        this.task_list = [];
        const { task_list = [] } = options;
        this.task_list = task_list;
    }
    static get_task_status_map() {
        return util.deepClone(this.task_status_map);
    }
    // 获取当前dom的value值
    static get_dom_value(origin_dom) {
        if (!origin_dom)
            return '';
        const formatMap = {
            default: dom => dom.value,
            input: dom => dom.value,
            textarea: dom => dom.value,
            select: dom => !util.isEmpty(dom.value) && Array.isArray(dom.value)
                ? dom.value.join?.(',') || ''
                : dom.value,
            select_human: dom => (dom.value ? dom.value.id || '' : ''),
            select_voice: dom => (dom.value ? dom.value.voice || '' : ''),
            select_subscribe: dom => (dom.value ? dom.value.id || '' : ''),
            picker_view: dom => !util.isEmpty(dom.value) && Array.isArray(dom.value)
                ? dom.value.length > 1
                    ? dom.value
                        .map((item, idx) => dom.options[idx][item].value)
                        .join('，')
                    : dom.value
                        .map((item) => dom.options[item].value)
                        .join('，')
                : dom.value
        };
        const value = (formatMap[origin_dom.type] || formatMap.default)(origin_dom);
        return value;
    }
    // 获取当前dom的value值的格式化值 用于展示
    static get_dom_format_value(origin_dom) {
        if (!origin_dom)
            return '';
        const formatMap = {
            default: dom => dom.value,
            input: dom => dom.value,
            textarea: dom => dom.value,
            select: dom => dom.options?.find((item) => item.value == dom.value)
                ?.label,
            select_human: dom => (dom.value ? dom.value.title || '' : ''),
            select_voice: dom => (dom.value ? dom.value.title || '' : ''),
            select_subscribe: dom => dom.value ? dom.value.author || '' : '',
            picker_view: dom => !util.isEmpty(dom.value) && Array.isArray(dom.value)
                ? dom.value.length > 1
                    ? dom.value
                        .map((item, idx) => dom.options[idx][item].label)
                        .join('，')
                    : dom.value
                        .map((item) => dom.options[item].label)
                        .join('，')
                : '',
            choose_photo: dom => !util.isEmpty(dom.value) && Array.isArray(dom.value)
                ? dom.value.length > 0
                    ? dom.value
                        .map((item, idx) => img_choose_photo_dom({ src: item }))
                        .join('\n\n')
                    : ''
                : img_choose_photo_dom({ src: dom.value })
        };
        return (formatMap[origin_dom.type] || formatMap.default)(origin_dom);
    }
    static get_new_default_dom(key, n_dom, sub_key = 'default') {
        if (!n_dom)
            return this;
        const n_dom_entries = Object.entries(n_dom);
        if (!n_dom_entries.length)
            return this;
        const originalDom = TaskClient.dom_map[key]?.[sub_key];
        if (!originalDom)
            return this;
        // 创建深拷贝以避免共享引用
        const dom = util.deepClone(originalDom);
        n_dom_entries.forEach(([dom_key, value]) => {
            if (Object.keys(dom).includes(dom_key))
                dom[dom_key] = value;
        });
        return dom;
    }
    random_update_dom_value(dom) {
        if (dom.need_random_value === false)
            return dom;
        const value_list = dom.value_list || [];
        if (!value_list.length)
            return dom;
        dom.value = value_list[Math.floor(Math.random() * value_list.length)];
        return dom;
    }
    random_update_dom_list(dom_list) {
        dom_list.forEach(dom => {
            this.random_update_dom_value(dom);
        });
        return dom_list;
    }
    get_task(task_key) {
        return this[task_key];
    }
    get_new_task() {
        const task = util.deepClone(TaskClient.task_template);
        return task;
    }
    set_next_task(task, task_key, next_task) {
        if (task) {
            task.next_task = next_task;
        }
        else {
            const foundTask = this.get_task_list_item(task_key);
            if (foundTask) {
                foundTask.next_task = next_task;
            }
        }
    }
    get_next_task(task, task_key) {
        const currentTask = task || this.get_task_list_item(task_key);
        if (!currentTask || !currentTask.next_task)
            return null;
        return this.get_task_list_item(currentTask.next_task) || null;
    }
    get_task_list() {
        return this.task_list;
    }
    creat_task_list(task_key) {
        this.task_list = [];
        if (task_key)
            this.add_task_list_item();
        return this;
    }
    add_task_list_item() {
        const task = this.get_new_task();
        if (task)
            this.task_list.push(task);
        return this;
    }
    get_task_list_item(task_key) {
        return this.task_list.find(item => item.key === task_key) || null;
    }
    get_task_list_index(task_key) {
        return this.task_list.findIndex(item => item.key === task_key);
    }
    get_last_task_list_idx() {
        const len = this.task_list.length;
        return len - 1;
    }
    get_last_task_list_item() {
        return this.task_list[this.get_last_task_list_idx()] || null;
    }
    set_task_list_item(idx, key, value) {
        this.task_list[idx][key] = value;
    }
    edit_task_list_item(idx, task_option) {
        if (idx === undefined || idx === null || idx < 0)
            return this;
        if (!task_option)
            return this;
        const task_option_entries = Object.entries(task_option);
        if (!task_option_entries.length)
            return this;
        const task = this.task_list[idx] || null;
        if (!task)
            return this;
        task_option_entries.forEach(([key, value]) => {
            if (Object.keys(task).includes(key))
                this.set_task_list_item(idx, key, value);
        });
        return this;
    }
    add_next(task_option) {
        if (this.get_last_task_list_idx() > -1)
            this.edit_task_list_item(this.get_last_task_list_idx(), {
                next_task: task_option.key
            });
        this.add_task_list_item();
        if (task_option)
            this.edit_task_list_item(this.get_last_task_list_idx(), task_option);
        return this;
    }
    get_next(last_task_key) {
        const task = this.get_task_list_item(last_task_key);
        if (!task || !task.next_task)
            return null;
        const next_task = this.get_task_list_item(task.next_task);
        return next_task;
    }
}
TaskClient.task_status_map = {
    '-1': '未开始',
    '0': '待开始',
    '1': '进行中',
    '2': '待完成',
    '3': '已完成'
};
TaskClient.task_template = {
    name: '任务名称',
    key: '', // 任务标识
    task_status: '0', // 任务状态 -1:未开始 0:待开始（对应开始节点） 1:进行中（对应中间节点） 2:待完成（对应结束节点）
    dom_list: [], // dom列表
    ai_config: {
        message_list: []
    },
    show_next_btn: true, // 显示下一个任务文本
    next_btn: `<a ${ActionClient.ACTION_KEY}='run_bot_next_task' data-next_task_key='next_task_key'>继续</a>`, // 下一个任务文本 也可更改为开始按钮
    next_task_key: '' // 下一个任务
};
TaskClient.dom_map = {
    text: {
        default: {
            title: '标题',
            info: '', // 描述
            value: '',
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            need_random_value: false, // 是否需要随机补充value值
            is_need_edit: false // 是否需要编辑
        }
    },
    textarea: {
        default: {
            type: 'textarea',
            input_type: 'text',
            info: '', // 任务描述
            name: '', // 表单name
            title: '标题',
            value: '',
            placeholder: '请输入',
            placeholder_html: p_bot_task_placeholder_html('请输入'),
            value_list: [], // value 的可选列表  常用于随机补充value值
            maxlength: 500, // 最大长度 0为不限制
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            need_random_value: true, // 是否需要随机补充value值
            is_need_edit: true // 是否需要编辑
        }
    },
    select: {
        default: {
            title: '标题',
            type: 'select',
            info: '', // 任务描述
            select_type: 'single', // 选择类型 单选 single 多选 multiple
            name: '', // 表单name
            options: [], // 选择列表
            value: null, // 数组或者字符串  默认null
            value_list: [], // value 的可选列表  常用于随机补充value值
            placeholder: '请选择',
            placeholder_html: p_bot_task_placeholder_html('请选择'),
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            need_random_value: true, // 是否需要随机补充value值
            is_need_edit: true // 是否需要编辑
        },
        select_human: {
            title: '选择形象',
            type: 'select_human',
            name: '', // 表单name
            value: null, // object 当选形象数据  默认null
            placeholder: '请选择',
            placeholder_html: p_bot_task_placeholder_html('请选择'),
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            is_need_edit: true // 是否需要编辑
        },
        select_voice: {
            title: '选择声音',
            type: 'select_voice',
            name: '', // 表单name
            value: null, // object 当选声音数据  默认null
            placeholder: '请选择',
            placeholder_html: p_bot_task_placeholder_html('请选择'),
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            is_need_edit: true // 是否需要编辑
        },
        select_subscribe: {
            title: '选择订阅',
            type: 'select_subscribe',
            name: '', // 表单name
            value: null, // object 当选订阅数据  默认null
            placeholder: '请选择',
            placeholder_html: p_bot_task_placeholder_html('请选择'),
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            is_need_edit: true // 是否需要编辑
        },
        select_task: {
            title: '标题',
            type: 'select_task',
            info: '', // 任务描述
            name: '', // 表单name
            options: [], // 选择列表
            value: null, // 数组或者字符串  默认null
            placeholder: '请选择工作指令',
            placeholder_html: p_bot_task_placeholder_html('请选择工作指令'),
            html: `<p>
          <a>任务1</a>
          <br/>
          <a>任务2</a>
        </p>`, // 选择任务的html
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            need_random_value: false, // 是否需要随机补充value值
            is_need_edit: false // 是否需要编辑
        }
    },
    picker_view: {
        default: {
            title: '标题',
            type: 'picker_view',
            info: '', // 任务描述
            name: '', // 表单name
            options: [], // 选择列表
            value: null, // 数组或者字符串  默认null
            value_list: [], // value 的可选列表  常用于随机补充value值
            placeholder: '请选择',
            placeholder_html: p_bot_task_placeholder_html('请选择'),
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            need_random_value: true, // 是否需要随机补充value值
            is_need_edit: true // 是否需要编辑
        }
    },
    choose_message: {
        default: {
            title: '标题',
            type: 'choose_message',
            info: '', // 任务描述
            name: '', // 表单name
            value: null, // 数组
            placeholder: '请选择聊天内容',
            placeholder_html: p_bot_task_placeholder_html('请选择聊天内容'),
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            need_random_value: false, // 是否需要随机补充value值
            is_need_edit: true // 是否需要编辑
        }
    },
    choose_photo: {
        default: {
            title: '标题',
            type: 'choose_photo',
            info: '', // 任务描述
            name: '', // 表单name
            value: null, // 数组
            placeholder: '请选择图片',
            placeholder_html: p_bot_task_placeholder_html('请选择图片'),
            required: false, // 是否必填
            show_title_bar: true, // 是否显示标题栏
            show_title: true, // 是否显示标题
            need_random_value: false, // 是否需要随机补充value值
            is_need_edit: true // 是否需要编辑
        }
    }
};
export default TaskClient;
