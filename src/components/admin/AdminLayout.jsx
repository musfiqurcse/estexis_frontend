import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminLayout({ title, children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="ml-60 flex flex-1 flex-col overflow-auto">
        <AdminTopbar title={title} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
