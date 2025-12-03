import CozeClient from './client/CozeClient';
import ActionClient from './client/ActionClient';
import TaskClient from './client/TaskClient';
declare class DititalWorker {
    static ActionClient: typeof ActionClient;
    static CozeClient: typeof CozeClient;
    static TaskClient: typeof TaskClient;
    static utils: import("./types").Utils;
}
export default DititalWorker;
