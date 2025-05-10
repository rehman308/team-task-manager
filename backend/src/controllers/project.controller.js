const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch projects
exports.getProjects = async (req, res) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
    const projects = await prisma.project.findMany({
      where,
      include: { tasks: true },
    });
    res.json(projects);
  } catch (error) {
    console.log(error);
  }
};

// Create project
exports.createProject = async (req, res) => {
  const { title, userId } = req.body;

  try {
    // Only ADMIN can specify userId
    const assignedUserId = req.user.role === 'ADMIN' ? userId : req.user.id;

    const project = await prisma.project.create({
      data: {
        title,
        userId: assignedUserId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const project = await prisma.project.findUnique({ where: { id: +id } });
    if (!project) return res.status(404).json({ message: 'Not found' });

    // Only owner or admin
    if (req.user.role !== 'ADMIN' && project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await prisma.project.update({
      where: { id: +id },
      data: { title },
    });
    res.json(updated);
  } catch (error) {
    console.log(error);
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({ where: { id: +id } });
    if (!project) return res.status(404).json({ message: 'Not found' });

    // Only owner or admin
    if (req.user.role !== 'ADMIN' && project.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.project.delete({ where: { id: +id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.log(error);
  }
};
