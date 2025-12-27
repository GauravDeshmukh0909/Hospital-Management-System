import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Pill,
  Plus,
  Save,
  Trash2,
  FileText,
  Clock,
  Clipboard,
  AlertCircle,
  User,
  ArrowLeft,
  Calendar,
} from "lucide-react";

export default function Prescription() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [items, setItems] = useState([
    { medicine: "", dosage: "", duration: "", notes: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medRes = await API.get("/medicine");
        setMedicines(medRes.data.data || medRes.data);

        try {
          const patientRes = await API.get(`/doctor/patients/${patientId}`);
          setPatientInfo(patientRes.data);
        } catch (err) {
          console.log("Patient info not available:", err);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, [patientId]);

  const addRow = () => {
    setItems([...items, { medicine: "", dosage: "", duration: "", notes: "" }]);
  };

  const removeRow = (index) => {
    if (items.length > 1) {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const submitPrescription = async () => {
    const hasEmptyFields = items.some(
      (item) => !item.medicine || !item.dosage || !item.duration
    );

    if (hasEmptyFields) {
      alert("Please fill in all required fields (Medicine, Dosage, Duration)");
      return;
    }

    setLoading(true);
    try {
      await API.post("/doctor/prescription", {
        patient: patientId,
        medicines: items,
        date: new Date().toISOString(),
      });
      alert("Prescription saved successfully!");
      navigate("/doctor");
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate("/doctor")}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      {/* Header with Patient Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Write Prescription
                </h1>
                <p className="text-slate-600 mt-1 flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Details Section */}
        {patientInfo && (
          <div className="p-6 bg-blue-50 border-b border-blue-200">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">
              <User size={16} />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-slate-500 mb-1">Name</p>
                <p className="font-semibold text-slate-800">
                  {patientInfo.name}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-slate-500 mb-1">Age</p>
                <p className="font-semibold text-slate-800">
                  {patientInfo.age} years
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-slate-500 mb-1">Gender</p>
                <p className="font-semibold text-slate-800 capitalize">
                  {patientInfo.gender}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-slate-500 mb-1">Patient ID</p>
                <p className="font-semibold text-slate-800">
                  {patientId.slice(-8)}
                </p>
              </div>
            </div>
            {patientInfo.complaint && (
              <div className="mt-4 bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-slate-500 mb-1">Chief Complaint</p>
                <p className="text-slate-700">{patientInfo.complaint}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Medicines Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Pill size={20} className="text-green-600" />
            Prescribed Medications
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Add medicines with dosage and duration information
          </p>
        </div>

        <div className="p-6 space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 border-2 border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-full">
                  Medicine #{index + 1}
                </span>
                {items.length > 1 && (
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200 flex items-center gap-1 text-sm font-medium"
                    title="Remove medicine"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Medicine Select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Pill size={14} className="text-green-600" />
                    Medicine <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white font-medium"
                    value={item.medicine}
                    onChange={(e) =>
                      handleChange(index, "medicine", e.target.value)
                    }
                  >
                    <option value="">Select Medicine</option>
                    {medicines.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dosage */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600" />
                    Dosage <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium"
                    placeholder="e.g., 1-0-1, 1-1-1"
                    value={item.dosage}
                    onChange={(e) =>
                      handleChange(index, "dosage", e.target.value)
                    }
                  />
                  <p className="text-xs text-slate-500">
                    Morning-Afternoon-Night
                  </p>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar size={14} className="text-purple-600" />
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium"
                    placeholder="e.g., 5 days, 2 weeks"
                    value={item.duration}
                    onChange={(e) =>
                      handleChange(index, "duration", e.target.value)
                    }
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Clipboard size={14} className="text-amber-600" />
                    Special Instructions
                  </label>
                  <input
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="After meals, before bed, etc."
                    value={item.notes}
                    onChange={(e) =>
                      handleChange(index, "notes", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Info Banner */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-blue-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Important Reminders
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>
                  All fields marked with{" "}
                  <span className="text-red-500 font-bold">*</span> are required
                </li>
                <li>Double-check dosage and duration before saving</li>
                <li>Add special instructions for patient guidance</li>
                <li>Prescription will be saved with today's date</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 border-t-2 border-slate-200 flex flex-wrap gap-3">
          <button
            onClick={addRow}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-green-500 hover:bg-green-50 text-green-700 font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <Plus size={18} />
            Add Another Medicine
          </button>
          <div className="flex-1"></div>

          <button
            onClick={() => navigate("/doctor")}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-all duration-200"
          >
            Cancel
          </button>

          <button
            onClick={submitPrescription}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            <Save size={20} />
            {loading ? "Saving Prescription..." : "Save Prescription"}
          </button>
        </div>
      </div>
    </div>
  );
}
