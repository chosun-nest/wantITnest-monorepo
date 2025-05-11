import React, { useState } from "react";
import "./NoticeBoard.css";

const categories = ["일반공지", "학사공지", "장학공지", "IT융합대학 공지", "컴퓨터공학과 공지"];

interface NoticeDropdownProps {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const NoticeDropdown: React.FC<NoticeDropdownProps> = ({ selectedCategory, setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <button className={`dropdown-toggle ${isOpen ? "open" : ""}`} onClick={handleToggle}>
        {selectedCategory}
        <span className="arrow">▼</span>
      </button>
      <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        {categories.map((category, index) => (
          <li key={index} onClick={() => handleSelect(category)}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeDropdown;
