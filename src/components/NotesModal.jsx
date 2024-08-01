import React, { useState, useEffect, useRef } from "react";
import "../styles/NotesModal.css";
import { v4 as uuidv4 } from 'uuid';
import Loader from "./Loader"; // Import the Loader component

const colorOptions = [
  { color: "var(--notes-color-1)", name: "Color 1" },
  { color: "var(--notes-color-2)", name: "Color 2" },
  { color: "var(--notes-color-3)", name: "Color 3" },
  { color: "var(--notes-color-4)", name: "Color 4" },
  { color: "var(--notes-color-5)", name: "Color 5" },
  { color: "var(--notes-color-6)", name: "Color 6" },
];

const NotesModal = ({
  noteActive,
  noteGroups,
  setNewNoteGroup,
  setNoteActive,
  setNoteGroups,
}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [nameError, setNameError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [loading, setLoading] = useState(false); // State to handle loading
  const modalRef = useRef(null);

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
    setNameError(false);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    setColorError(false);
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      setNameError(true);
      return;
    }
    if (selectedColor === "") {
      setColorError(true);
      return;
    }
    const newGroup = {
      id: uuidv4(), // Generate a unique ID
      name: groupName,
      color: selectedColor,
      notes: [],
    };
    try {
      setLoading(true); // Set loading to true when starting the request
      const response = await fetch("http://localhost:5000/note-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const addedGroup = await response.json();
      setNewNoteGroup([...noteGroups, addedGroup]);
      setNoteGroups([...noteGroups, addedGroup]);

      setGroupName("");
      setSelectedColor("");
      setNoteActive(false);
    } catch (error) {
      console.error("Error creating note group:", error);
   
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setNoteActive(false);
      }
    };

    if (noteActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [noteActive, setNoteActive]);

  return (
    <div className="container-body" style={{ display: noteActive ? "flex" : "none" }}>
      <div className="create-note-container" ref={modalRef}>
        {loading ? (
          <Loader /> // Show loader while creating the group
        ) : (
          <>
            <p className="create-note-title">Create New Notes group</p>
            <div className="create-note-input-container flex flex-row justify-start">
              <label htmlFor="name" className="label">Group Name</label>
              <input
                type="text"
                name="name"
                className="create-note-input placeholder"
                placeholder="Enter your group name...."
                value={groupName}
                onChange={handleGroupNameChange}
              />
            </div>
            <div className="create-note-input-container flex flex-row justify-start">
              <label htmlFor="color" className="label">Choose colour</label>
              <div className="colors flex flex-row">
                {colorOptions.map(({ color, name }) => (
                  <div
                    key={color}
                    className={`ellipse color ${selectedColor === color ? "selected" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                  ></div>
                ))}
              </div>
            </div>
            {nameError && <p className="error">*Please Enter your group name</p>}
            {colorError && <p className="error">*Please Choose Color</p>}
            <button className="createBtn" onClick={handleCreateGroup}>Create</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NotesModal;
