import React, { useState } from "react";

const TagInput = ({ tags, setTags }: { tags: string[]; setTags: (tags: string[]) => void }) => {
  const [tag, setTag] = useState("");

  const addTag = () => {
    if (tag.trim() && !tags.includes(tag)) {
      setTags([...tags, tag.trim()]);
      setTag(""); // Clear the input
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-2">
        {tags?.map((tag, index) => (
          <span key={index} className="bg-gray-900 text-white px-2 py-1 rounded-full text-sm flex items-center">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-2 text-red-500"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Enter a tag"
          className="border border-gray-600 bg-transparent p-2 rounded-lg focus:outline-none focus:ring-0"
        />
        <button
          type="button"
          onClick={addTag}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default TagInput;
