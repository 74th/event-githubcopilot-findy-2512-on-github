import { useEffect, useState } from "react";

import * as api from "./api/task";
import { Task } from "./entity/task";
import { NewTaskForm } from "./views/newTask";
import { ListTaskView } from "./views/taskList";

function App() {
    const [taskList, setTasks] = useState<Task[]>([]);

    async function reloadTasks() {
        const tasks = await api.loadTasks();
        setTasks(tasks);
    }

    useEffect(() => {
        reloadTasks();
    }, []);

    return (
        <div className="container">
            <NewTaskForm reloadTasks={reloadTasks} />
            <ListTaskView taskList={taskList} reloadTasks={reloadTasks} />
        </div>
    );
}

export default App;
