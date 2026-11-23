import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers, updateUserRole, deleteUser } from "@/app/actions/users";

export default async function UsersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/dashboard");
  const users = await getUsers();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-50 dark:bg-zinc-800 text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Created At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <form action={updateUserRole}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="role" value={user.role === 'admin' ? 'user' : 'admin'} />
                    <button type="submit" className={`px-2 py-1 rounded text-xs font-medium border ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}`}>
                      {user.role}
                    </button>
                  </form>
                </td>
                <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  {user.id !== session.userId && (
                    <form action={deleteUser}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button type="submit" className="text-red-500">Delete</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}