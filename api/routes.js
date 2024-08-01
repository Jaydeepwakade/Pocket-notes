const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connectDb = async () => {
  try {
    await mongoose.connect('mongodb+srv://jaydeepwakade123:LKsXyA6Ba6tBXltT@notesdb.zxbtxvu.mongodb.net/?retryWrites=true&w=majority&appName=notesdb');
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

const NoteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Note = mongoose.model('Note', NoteSchema);

const NoteGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
}, {
  versionKey: false
});
const NoteGroup = mongoose.model('NoteGroup', NoteGroupSchema);

app.post('/note-groups', async (req, res) => {
  try {
    const newGroup = new NoteGroup(req.body);
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/note-groups', async (req, res) => {
  try {
    const groups = await NoteGroup.find().populate('notes');
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/note-groups/:id/notes', async (req, res) => {
  try {
    const { content, createdBy } = req.body;
    const newNote = new Note({
      content,
      createdBy
    });
    const savedNote = await newNote.save();

    const noteGroup = await NoteGroup.findById(req.params.id);
    if (!noteGroup) {
      return res.status(404).json({ error: "NoteGroup not found" });
    }
    noteGroup.notes.push(savedNote._id);
    await noteGroup.save();

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/note-groups/:id/notes', async (req, res) => {
  try {
    const noteGroup = await NoteGroup.findById(req.params.id).populate('notes');
    if (!noteGroup) {
      return res.status(404).json({ error: "NoteGroup not found" });
    }
    res.status(200).json(noteGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
