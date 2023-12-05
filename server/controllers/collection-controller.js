import Collection from "../models/Collection.js";

const createCollection = async (req, res) => {
  try {
    const { title, description, parent, memories, tags } = req.body;

    const newCollection = await Collection.create({
      title,
      description,
      parent,
      memories,
      tags,
    });

    res.status(201).json(newCollection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { createCollection };
