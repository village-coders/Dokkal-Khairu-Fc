import React, { useState, useEffect } from "react";
import { GalleryItem } from "../types";
import { api } from "../lib/api";
import { Edit2, Trash2, ArrowLeft } from "lucide-react";

export default function AdminGallery({ triggerToast }: { triggerToast: (msg: string, err?: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("MATCH DAY");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState<"image" | "video">("image");
  const [date, setDate] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getGalleryItems();
      setItems(data);
    } catch (err) {
      triggerToast("Failed to load gallery items", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("MATCH DAY");
    setImageUrl("");
    setType("image");
    setDate(new Date().toISOString().slice(0, 16));
  };

  const initEdit = (item: GalleryItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setType(item.type);
    setDate(new Date(item.date).toISOString().slice(0, 16));
    setActiveTab("form");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !imageUrl || !date) {
      triggerToast("Fill all required fields", true);
      return;
    }
    
    try {
      const payload = { title, category, imageUrl, type, date };
      if (editingId) {
        await api.updateGalleryItem(editingId, payload);
        triggerToast("Item updated successfully.");
      } else {
        await api.createGalleryItem(payload);
        triggerToast("Item added successfully.");
      }
      resetForm();
      loadItems();
      setActiveTab("list");
    } catch (err: any) {
      triggerToast(err.message || "Failed to save item", true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;
    try {
      await api.deleteGalleryItem(id);
      triggerToast("Item deleted.");
      loadItems();
    } catch (err) {
      triggerToast("Failed to delete item", true);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const uploadRes = await api.uploadImage(reader.result as string, file.name);
        setImageUrl(uploadRes.url);
        triggerToast("Image uploaded.");
      } catch (err) {
        triggerToast("Failed to upload image.", true);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div>Loading gallery...</div>;

  return (
    <div className="space-y-6 animate-fade-in text-left text-primary">
      {activeTab === "list" ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-display text-4xl font-black uppercase">CLUB GALLERY</h1>
              <p className="text-sm font-light text-gray-500">Manage photos and video links.</p>
            </div>
            <button
              onClick={() => { resetForm(); setActiveTab("form"); }}
              className="px-4 py-2.5 bg-secondary text-primary-dark font-display text-xs tracking-widest font-black uppercase rounded shadow-sm hover:brightness-105"
            >
              + UPLOAD MEDIA
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item._id} className="bg-white rounded shadow border border-gray-100 overflow-hidden relative group">
                <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <p className="text-xs font-bold truncate uppercase">{item.title}</p>
                  <p className="text-[10px] text-gray-500">{item.category}</p>
                </div>
                <div className="absolute top-2 right-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => initEdit(item)} className="p-1 bg-white rounded shadow text-blue-500 hover:text-blue-700">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-1 bg-white rounded shadow text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <button onClick={() => setActiveTab("list")} className="flex items-center space-x-2 text-primary font-bold mb-6 hover:text-secondary">
            <ArrowLeft className="w-4 h-4" /> <span>BACK</span>
          </button>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">TITLE</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">CATEGORY</label>
                <input required value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. MATCH DAY, TRAINING" className="w-full border p-2 rounded uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">MEDIA TYPE</label>
                <select value={type} onChange={e => setType(e.target.value as "image"|"video")} className="w-full border p-2 rounded">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">DATE</label>
                <input type="datetime-local" required value={date} onChange={e => setDate(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1">MEDIA URL / UPLOAD</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2 block text-xs" />
                <input required value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image or Video URL" className="w-full border p-2 rounded" />
                {imageUrl && type === 'image' && <img src={imageUrl} alt="preview" className="h-32 mt-2 object-cover rounded" />}
              </div>
            </div>
            <button type="submit" className="px-6 py-2 bg-secondary text-primary-dark font-bold tracking-widest rounded mt-4 uppercase">
              {editingId ? "SAVE CHANGES" : "UPLOAD MEDIA"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
