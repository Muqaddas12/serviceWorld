"use client";
import { getCategories,upadateCategories } from "@/lib/services";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function EditCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ---------------- LOAD CATEGORIES ----------------
  useEffect(() => {
    async function load() {
      const res = await getCategories(); // returns array of categories
      setCategories(res.data || []);
      setLoading(false);
    }
    load();
  }, []);

  // ---------------- HANDLE DRAG ----------------
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    setCategories(items);
  };

  // ---------------- SAVE ORDER ----------------
  const handleSave = async () => {
    setSaving(true);
    console.log(categories)
     const res =await upadateCategories({ allcategories: categories });

     alert(res.message || "Order saved!");
    setSaving(false);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Edit & Reorder Categories</h1>

      <div className="mb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save New Order"}
        </button>
      </div>

      {/* DRAG & DROP */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categoryList">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {categories.map((cat, index) => (
                <Draggable
                  key={cat}
                  draggableId={cat}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-3 rounded-md border bg-white dark:bg-[#1E1F23] flex items-center justify-between 
                        ${snapshot.isDragging ? "shadow-lg bg-gray-200" : ""}
                      `}
                    >
                      {/* Drag Icon */}
                      <span
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing text-gray-500 text-lg pr-3"
                      >
                        ≡
                      </span>

                      {/* Category Name */}
                      <div className="flex-1 font-semibold">{cat}</div>

                      {/* Index Badge */}
                      <span className="px-3 py-1 text-xs rounded bg-gray-200">
                        #{index}
                      </span>
                    </li>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
