const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: { projects: true },
        },
      },
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

// GET /users/:id/projects
exports.getProjectsByUser = async (req, res) => {
  const userId = +req.params.id;

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      include: { tasks: true },
    });

    res.json(projects);
  } catch (error) {
    console.log(error);
  }
};

// GET /users/:id/name
exports.getUserName = async (req, res) => {
  const userId = +req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.name);
  } catch (e) {
    console.log(e);
  }
};

// POST /users
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    const updateData = { name, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: +id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Prevent like user khd to na kry
    if (req.user.id === +id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await prisma.user.delete({ where: { id: +id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.log(error);
  }
};
