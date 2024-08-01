import React, { useState, useEffect } from "react";
import "../styles/NoteBody.css";
import NoteHeader from "./NoteHeader";
import NoteInputBox from "./NoteInputBox";

const NoteBody = ({ name, color, _id, isPhone, display, setDisplay }) => {
  const [notes, setNotes] = useState([]);
  const [groupId, setGroupId] = useState(_id); // Initialize groupId with the prop id

  // Fetch notes from the server when component mounts or groupId changes
  useEffect(() => {
    if (!groupId) {
      console.error("Group ID is not defined.",_id);
      console.log("notes",notes)
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/note-groups/${groupId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNotes(data.notes); 
       
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [groupId]);


  const handleNewNote = (value) => {
    setNotes((prevNotes) => [...prevNotes, value]);
  };

  return (
    <div
      className="noteContainer flex justify-start"
      style={{ display: isPhone && !display ? "none" : "" }}
    >
      <NoteHeader
        name={name}
        color={color}
        isPhone={isPhone}
        display={display}
        setDisplay={setDisplay}
      />
      {notes && notes.map((note, index) => {
        return (
          <div className="noteBody flex justify-start" key={index}>
            <div className="notesBox">
              <div className="descriptionContainer">
                <div className="description">{note.content}</div>
              </div>
              <div className="timeStampContainer">
                {note.date} {note.time}
              </div>
            </div>
          </div>
        );
      })}
      {notes.length === 0 && <p className="displayTxt">Start Writing Notes Here!</p>}
      <NoteInputBox id={groupId} handleNewNote={handleNewNote} />
    </div>
  );
};

export default NoteBody;
