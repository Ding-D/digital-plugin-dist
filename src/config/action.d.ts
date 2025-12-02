import type { LinkEvent } from '../types';
export declare const ACTION_KEY = "action_key";
export declare const actionsMap: {
    copy_text: string;
    turn_to: string;
    to_copywriting: string;
    send_message: string;
    save_video: string;
    save_photo: string;
    run_bot_next_task: string;
    run_bot_end_task: string;
    run_workflow_end_task: string;
    show_toast: string;
    show_login_popup: string;
    create_subscribe: string;
};
export declare function getTargetAction(key: string | undefined, val: string): any;
export declare function runAction(linkEvent: LinkEvent): void;
