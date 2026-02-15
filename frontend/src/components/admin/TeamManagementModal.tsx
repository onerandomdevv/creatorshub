"use client";

import { useState, useEffect } from "react";
import {
  X,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  Save,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamManagementModal({
  isOpen,
  onClose,
}: TeamManagementModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Confirmation State
  const [confirmingUser, setConfirmingUser] = useState<{
    id: string;
    role: "admin" | "user";
  } | null>(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen && currentUser?.token) {
      fetchUsers();
    }
  }, [isOpen, currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (currentUser?.token) {
        const data = await api.getUsers(currentUser.token);
        if (data.success) {
          setUsers(data.users);
        }
      }
    } catch (error) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.token || !confirmingUser || !password) return;

    try {
      setProcessingId(confirmingUser.id);
      const data = await api.updateUserRole(
        confirmingUser.id,
        confirmingUser.role,
        password,
        currentUser.token,
      );

      if (data.success) {
        toast.success(`User role updated to ${confirmingUser.role}`);
        setUsers(
          users.map((u) =>
            u._id === confirmingUser.id
              ? { ...u, role: confirmingUser.role }
              : u,
          ),
        );
        setConfirmingUser(null);
        setPassword("");
      } else {
        toast.error(data.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("Error updating role");
    } finally {
      setProcessingId(null);
    }
  };

  const initiateRoleChange = (userId: string, newRole: "admin" | "user") => {
    if (userId === currentUser?._id) {
      toast.error("You cannot change your own role.");
      return;
    }
    setConfirmingUser({ id: userId, role: newRole });
    setPassword("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] relative">
        {/* Password Confirmation Overlay */}
        {confirmingUser && (
          <div className="absolute inset-0 z-50 bg-zinc-950/95 flex items-center justify-center p-6 animate-in fade-in duration-200">
            <form
              onSubmit={verifyAndExecute}
              className="w-full max-w-sm space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto text-teal-500 mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Security Check</h3>
                <p className="text-zinc-400 text-sm">
                  Please enter your password to confirm promoting this user to
                  <span className="font-bold text-white uppercase">
                    {" "}
                    {confirmingUser.role}
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-teal-500 transition-colors focus:outline-none text-center tracking-widest"
                  autoFocus
                />
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setConfirmingUser(null)}
                    className="w-full py-3 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!password || !!processingId}
                    className="w-full bg-teal-600 text-black font-bold py-3 rounded-xl hover:bg-teal-500 transition-colors flex items-center justify-center gap-2"
                  >
                    {processingId ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Header */}
        <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h2 className="text-2xl font-black text-white">Manage Team</h2>
            <p className="text-zinc-500 text-sm">
              Control access levels and assign roles.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              <p>Loading team members...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-[2fr_1.5fr_1fr] gap-4 px-4 pb-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <div>User</div>
                <div>Role</div>
                <div className="text-right">Action</div>
              </div>

              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="grid grid-cols-[2fr_1.5fr_1fr] gap-4 items-center p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-colors"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          user.role === "admin"
                            ? "bg-teal-500/10 text-teal-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck size={20} />
                        ) : (
                          <UserIcon size={20} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white truncate">
                          {user.name}
                        </h4>
                        <p className="text-xs text-zinc-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                      {user._id === currentUser?._id ? (
                        <span className="text-xs text-zinc-600 italic px-3 py-2">
                          Current User
                        </span>
                      ) : (
                        <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                          <button
                            onClick={() => initiateRoleChange(user._id, "user")}
                            disabled={
                              processingId === user._id || user.role === "user"
                            }
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                              user.role === "user"
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-500 hover:text-white"
                            }`}
                          >
                            USER
                          </button>
                          <button
                            onClick={() =>
                              initiateRoleChange(user._id, "admin")
                            }
                            disabled={
                              processingId === user._id || user.role === "admin"
                            }
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                              user.role === "admin"
                                ? "bg-teal-600 text-black shadow-sm"
                                : "text-zinc-500 hover:text-white"
                            }`}
                          >
                            ADMIN
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-900 bg-zinc-900/30 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
