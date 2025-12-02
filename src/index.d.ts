import CozeClient from './client/CozeClient';
import ActionClient from './client/ActionClient';
declare class DititalWorker {
    static ActionClient: typeof ActionClient;
    static CozeClient: typeof CozeClient;
    static utils: import("./types").Utils;
}
export default DititalWorker;
