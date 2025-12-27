import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, X, Search, Building2, MapPin, Phone, Check } from "lucide-react";
import API from "../../api/axios";

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchHospitals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/admin/hospitals");
      setHospitals(res.data.data || res.data || []);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setError(error.response?.data?.message || "Failed to load hospitals");
    }
    setLoading(false);
  };

  const addHospital = async () => {
    if (!form.name.trim()) {
      alert("Please enter hospital name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.post("/admin/hospital", form);
      setForm({ name: "", address: "", phone: "" });
      setShowModal(false);
      await fetchHospitals();
      alert("Hospital added successfully!");
    } catch (error) {
      console.error("Error adding hospital:", error);
      const errorMsg = error.response?.data?.message || "Failed to add hospital";
      setError(errorMsg);
      alert(errorMsg);
    }
    setLoading(false);
  };

  const updateHospital = async () => {
    if (!form.name.trim()) {
      alert("Please enter hospital name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.put(`/admin/hospital/${selectedHospital._id}`, form);
      setForm({ name: "", address: "", phone: "" });
      setShowModal(false);
      setEditMode(false);
      setSelectedHospital(null);
      await fetchHospitals();
      alert("Hospital updated successfully!");
    } catch (error) {
      console.error("Error updating hospital:", error);
      const errorMsg = error.response?.data?.message || "Failed to update hospital";
      setError(errorMsg);
      alert(errorMsg);
    }
    setLoading(false);
  };

  const deleteHospital = async (id) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return;
    setLoading(true);
    setError("");
    try {
      await API.delete(`/admin/hospital/${id}`);
      await fetchHospitals();
      alert("Hospital deleted successfully!");
    } catch (error) {
      console.error("Error deleting hospital:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete hospital";
      setError(errorMsg);
      alert(errorMsg);
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setForm({ name: "", address: "", phone: "" });
    setEditMode(false);
    setSelectedHospital(null);
    setShowModal(true);
    setError("");
  };

  const openEditModal = (hospital) => {
    setSelectedHospital(hospital);
    setForm({
      name: hospital.name || "",
      address: hospital.address || "",
      phone: hospital.phone || ""
    });
    setEditMode(true);
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ name: "", address: "", phone: "" });
    setEditMode(false);
    setSelectedHospital(null);
    setError("");
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(h =>
    (h.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Building2 className="text-teal-600" size={36} />
                Hospitals Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and monitor all registered hospitals</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Add New Hospital
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

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by hospital name, address, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl shadow-md p-4 text-white">
            <div className="text-sm opacity-90">Total Hospitals</div>
            <div className="text-3xl font-bold">{hospitals.length}</div>
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading hospitals...</p>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="mx-auto text-gray-300" size={64} />
              <p className="text-gray-600 mt-4 text-lg">No hospitals found</p>
              <p className="text-gray-400 text-sm">
                {hospitals.length === 0 ? "Add your first hospital to get started" : "Try a different search term"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHospitals.map((h) => (
                <div
                  key={h._id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Building2 className="text-teal-600" size={24} />
                    </div>
                    {/* <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(h)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Hospital"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteHospital(h._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Hospital"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div> */}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{h.name}</h3>
                  
                  {h.address && (
                    <div className="flex items-start gap-2 text-gray-600 mb-2">
                      <MapPin size={16} className="mt-1 text-teal-600 flex-shrink-0" />
                      <span className="text-sm">{h.address}</span>
                    </div>
                  )}
                  
                  {h.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} className="text-teal-600" />
                      <span className="text-sm">{h.phone}</span>
                    </div>
                  )}
                  
                  {!h.address && !h.phone && (
                    <p className="text-gray-400 text-sm italic">No additional details</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 flex items-center justify-between rounded-t-xl">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 size={28} />
                  {editMode ? "Edit Hospital" : "Add New Hospital"}
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building2 size={16} className="inline mr-1" />
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter hospital name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-1" />
                      Address
                    </label>
                    <textarea
                      placeholder="Enter hospital address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={editMode ? updateHospital : addHospital}
                    disabled={loading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        <Check size={20} />
                        {editMode ? "Update Hospital" : "Add Hospital"}
                      </>
                    )}
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