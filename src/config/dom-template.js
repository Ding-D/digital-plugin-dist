import ActionClient from '../client/ActionClient';
const ACTION_KEY = ActionClient.ACTION_KEY;
// 命名规则 ：组件名_组件位置_组件作用
// a标签区域
export const a_bot_task_start = (options = {}) => {
    const { split_task_limit, text = '开始工作' } = options;
    return `<p class='align-center' style='display: flex;'>
  <a ${ACTION_KEY}='run_bot_end_task' data-split_task_limit='${split_task_limit}' class='flex-1 h-80 leading-80 bg-primary text-28 text-center text-white rounded-10'>${text}</a>
  </p>`;
};
export const a_workflow_task_start = (options = {}) => {
    const { split_task_limit = '1', text = '开始工作' } = options;
    return `<p class='align-center' style='display: flex;'>
  <a ${ACTION_KEY}='run_workflow_end_task' data-split_task_limit='${split_task_limit}' class='flex-1 h-80 leading-80 bg-primary text-28 text-center text-white rounded-10'>${text}</a>
  </p>`;
};
export const a_bot_task_next = (options = {}) => {
    const { next_task_key, user_content, text } = options;
    const a_class = 'flex-1 h-80 leading-80 bg-primary text-white text-center text-28 rounded-10';
    return `<a ${ACTION_KEY}='run_bot_next_task' data-next_task_key='${next_task_key}' data-user_content='${user_content}' class='${a_class}'>${text}</a>`;
};
export const a_bot_turn_to = (options = {}) => {
    const { text = '按钮名称', url = '' } = options;
    return `<a ${ACTION_KEY}='turn_to' data-url='${url}' class='flex-1 h-80 leading-80 bg-primary text-28 text-center text-white rounded-10'>${text}</a>`;
};
export const a_create_subscribe = (options = {}) => {
    const { text = '订阅制作', split_task_limit = 1 } = options;
    return `<p class='align-center' style='display: flex;'><a ${ACTION_KEY}='create_subscribe' data-split_task_limit='${split_task_limit}' class='flex-1 h-80 leading-80 bg-primary text-28 text-center text-white rounded-10'>${text}</a></p>`;
};
// p标签区域
export const p_bot_task_placeholder_html = (text) => {
    return `<p class='text-info'>${text}</p>`;
};
// box区域
export const box_bot_task_choose = (options = {}) => {
    const { text = '', next_task_key = '2', user_content = '开始工作' } = options;
    return `<p class='align-center justify-around gap-20' style='display: flex;'>${a_bot_task_next({ text, next_task_key, user_content })}</p>`;
};
export const box_bot_task_choose_2 = (options = {}) => {
    const { text_1 = '', next_task_key_1 = '2', user_content_1 = '开始工作1', text_2 = '', next_task_key_2 = '3', user_content_2 = '开始工作2' } = options;
    const a_class = 'flex-1 h-80 leading-80 bg-primary text-white text-center text-28 rounded-10';
    return `<p class='align-center justify-around gap-20' style='display: flex;'>
            ${a_bot_task_next({ text: text_1, next_task_key: next_task_key_1, user_content: user_content_1 })}
            ${a_bot_task_next({ text: text_2, next_task_key: next_task_key_2, user_content: user_content_2 })}
        </p>`;
};
export const box_bot_turn_to_2 = (options = {}) => {
    const { text_1 = '跳转按钮1', url_1 = '', text_2 = '跳转按钮1', url_2 = '' } = options;
    return `<p class='align-center justify-around gap-20' style='display: flex;'>
            ${a_bot_turn_to({ text: text_1, url: url_1 })}
            ${a_bot_turn_to({ text: text_2, url: url_2 })}
        </p>`;
};
export const box_bot_turn_and_choose = (options = {}) => {
    const { text_1 = '跳转按钮1', url_1 = '', text_2 = '', next_task_key_2 = '2', user_content_2 = '开始工作2' } = options;
    return `<p class='align-center justify-around gap-20' style='display: flex;'>
            ${a_bot_turn_to({ text: text_1, url: url_1 })}
            ${a_bot_task_next({ text: text_2, next_task_key: next_task_key_2, user_content: user_content_2 })}
        </p>`;
};
// img 区域
export function img_choose_photo_dom(options = {}) {
    const { src = '', alt = '' } = options;
    return `<img src='${src}' alt='${alt}' style='object-fix:contain;' />`;
}
