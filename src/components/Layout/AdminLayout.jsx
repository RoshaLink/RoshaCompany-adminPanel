import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { Toast } from '../ui/Toast';
import { ChangePasswordModal } from '../ui/ChangePasswordModal';
import { useAdmin } from '../../context/AdminContext';

export const AdminLayout = ({ children }) => {
  const { isPasswordModalOpen, setIsPasswordModalOpen } = useAdmin();

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0b1120] text-[#0f172a] dark:text-[#f1f5f9] relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="ambient-glow-cyan" />
      <div className="ambient-glow-purple" />

      {/* Sidebar (Desktop) */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <AdminNavbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Feedback Toast */}
      <Toast />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
