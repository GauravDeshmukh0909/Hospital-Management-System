import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Hospital,
  UserPlus,
  Pill,
  Users,
  Activity,
  LucideLayoutDashboard,
  Calendar,
  FileText,
  Clock,
  User,

} from "lucide-react";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const { role } = useSelector((state) => state.auth);

  const adminLinks = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      to: "/admin/hospitals",
      label: "Hospitals",
      icon: <Hospital size={20} />
    },
    {
      to: "/admin/Doctors",
      label: "Doctors",
      icon: <UserPlus size={20} />
    },
    {
      to: "/admin/Medicines",
      label: "Medicines",
      icon: <Pill size={20} />
    },
    {
      to: "/admin/Patients",
      label: "Patients",
      icon: <Users size={20} />
    }
  ];

  // const doctorLinks = [
  //   {
  //     to: "/doctor",
  //     label: "Dashboard",
  //     icon: <LayoutDashboard size={20} />
  //   }
  // ];

 const doctorLinks = [
    {
      to: "/doctor",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      to: "/doctor/prescriptions",
      label: "Prescriptions",
      icon: <FileText size={20} />
    },
    
  ];

  const links = role === "admin" ? adminLinks : doctorLinks;

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 min-h-screen shadow-2xl border-r border-slate-700/50">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              HMS
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center tracking-wide">
          Health Management System
        </p>
      </div>

      {/* Role Badge */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-2 text-center">
          <p className="text-xs text-slate-400 mb-1">Logged in as</p>
          <p className="text-sm font-semibold text-blue-400 capitalize">{role || "User"}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-1.5">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin" || item.to === "/doctor"}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Hover Effect Background */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-cyan-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                {/* Icon */}
                <div className={`relative z-10 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`}>
                  {item.icon}
                </div>
                
                {/* Label */}
                <span className="relative z-10">{item.label}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg shadow-white/50" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-50" />
    </aside>
  );
}