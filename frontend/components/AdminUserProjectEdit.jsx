import Button from './Button';

export default function AdminUserTaskEdit({ project, editProjectTitle, setEditProjectTitle, updateProjectMutation, setEditProjectId }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProjectMutation.mutate({ id: project.id, title: editProjectTitle });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex gap-2 mb-2'>
      <input
        value={editProjectTitle}
        onChange={(e) => setEditProjectTitle(e.target.value)}
        className='border p-2 flex-1 rounded'
      />
      <Button
        label='Save'
        color='bg-green-500'
        hoverColor='bg-green-700'
      />
      <Button
        label={'Cancel'}
        color={'bg-amber-500'}
        hoverColor={'bg-amber-700'}
        onClick={() => setEditProjectId(null)}
      />
    </form>
  );
}
