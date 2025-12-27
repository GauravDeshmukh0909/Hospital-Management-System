import { useEffect, useState } from "react";
import { Plus, User, Calendar, Phone, MapPin, Stethoscope, Building2, FileText, Users, Check, X } from "lucide-react";
import API from "../../api/axios";

export default function Patients() {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    address: "",
    complaint: "",
    doctor: "",
    hospital: ""
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [doctorsRes, hospitalsRes, patientsRes] = await Promise.all([
        API.get("/admin/doctors"),
        API.get("/admin/hospitals"),
        API.get("/admin/patients").catch(() => ({ data: { data: [] } }))
      ]);
      setDoctors(doctorsRes.data.data || []);
      setHospitals(hospitalsRes.data.data || []);
      setPatients(patientsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    }
    setLoading(false);
  };

  const submit = async () => {
    if (!form.name || !form.age || !form.doctor) {
      alert("Please fill in required fields: Name, Age, and Doctor");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.post("/admin/patient", form);
      alert("Patient registered successfully!");
      setForm({
        name: "",
        age: "",
        gender: "Male",
        phone: "",
        address: "",
        complaint: "",
        doctor: "",
        hospital: ""
      });
      setShowForm(false);
      await fetchData();
    } catch (error) {
      console.error("Error registering patient:", error);
      const errorMsg = error.response?.data?.message || "Failed to register patient";
      setError(errorMsg);
      alert(errorMsg);
    }
    setLoading(false);
  };

  const getTodayPatients = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return patients.filter(p => {
      const regDate = new Date(p.registrationDate).setHours(0, 0, 0, 0);
      return regDate === today;
    });
  };

  const todayPatients = getTodayPatients();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Users className="text-blue-600" size={36} />
                Patient Registration
              </h1>
              <p className="text-gray-600 mt-1">Register and manage patient appointments</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? "Cancel" : "Register New Patient"}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Today's Patients</p>
                <p className="text-4xl font-bold mt-2">{todayPatients.length}</p>
              </div>
              <Calendar className="opacity-80" size={48} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Patients</p>
                <p className="text-4xl font-bold mt-2">{patients.length}</p>
              </div>
              <Users className="opacity-80" size={48} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Available Doctors</p>
                <p className="text-4xl font-bold mt-2">{doctors.length}</p>
              </div>
              <Stethoscope className="opacity-80" size={48} />
            </div>
          </div>
        </div>

        {/* Registration Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="text-blue-600" size={28} />
                Patient Registration Form
              </h2>
              <p className="text-gray-600 mt-1">Fill in the patient details below</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1 text-blue-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter patient name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1 text-blue-600" />
                  Age *
                </label>
                <input
                  type="number"
                  placeholder="Enter age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1 text-blue-600" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Stethoscope size={16} className="inline mr-1 text-blue-600" />
                  Assign Doctor *
                </label>
                <select
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.user?.name} - {d.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 size={16} className="inline mr-1 text-blue-600" />
                  Hospital
                </label>
                <select
                  value={form.hospital}
                  onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1 text-blue-600" />
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter full address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-1 text-blue-600" />
                  Chief Complaint
                </label>
                <textarea
                  placeholder="Describe the patient's main complaint or symptoms..."
                  value={form.complaint}
                  onChange={(e) => setForm({ ...form, complaint: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Check size={20} />
                    Register Patient
                  </>
                )}
              </button>
              <button
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Today's Patients List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar size={28} />
              Today's Registered Patients
            </h2>
            <p className="text-blue-100 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading patients...</p>
            </div>
          ) : todayPatients.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto text-gray-300" size={64} />
              <p className="text-gray-600 mt-4 text-lg">No patients registered today</p>
              <p className="text-gray-400 text-sm">Click "Register New Patient" to add a patient</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Age/Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Complaint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {todayPatients.map((p) => (
                    <tr key={p._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{p.name}</p>
                            {p.address && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin size={10} />
                                {p.address.substring(0, 30)}{p.address.length > 30 ? '...' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{p.age} years</p>
                        <p className="text-xs text-gray-500">{p.gender}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-blue-600" />
                          <span className="text-sm">{p.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope size={14} className="text-blue-600" />
                          <span className="text-sm text-gray-800">
                            {p.doctor?.user?.name || p.doctor?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {p.complaint ? (
                            p.complaint.length > 50 ? 
                              p.complaint.substring(0, 50) + '...' : 
                              p.complaint
                          ) : (
                            <span className="text-gray-400 italic">No complaint noted</span>
                          )}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}