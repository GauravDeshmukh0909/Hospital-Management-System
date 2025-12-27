import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  FileText,
  Stethoscope,
  Activity,
  AlertCircle,
  Eye,
  X
} from "lucide-react";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get("/doctor/patients/today");
        setPatients(res.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const stats = [
    {
      label: "Today's Patients",
      value: patients.length,
      icon: <Users size={24} />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      label: "Pending Reviews",
      value: patients.filter(p => !p.prescribed).length,
      icon: <Clock size={24} />,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      label: "Completed",
      value: patients.filter(p => p.prescribed).length,
      icon: <FileText size={24} />,
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    }
  ];

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handlePrescribe = (patientId) => {
    setSelectedPatient(null);
    navigate(`/doctor/prescription/${patientId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="text-white" size={20} />
            </div>
            Doctor Dashboard
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div
                className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor}`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            Today's Patient Queue
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Click on a patient to view details and prescribe medication
          </p>
        </div>

        {patients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1">No Patients Today</p>
            <p className="text-slate-400 text-sm">
              There are no patients registered for today
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Chief Complaint
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Registration Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {patients.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleViewDetails(p)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-500">ID: {p._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{p.age} years</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                        {p.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 max-w-xs line-clamp-2">
                        {p.complaint}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={14} />
                        <span className="text-sm font-medium">
                          {formatTime(p.createdAt || p.registrationTime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.prescribed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(p);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-medium rounded-lg transition-all duration-200 text-sm"
                        title="View Details"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {selectedPatient.name.charAt(0).toUpperCase()}
                  </div>
                  Patient Details
                </h3>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Full Name</p>
                    <p className="font-semibold text-slate-800">{selectedPatient.name}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Patient ID</p>
                    <p className="font-semibold text-slate-800">{selectedPatient._id.slice(-8)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Age</p>
                    <p className="font-semibold text-slate-800">{selectedPatient.age} years</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Gender</p>
                    <p className="font-semibold text-slate-800 capitalize">{selectedPatient.gender}</p>
                  </div>
                </div>
              </div>

              {/* Registration Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                  Registration Details
                </h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <Clock size={16} />
                    <p className="text-sm font-medium">
                      Registration Time: {formatTime(selectedPatient.createdAt || selectedPatient.registrationTime)}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(selectedPatient.createdAt || selectedPatient.registrationTime).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                  Chief Complaint
                </h4>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-slate-700 leading-relaxed">{selectedPatient.complaint}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                  Status
                </h4>
                <div className="flex items-center gap-2">
                  {selectedPatient.prescribed ? (
                    <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                      ✓ Prescription Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-amber-100 text-amber-700 border border-amber-200">
                      ⏱ Pending Prescription
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-medium rounded-lg transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => handlePrescribe(selectedPatient._id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FileText size={16} />
                Write Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}