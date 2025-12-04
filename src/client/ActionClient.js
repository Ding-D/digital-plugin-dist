import util from '../utils';
class ActionClient {
    constructor() { }
    static checkIsActionKey(key) {
        const reg = new RegExp(`(${ActionClient.ACTIONS_MAP_KEY_LIST.join('|')})`);
        return reg.test(key);
    }
    static checkIsActionValue(value) {
        return !!ActionClient.ACTIONS_MAP_VALUE_LIST.find(item => item.indexOf(value) !== -1 || value.indexOf(item) !== -1);
    }
    static getTargetAction(key, val) {
        if (key)
            return util.deepClone(ActionClient.ACTIONS[key]);
        const isValue = ActionClient.checkIsActionValue(val);
        if (isValue) {
            const actionsKey = ActionClient.ACTIONS_MAP_KEY_LIST[ActionClient.ACTIONS_MAP_VALUE_LIST.findIndex(item => item.indexOf(val) !== -1 || val.indexOf(item) !== -1)];
            return util.deepClone(ActionClient.ACTIONS[actionsKey]);
        }
        const isKey = this.checkIsActionKey(val);
        if (isKey) {
            return util.deepClone(ActionClient.ACTIONS[val]);
        }
        return false;
    }
    runAction(linkEvent) {
        const val = linkEvent.innerText;
        const key = linkEvent[ActionClient.ACTION_KEY];
        const action = ActionClient.getTargetAction(key, val);
        if (action) {
            const actionTypeMap = {
                // 固定函数写法, 解决this指向问题
                uni: (action) => {
                    const { command, options } = action;
                    uni[command](action.handleOptions ? action.handleOptions(linkEvent) : options);
                },
                vue: (action) => {
                    const { command, options } = action;
                    let api = this;
                    const loopCommand = (commands) => {
                        const list = commands.split('.');
                        const first_command = list.shift();
                        api = api[first_command];
                        if (list.length) {
                            loopCommand(list.join('.'));
                        }
                    };
                    loopCommand(command);
                    if (typeof api === 'function') {
                        api(action.handleOptions ? action.handleOptions(linkEvent) : options);
                    }
                    else {
                        console.error('action_key to method, is not a function', options);
                    }
                }
            };
            const actionType = action.type;
            if (actionTypeMap[actionType]) {
                actionTypeMap[actionType].call(this, action);
            }
        }
    }
}
ActionClient.ACTION_KEY = 'action_key'; // 行为key
// 增加action后，需要执行下面几步
// 1. 在actionsMap中添加key和value
// 2. 在actions中添加key和value
// 3. 在ActionMpHtml中增加method
ActionClient.ACTIONS_MAP = {
    copy_text: '复制文本',
    turn_to: '跳转页面',
    to_copywriting: '前往智能成片',
    send_message: '发送消息',
    save_video: '保存视频',
    save_photo: '保存视频',
    run_bot_next_task: '继续任务',
    run_bot_end_task: '开始工作',
    run_workflow_end_task: '开始工作',
    show_toast: '显示提示',
    show_login_popup: '登录',
    create_subscribe: '订阅制作',
    navigate_to: '跳转页面'
};
ActionClient.ACTIONS_MAP_KEY_LIST = Object.keys(ActionClient.ACTIONS_MAP);
ActionClient.ACTIONS_MAP_VALUE_LIST = Object.values(ActionClient.ACTIONS_MAP);
/**
 * 行为映射
 *
 * @key name: 行为名称
 * @key type: 行为类型 uni: uni-app内置行为 vue: vue行为
 * @key command: 行为事件
 * @key attrs: 行为所需参数
 * @key options: 行为事件触发时，传递的参数
 * @key handleOptions: 动态获取行为事件触发时，传递的参数
 */
ActionClient.ACTIONS = {
    copy_text: {
        name: ActionClient.ACTIONS_MAP.copy_text,
        type: 'uni',
        command: 'setClipboardData',
        attrs: ['data-text', 'data-toast_title'],
        handleOptions(linkEvent) {
            return {
                data: linkEvent['data-text'],
                success: () => linkEvent['data-toast_title'] &&
                    uni.showToast({
                        title: linkEvent['data-toast_title']
                    })
            };
        }
    },
    to_copywriting: {
        name: ActionClient.ACTIONS_MAP.to_copywriting,
        type: 'uni',
        command: 'navigateTo',
        attrs: ['data-url'],
        options: {
            // 调用uni 或者 ActionMpHtml组件中方法时的参数
            url: '/pages_dcenter/freeCreation/creations/copywriting'
        }
    },
    turn_to: {
        name: ActionClient.ACTIONS_MAP.turn_to,
        type: 'uni',
        command: 'navigateTo',
        attrs: ['data-url'],
        handleOptions(linkEvent) {
            return {
                url: linkEvent['data-url']
            };
        }
    },
    save_video: {
        name: ActionClient.ACTIONS_MAP.save_video,
        // nameReg: /保存视频:(\S+)/,
        type: 'vue',
        command: 'save_video',
        attrs: ['href'],
        options: {},
        // 调用uni 或者 ActionMpHtml组件中方法 或者 $util中方法 时的传递的参数
        // 此方法有更高的自由度，如果有了handleOptions,则优先使用handleOptions返回的对象
        // 此时options就无需定义
        handleOptions(linkEvent) {
            return {
                filePath: linkEvent.href,
                saveMediaToPhotosAlbumOptions: ActionClient.ACTIONS.save_video.options
            };
        }
    },
    save_photo: {
        name: ActionClient.ACTIONS_MAP.save_photo,
        // nameReg: /保存视频:(\S+)/,
        type: 'vue',
        command: 'save_photo',
        attrs: ['href'],
        options: {},
        // 调用uni 或者 ActionMpHtml组件中方法 或者 $util中方法 时的传递的参数
        // 此方法有更高的自由度，如果有了handleOptions,则优先使用handleOptions返回的对象
        // 此时options就无需定义
        handleOptions(linkEvent) {
            return {
                filePath: linkEvent.href,
                saveMediaToPhotosAlbumOptions: ActionClient.ACTIONS.save_photo.options
            };
        }
    },
    send_message: {
        name: ActionClient.ACTIONS_MAP.send_message,
        type: 'vue',
        command: 'sendMessage',
        attrs: ['data-content'],
        handleOptions(linkEvent) {
            return util.cozeUtil.return_additional_messages(linkEvent['data-content']);
        }
    },
    run_bot_next_task: {
        name: ActionClient.ACTIONS_MAP.run_bot_next_task,
        type: 'vue',
        command: 'run_bot_next_task',
        attrs: ['data-next_task_key', 'data-user_content'],
        handleOptions(linkEvent) {
            return {
                next_task_key: linkEvent['data-next_task_key'],
                user_content: linkEvent['data-user_content']
            };
        }
    },
    run_bot_end_task: {
        name: ActionClient.ACTIONS_MAP.run_bot_end_task,
        type: 'vue',
        command: 'run_bot_end_task',
        attrs: ['data-split_task_limit'],
        handleOptions(linkEvent) {
            let split_task_limit = Number(linkEvent['data-split_task_limit']);
            if (isNaN(split_task_limit)) {
                split_task_limit = 0;
            }
            return {
                // 向上截取任务限制， 用于获取（向上获取role为assistant的message）message_list中task下的dom_list
                // 类型：number
                split_task_limit
            };
        }
    },
    run_workflow_end_task: {
        name: ActionClient.ACTIONS_MAP.run_workflow_end_task,
        type: 'vue',
        command: 'run_workflow_end_task',
        attrs: ['data-split_task_limit'],
        handleOptions(linkEvent) {
            let split_task_limit = Number(linkEvent['data-split_task_limit']);
            if (isNaN(split_task_limit)) {
                split_task_limit = 0;
            }
            return {
                // 向上截取任务限制， 用于获取（向上获取role为assistant的message）message_list中task下的dom_list
                // 类型：number
                split_task_limit
            };
        }
    },
    show_toast: {
        name: ActionClient.ACTIONS_MAP.show_toast,
        type: 'vue',
        command: '$util.toast',
        attrs: ['data-content'],
        handleOptions(linkEvent) {
            return {
                content: linkEvent['data-content']
            };
        }
    },
    show_login_popup: {
        name: ActionClient.ACTIONS_MAP.show_login_popup,
        type: 'vue',
        command: 'show_login_popup',
        attrs: [],
        options: {}
    },
    create_subscribe: {
        name: ActionClient.ACTIONS_MAP.create_subscribe,
        type: 'vue',
        command: 'create_subscribe',
        attrs: ['data-split_task_limit'],
        handleOptions(linkEvent) {
            return {
                split_task_limit: linkEvent['data-split_task_limit']
            };
        }
    }
};
export default ActionClient;
