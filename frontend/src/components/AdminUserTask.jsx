import Button from './Button';

export default function AdminUserTask({ project, taskEdits, setTaskEdits, updateTaskMutation, deleteTaskMutation }) {
  return (
    <ul className='space-y-2 mt-3 pl-4 border-t pt-3'>
      {project.tasks.map((task) => (
        <li
          key={task.id}
          className='flex justify-between items-center'>
          <input
            type='text'
            value={taskEdits[task.id]?.content ?? task.content}
            onChange={(e) =>
              setTaskEdits((prev) => ({
                ...prev,
                [task.id]: {
                  content: e.target.value,
                  status: task.status,
                },
              }))
            }
            className='flex-1 border p-1 rounded mr-2'
          />
          <select
            value={taskEdits[task.id]?.status ?? task.status}
            onChange={(e) =>
              setTaskEdits((prev) => ({
                ...prev,
                [task.id]: {
                  content: taskEdits[task.id]?.content ?? task.content,
                  status: e.target.value,
                },
              }))
            }
            className='p-1 rounded border mr-2'>
            <option value='incomplete'>Incomplete</option>
            <option value='complete'>Complete</option>
          </select>
          <div className='flex gap-3'>
            <Button
              label='Save'
              color='bg-green-600'
              hoverColor={'bg-green-700'}
              onClick={() =>
                updateTaskMutation.mutate({
                  id: task.id,
                  content: taskEdits[task.id]?.content ?? task.content,
                  status: taskEdits[task.id]?.status ?? task.status,
                })
              }
            />
            <Button
              label='Delete'
              color='bg-red-500'
              hoverColor={'bg-red-700'}
              onClick={() => deleteTaskMutation.mutate(task.id)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
