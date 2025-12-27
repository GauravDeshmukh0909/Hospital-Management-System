import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Plus, Trash2, Edit2, X, Search, UserCog, Mail, Lock, Stethoscope, Building2 } from "lucide-react";


export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const d = await API.get("/admin/doctors");
      const h = await API.get("/admin/hospitals");

      setDoctors(d.data.data);
      setHospitals(h.data.data);

      console.log(hospitals);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const addDoctor = async () => {
    if (!form.name || !form.email || !form.password || !form.specialization || !form.hospital) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await API.post("/admin/doctor", form);
      await fetchData();
      setForm({});
      setShowModal(false);
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
    setLoading(false);
  };

  const updateDoctor = async () => {
    setLoading(true);
    try {
      await API.put(`/admin/doctor/${selectedDoctor._id}`, form);
      await fetchData();
      setForm({});
      setShowModal(false);
      setEditMode(false);
      setSelectedDoctor(null);
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
    setLoading(false);
  };

  const deleteDoctor = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    setLoading(true);
    try {
      await API.delete(`/admin/doctor/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
    setLoading(false);
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setForm({
      name: doctor.user?.name,
      email: doctor.user?.email,
      specialization: doctor.specialization,
      hospital: doctor.hospital?._id
    });
    setEditMode(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    setForm({});
    setEditMode(false);
    setSelectedDoctor(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({});
    setEditMode(false);
    setSelectedDoctor(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDoctors = doctors.filter(d =>
    d.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.hospital?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <UserCog className="text-indigo-600" size={36} />
                Doctors Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and monitor all registered doctors</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Add New Doctor
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, specialization, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md p-4 text-white">
            <div className="text-sm opacity-90">Total Doctors</div>
            <div className="text-3xl font-bold">{doctors.length}</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-md p-4 text-white">
            <div className="text-sm opacity-90">Hospitals</div>
            <div className="text-3xl font-bold">{hospitals.length}</div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="p-12 text-center">
              <UserCog className="mx-auto text-gray-300" size={64} />
              <p className="text-gray-600 mt-4 text-lg">No doctors found</p>
              <p className="text-gray-400 text-sm">Add your first doctor to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Doctor Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Specialization</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Hospital</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDoctors.map((d) => (
                    <tr key={d._id} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <UserCog className="text-indigo-600" size={20} />
                          </div>
                          <span className="font-medium text-gray-800">{d.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} className="text-gray-400" />
                          {d.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope size={16} className="text-indigo-600" />
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            {d.specialization}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 size={16} className="text-gray-400" />
                          {d.hospital?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {/* <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(d)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Doctor"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteDoctor(d._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Doctor"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <UserCog size={28} />
                  {editMode ? "Edit Doctor" : "Add New Doctor"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserCog size={16} className="inline mr-1" />
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter doctor name"
                      value={form.name || ""}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={form.email || ""}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {!editMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock size={16} className="inline mr-1" />
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={form.password || ""}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Stethoscope size={16} className="inline mr-1" />
                      Specialization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Cardiology"
                      value={form.specialization || ""}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className={editMode ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building2 size={16} className="inline mr-1" />
                      Hospital
                    </label>
                    <select
                      value={form.hospital || ""}
                      onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Hospital</option>
                      {hospitals.map((h) => (
                        <option key={h._id} value={h._id}>
                          {h.name} {h.location && `(${h.location})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={editMode ? updateDoctor : addDoctor}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : editMode ? "Update Doctor" : "Add Doctor"}
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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