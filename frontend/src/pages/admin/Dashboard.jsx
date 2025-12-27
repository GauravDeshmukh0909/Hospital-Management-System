import {
  Hospital,
  UserPlus,
  Pill,
  Users,
  BarChart3,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    hospitals: 0,
    doctors: 0,
    medicines: 0,
    patientsToday: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          hospitalsRes,
          doctorsRes,
          medicinesRes,
          patientsRes
        ] = await Promise.all([
          API.get("/admin/hospitals"),
          API.get("/admin/doctors"),
          API.get("/medicine"),
          API.get("/admin/patients")
        ]);

        setStats({
          hospitals: hospitalsRes.data.data.length,
          doctors: doctorsRes.data.data.length,
          medicines: medicinesRes.data.data.length,
          patientsToday: patientsRes.data.data.length
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Hospitals",
      description: "Manage hospitals",
      icon: <Hospital className="w-8 h-8" />,
      link: "/admin/hospitals",
      gradient: "from-blue-500 to-cyan-500",
      value: stats.hospitals
    },
    {
      title: "Doctors",
      description: "Add & manage doctors",
      icon: <UserPlus className="w-8 h-8" />,
      link: "/admin/Doctors",
      gradient: "from-green-500 to-emerald-500",
      value: stats.doctors
    },
    {
      title: "Medicines",
      description: "Manage medicines list",
      icon: <Pill className="w-8 h-8" />,
      link: "/admin/Medicines",
      gradient: "from-purple-500 to-pink-500",
      value: stats.medicines
    },
    {
      title: "Patients Today",
      description: "Registered OPD patients",
      icon: <Users className="w-8 h-8" />,
      link: "/admin/Patients",
      gradient: "from-orange-500 to-red-500",
      value: stats.patientsToday
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of hospital operations today
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.link)}
              disabled={loading}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left w-full disabled:opacity-50"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
              />

              <div className="relative p-6">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <div className="text-white">{card.icon}</div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {card.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {loading ? "Loading..." : card.value}
                    </p>
                  </div>

                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

       
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            System Activity
          </h2>

          <p className="text-sm text-gray-500">
            Activity feed can be connected to backend logs or audit events.
          </p>

          <div className="mt-4 flex items-center gap-3 text-gray-600">
            <Activity className="w-5 h-5" />
            <span>No recent activity available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
