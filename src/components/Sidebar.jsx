import React, { useState, useEffect } from "react";
import "../styles/Sidebar.css";
import Loader from "./Loader"; // Ensure this path is correct

const Sidebar = ({
  setNoteActive,
  setSelectedNote,
  selectedNote,
  isPhone,
  display,
  setDisplay,
  NoteActive,
}) => {
  const [noteGroups, setNoteGroups] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  const fetchNoteGroups = async () => {
    // setLoading(true); // Show loader
    try {
      const response = await fetch("http://localhost:5000/note-groups");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNoteGroups(data);
      setError(null); 
    } catch (error) {
      setError(error.message); 
      console.error("Error fetching note groups:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchNoteGroups();

    const intervalId = setInterval(fetchNoteGroups, 5000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Clean up polling on unmount
  }, [NoteActive]);

  const handleSelect = (note) => {
    if (isPhone) {
      setDisplay(true);
    }
    console.log(note)
    setSelectedNote(note);
  };

  return (
    <div
      className="sidebar"
      style={{ display: isPhone && display ? "none" : "" }}
    >
      <div className="sidebarHeading">
        <p className="sidebarTitle">Pocket Notes</p>
      </div>
      <div className="sidebarNotesList">
        {loading ? (
          <Loader /> // Show loader while fetching
        ) : error ? (
          <p>Error loading note groups: {error}</p> // Show error message if any
        ) : noteGroups.length > 0 ? (
          <div className="notesList">
            {noteGroups.map((note, index) => {
              console.log("IDDDD",note._id)
              const notes = note.name.split(" ");
              const firstLetters = notes.map((word) => word.charAt(0));
              return (
                <div
                  className={`noteElement flex flex-row justify-start ${
                    note._id === selectedNote?._id ? "selectedNote" : ""
                  }`}
                  key={index}
                  onClick={() => handleSelect(note)}
                >
                  <div
                    className="ellipse listIcon flex"
                    style={{ marginRight: "0.5rem", backgroundColor: note.color }}
                  >
                    {firstLetters[0]}
                    {firstLetters[firstLetters.length - 1]}
                  </div>
                  <p>{note.name}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No note groups available</p>
        )}
        <button className="createNotes ellipse" onClick={() => setNoteActive(true)}>
          +
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
