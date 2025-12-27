import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, X, Search, Pill, Droplet, Syringe, Building, Tag } from "lucide-react";
import API from "../../api/axios";

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: "", genericName: "", strength: "", type: "Tablet", company: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [error, setError] = useState("");

  const medicineTypes = ["Tablet", "Syrup", "Injection", "Capsule", "Cream", "Drops"];

  const fetchMedicines = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/medicine");
      setMedicines(res.data.data || res.data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setError(error.response?.data?.message || "Failed to load medicines");
    }
    setLoading(false);
  };

  const addMedicine = async () => {
    if (!form.name.trim() || !form.type) {
      alert("Please enter medicine name and type");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.post("/medicine", form);
      setForm({ name: "", genericName: "", strength: "", type: "Tablet", company: "" });
      setShowModal(false);
      await fetchMedicines();
      alert("Medicine added successfully!");
    } catch (error) {
      console.error("Error adding medicine:", error);
      const errorMsg = error.response?.data?.message || "Failed to add medicine";
      setError(errorMsg);
      alert(errorMsg);
    }
    setLoading(false);
  };

  const updateMedicine = async () => {
    if (!form.name.trim() || !form.type) {
      alert("Please enter medicine name and type");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.put(`/medicine/${selectedMedicine._id}`, form);
      setForm({ name: "", genericName: "", strength: "", type: "Tablet", company: "" });
      setShowModal(false);
      setEditMode(false);
      setSelectedMedicine(null);
      await fetchMedicines();
      alert("Medicine updated successfully!");
    } catch (error) {
      console.error("Error updating medicine:", error);
      const errorMsg = error.response?.data?.message || "Failed to update medicine";
      setError(errorMsg);
      alert(errorMsg);
    }
    setLoading(false);
  };

  const deleteMedicine = async (id) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    setLoading(true);
    setError("");
    try {
      await API.delete(`/medicine/${id}`);
      await fetchMedicines();
      alert("Medicine deleted successfully!");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete medicine";
      setError(errorMsg);
      alert(errorMsg);
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setForm({ name: "", genericName: "", strength: "", type: "Tablet", company: "" });
    setEditMode(false);
    setSelectedMedicine(null);
    setShowModal(true);
    setError("");
  };

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setForm({
      name: medicine.name || "",
      genericName: medicine.genericName || "",
      strength: medicine.strength || "",
      type: medicine.type || "Tablet",
      company: medicine.company || ""
    });
    setEditMode(true);
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ name: "", genericName: "", strength: "", type: "Tablet", company: "" });
    setEditMode(false);
    setSelectedMedicine(null);
    setError("");
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = 
      (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.genericName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.company || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || m.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "Tablet": case "Capsule": return <Pill className="text-purple-600" size={20} />;
      case "Syrup": case "Drops": return <Droplet className="text-blue-600" size={20} />;
      case "Injection": return <Syringe className="text-red-600" size={20} />;
      default: return <Pill className="text-purple-600" size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Tablet": case "Capsule": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Syrup": case "Drops": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Injection": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Pill className="text-purple-600" size={36} />
                Medicines Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and monitor all medicines inventory</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Add New Medicine
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <X className="text-red-500 mr-2" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Search, Filter and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, generic name, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              {medicineTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-md p-4 text-white">
            <div className="text-sm opacity-90">Total Medicines</div>
            <div className="text-3xl font-bold">{medicines.length}</div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-md p-4 text-white">
            <div className="text-sm opacity-90">Filtered Results</div>
            <div className="text-3xl font-bold">{filteredMedicines.length}</div>
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading medicines...</p>
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="p-12 text-center">
              <Pill className="mx-auto text-gray-300" size={64} />
              <p className="text-gray-600 mt-4 text-lg">No medicines found</p>
              <p className="text-gray-400 text-sm">
                {medicines.length === 0 ? "Add your first medicine to get started" : "Try a different search term or filter"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((m) => (
                <div
                  key={m._id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        {getTypeIcon(m.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{m.name}</h3>
                        {m.genericName && (
                          <p className="text-sm text-gray-500">{m.genericName}</p>
                        )}
                      </div>
                    </div>
                    {/* <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(m)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Medicine"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteMedicine(m._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Medicine"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div> */}
                  </div>

                  <div className="space-y-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(m.type)}`}>
                      {getTypeIcon(m.type)}
                      {m.type}
                    </div>

                    {m.strength && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Tag size={14} className="text-purple-600" />
                        <span className="font-medium">Strength:</span> {m.strength}
                      </div>
                    )}

                    {m.company && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Building size={14} className="text-purple-600" />
                        <span className="font-medium">Company:</span> {m.company}
                      </div>
                    )}

                    {!m.strength && !m.company && (
                      <p className="text-gray-400 text-xs italic">No additional details</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between rounded-t-xl">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Pill size={28} />
                  {editMode ? "Edit Medicine" : "Add New Medicine"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Pill size={16} className="inline mr-1" />
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter medicine name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Generic Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter generic name"
                      value={form.genericName}
                      onChange={(e) => setForm({ ...form, genericName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag size={16} className="inline mr-1" />
                      Strength
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 500mg, 10ml"
                      value={form.strength}
                      onChange={(e) => setForm({ ...form, strength: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {medicineTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building size={16} className="inline mr-1" />
                      Company
                    </label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={editMode ? updateMedicine : addMedicine}
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : editMode ? "Update Medicine" : "Add Medicine"}
                  </button>
                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}