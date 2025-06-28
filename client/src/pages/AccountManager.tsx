import { Outlet, Link, useLocation } from "react-router-dom";
import { AccountantSidebar} from "../Constant";
import {  useSelector } from "react-redux";
import { MenuIcon, XIcon } from "lucide-react";
import RoleBasedHeader, { type MyState } from "./RoleBasedHeader";
import logo from "../assets/images/favikon.webp";
import { useEffect, useState } from "react";

const AccountManager = () => {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useSelector((state: MyState) => state.auth);

  // Close sidebar on route change (optional)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full bg-gray-900 text-white p-5
          w-64
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <div className="w-full flex justify-center items-center">
            <a href="dashboard">
              <img
                src={logo}
                alt="Logo"
                loading="lazy"
                className="h-10 sm:h-10 md:h-10 object-contain"
              />
            </a>
          </div>

          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="focus:outline-none focus:ring-2 focus:ring-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop header (hidden on mobile) */}
        <div className="w-full mb-6 md:flex justify-center items-center hidden">
          <a href="dashboard">
            <img
              src={logo}
              alt="Logo"
                loading="lazy"
              className="h-10 sm:h-10 md:h-10 object-contain"
            />
          </a>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {AccountantSidebar.map((item, index) => {
            const isActive = pathname === `/${item.link}`;
            return (
              <Link
                key={index}
                to={`/${item.link}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header for mobile - hamburger menu */}
        <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between md:hidden">
          <button
            aria-label="Open sidebar menu"
            onClick={() => setSidebarOpen(true)}
            className="focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <MenuIcon className="w-7 h-7 text-gray-700" />
          </button>
          <div className="flex-1">
            <RoleBasedHeader user={user} />
          </div>
        </header>

        {/* RoleBased Header */}
        <header className="hidden md:block">
          <RoleBasedHeader user={user} />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountManager;
