const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get tasks for a project
exports.getTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await prisma.project.findUnique({ where: { id: +projectId } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Only admin or project owner
    if (req.user.role !== 'ADMIN' && project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const tasks = await prisma.task.findMany({ where: { projectId: +projectId } });
    res.json(tasks);
  } catch (error) {
    console.log(error);
  }
};

// Create task
exports.createTask = async (req, res) => {
  const { projectId } = req.params;
  const { content, status } = req.body;

  try {
    const project = await prisma.project.findUnique({ where: { id: +projectId } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.user.role !== 'ADMIN' && project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const task = await prisma.task.create({
      data: {
        content,
        status: status || 'incomplete',
        projectId: +projectId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    console.log(error);
  }
};

// Update task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { content, status } = req.body;

  try {
    const task = await prisma.task.findUnique({
      where: { id: +id },
      include: { project: true },
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'ADMIN' && task.project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await prisma.task.update({
      where: { id: +id },
      data: { content, status },
    });
    res.json(updated);
  } catch (error) {
    console.log(error);
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id: +id },
      include: { project: true },
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'ADMIN' && task.project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.task.delete({ where: { id: +id } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.log(error);
  }
};
