import type { ActionConfig } from '../types';
export default class ActionClient {
    static ACTION_KEY: string;
    static ACTIONS_MAP: Record<string, string>;
    static ACTIONS_MAP_KEY_LIST: string[];
    static ACTIONS_MAP_VALUE_LIST: string[];
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
    static ACTIONS: Record<string, ActionConfig & {
        handleOptions?: (linkEvent: any) => any;
    }>;
    constructor();
    static conbineActionAttrs(attrs: string[], linkEvent: any): Record<string, string>;
    static conbineActionLinkEvent(linkEvent: Record<string, string>): Record<string, string>;
    static checkIsActionKey(key: string): boolean;
    static checkIsActionValue(value: string): boolean;
    static getTargetAction(key: string | undefined, val: string): any;
    runAction(linkEvent: any): {
        action_type: any;
        options: any;
    } | null;
}
