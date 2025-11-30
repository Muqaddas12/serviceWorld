import { Edit, Trash2 } from "lucide-react";
import { deleteCategoryAllServices } from "@/lib/services";
import { UpdateAllCategoryServiceAction } from "@/lib/customservices";
import EditServiceModal from "./EditModal";
import { useState } from "react";

export default function CategoryOption({ category, services, ModalCategory,  OnClose }) {
    
  const [isModalOpen, setIsModalOpen] = useState(false);
const onSave=async (updated)=>{
   const res=await UpdateAllCategoryServiceAction(updated,category)
   if(res.status){
    alert(res.message)
   }
   alert(res.message)
}
  const handleEdit = () => {
    setIsModalOpen(true); // Open your modal instead of confirm
  };

  const handleDelete = async () => {
    const ok = confirm("🗑️ Are you sure you want to delete this category?");
    if (!ok) return;

    const res = await deleteCategoryAllServices({ category });
    console.log(res);

    if (res.status) {
      alert(res.message);
      OnClose && OnClose(); // Optional callback if parent wants refresh
    } else {
      alert("Error: " + res.message);
    }
  };

  return (
    <div className="flex px-10 items-center">
      <div className="flex pr-5 pl-5 gap-3">
        {/* ✏ Pencil Edit Icon */}
        <Edit
          size={20}
          onClick={handleEdit}
          className="cursor-pointer hover:scale-110 transition text-blue-500 hover:text-blue-700"
        />

        {/* 🗑 Garbage/Delete Icon */}
        <Trash2
          size={20}
          onClick={handleDelete}
          className="cursor-pointer hover:scale-110 transition text-red-500 hover:text-red-700"
        />
      </div>

      {/* ✅ Show modal only when edit clicked */}
      {isModalOpen && (
        <EditServiceModal
          category={ModalCategory}
          onSave={onSave}
          onClose={() => {
            setIsModalOpen(false);
            OnClose && OnClose(); // notify parent after closing if needed
          }}
          editData={services[0]}
        />
      )}
    </div>
  );
}
