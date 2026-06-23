import React, { useState, useEffect } from "react";
import { Player } from "../types";
import { api } from "../lib/api";
import { Edit2, Trash2, ArrowLeft, Upload } from "lucide-react";

export default function AdminPlayers({ triggerToast }: { triggerToast: (msg: string, err?: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("Forward");
  const [nationality, setNationality] = useState("Nigeria");
  const [appearances, setAppearances] = useState("");
  const [goals, setGoals] = useState("");
  const [assists, setAssists] = useState("");
  const [cleanSheets, setCleanSheets] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const data = await api.getPlayers();
      setPlayers(data);
    } catch (err: any) {
      triggerToast("Failed to load players", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setNumber("");
    setPosition("Forward");
    setNationality("Nigeria");
    setAppearances("");
    setGoals("");
    setAssists("");
    setCleanSheets("");
    setImageUrl("");
  };

  const initEdit = (p: Player) => {
    setEditingId(p._id);
    setName(p.name);
    setNumber(p.number.toString());
    setPosition(p.position);
    setNationality(p.nationality);
    setAppearances(p.appearances.toString());
    setGoals(p.goals.toString());
    setAssists(p.assists.toString());
    setCleanSheets(p.cleanSheets.toString());
    setImageUrl(p.imageUrl);
    setActiveTab("form");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !number || !position || !nationality) {
      triggerToast("Fill all required fields", true);
      return;
    }
    
    try {
      const payload = {
        name,
        number: Number(number),
        position,
        nationality,
        appearances: appearances ? Number(appearances) : 0,
        goals: goals ? Number(goals) : 0,
        assists: assists ? Number(assists) : 0,
        cleanSheets: cleanSheets ? Number(cleanSheets) : 0,
        imageUrl
      };

      if (editingId) {
        await api.updatePlayer(editingId, payload);
        triggerToast("Player updated successfully.");
      } else {
        await api.createPlayer(payload);
        triggerToast("Player added successfully.");
      }
      resetForm();
      loadPlayers();
      setActiveTab("list");
    } catch (err: any) {
      triggerToast(err.message || "Failed to save player", true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this player?")) return;
    try {
      await api.deletePlayer(id);
      triggerToast("Player deleted.");
      loadPlayers();
    } catch (err) {
      triggerToast("Failed to delete player", true);
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

  if (loading) return <div>Loading players...</div>;

  return (
    <div className="space-y-6 animate-fade-in text-left text-primary">
      {activeTab === "list" ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-display text-4xl font-black uppercase">SQUAD ROSTER</h1>
              <p className="text-sm font-light text-gray-500">Manage first-team players and their statistics.</p>
            </div>
            <button
              onClick={() => { resetForm(); setActiveTab("form"); }}
              className="px-4 py-2.5 bg-secondary text-primary-dark font-display text-xs tracking-widest font-black uppercase rounded shadow-sm hover:brightness-105"
            >
              + ADD PLAYER
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-secondary font-display text-xs tracking-widest uppercase border-b border-secondary/15">
                  <th className="p-4">NO.</th>
                  <th className="p-4">NAME</th>
                  <th className="p-4">POSITION</th>
                  <th className="p-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {players.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold">{p.number}</td>
                    <td className="p-4 font-bold">{p.name}</td>
                    <td className="p-4 text-xs font-mono">{p.position}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => initEdit(p)} className="p-1 text-blue-500 hover:bg-blue-50 rounded mx-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-1 text-red-500 hover:bg-red-50 rounded mx-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <label className="block text-xs font-bold mb-1">NAME</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">SQUAD NUMBER</label>
                <input required type="number" value={number} onChange={e => setNumber(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">POSITION</label>
                <select value={position} onChange={e => setPosition(e.target.value)} className="w-full border p-2 rounded">
                  <option>Goalkeeper</option>
                  <option>Defender</option>
                  <option>Midfielder</option>
                  <option>Forward</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">NATIONALITY</label>
                <input required value={nationality} onChange={e => setNationality(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">APPEARANCES</label>
                <input type="number" value={appearances} onChange={e => setAppearances(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">GOALS</label>
                <input type="number" value={goals} onChange={e => setGoals(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">ASSISTS</label>
                <input type="number" value={assists} onChange={e => setAssists(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">CLEAN SHEETS</label>
                <input type="number" value={cleanSheets} onChange={e => setCleanSheets(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1">PLAYER PHOTO (UPLOAD OR URL)</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2 block text-xs" />
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" className="w-full border p-2 rounded" />
                {imageUrl && <img src={imageUrl} alt="preview" className="h-20 mt-2 object-cover rounded" />}
              </div>
            </div>
            <button type="submit" className="px-6 py-2 bg-secondary text-primary-dark font-bold tracking-widest rounded mt-4 uppercase">
              {editingId ? "SAVE CHANGES" : "ADD PLAYER"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
