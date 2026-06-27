import { Note } from '../types';

const STORAGE_KEY = 'notepad_notes';

export const getNotes = (): Note[] => {
  const notesStr = localStorage.getItem(STORAGE_KEY);
  if (!notesStr) return [];
  try {
    return JSON.parse(notesStr);
  } catch {
    return [];
  }
};

export const saveNote = (note: Note): Note[] => {
  const notes = getNotes();
  const existing = notes.findIndex(n => n.id === note.id);
  if (existing >= 0) {
    notes[existing] = { ...note, updatedAt: new Date().toISOString() };
  } else {
    notes.push(note);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  return notes;
};

export const deleteNote = (id: string): Note[] => {
  const notes = getNotes();
  const updated = notes.filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
