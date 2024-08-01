import React, { useEffect, useState } from "react";
import "./styles/App.css";
import Notes from "./components/Notes";
import Sidebar from "./components/Sidebar";
import NotesModal from "./components/NotesModal";

function App() {
  const [isPhone, setIsPhone] = useState(false);
  const [display, setDisplay] = useState(false);
  const [selectedNote, setSelectedNote] = useState({});
  const [noteActive, setNoteActive] = useState(false);
  const [noteGroups, setNoteGroups] = useState([]);
  const [newNoteGroup, setNewNoteGroup] = useState({
    id: "",
    name: "",
    notes: [],
    color: "",
  });
  const [selectedNoteId, setSelectedNoteId] = useState(""); // State to hold selected note ID

  useEffect(() => {
    const fetchNoteGroups = async () => {
      try {
        const response = await fetch("http://localhost:5000/note-groups");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNoteGroups(data); // Set the fetched note groups
        
        // Extract and set the ID from the fetched data if necessary
        if (data.length > 0) {
          // Assuming you want the ID of the first note group, adjust as needed
          setSelectedNoteId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching note groups:", error);
      }
    };

    fetchNoteGroups(); // Fetch data on component mount
  }, []);

  useEffect(() => {
    const updateNoteGroups = async () => {
      try {
        const response = await fetch("http://localhost:5000/note-groups", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteGroups),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error updating note groups:", error);
      }
    };

    if (noteGroups.length > 0) {
      updateNoteGroups(); // Update note groups whenever they change
    }
  }, [noteGroups]);

  useEffect(() => {
    const handleResize = () => {
      setIsPhone(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="App flex flex-row">
        <Sidebar
          display={display}
          setDisplay={setDisplay}
          isPhone={isPhone}
          setNoteActive={setNoteActive}
          noteGroups={noteGroups}
          setSelectedNote={setSelectedNote}
          selectedNote={selectedNote}
        />

        <Notes
          display={display}
          setDisplay={setDisplay}
          selectedNote={selectedNote}
          isPhone={isPhone}
          noteActive={noteActive}
          selectedNoteId={selectedNoteId} // Pass the selectedNote ID
        />
      </div>

      <NotesModal
        noteActive={noteActive}
        setNoteActive={setNoteActive}
        noteGroups={noteGroups}
        setNewNoteGroup={setNewNoteGroup}
        setNoteGroups={setNoteGroups}
        selectedNoteId={selectedNoteId} // Pass the selectedNote ID
      />
    </>
  );
}

export default App;
