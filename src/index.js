import CozeClient from './client/CozeClient';
import ActionClient from './client/ActionClient';
import TaskClient from './client/TaskClient';
import utils from './utils';
class DititalWorker {
}
DititalWorker.ActionClient = ActionClient;
DititalWorker.CozeClient = CozeClient;
DititalWorker.TaskClient = TaskClient;
DititalWorker.utils = utils;
export default DititalWorker;
