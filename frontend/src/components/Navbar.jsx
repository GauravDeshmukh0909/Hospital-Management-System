import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { LogOut, User, Bell, Search } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Title */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Hospital Management System
            </h1>
          </div>

          {/* Right - User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button - Optional */}
            <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors duration-200 text-slate-600 hover:text-slate-800">
              <Search size={18} />
            </button>

            {/* Notifications - Optional */}
            <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors duration-200 text-slate-600 hover:text-slate-800 relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            {/* User Role Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
                <User size={14} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-slate-700 capitalize">
                {role || "User"}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => dispatch(logout())}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 transition-all duration-200 text-sm font-medium group"
            >
              <LogOut size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}