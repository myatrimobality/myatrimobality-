import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Edit2,
  Percent,
  Wallet,
  Shield,
  Building,
  PlusCircle
} from 'lucide-react';

export const AdminUsersAndAgents: React.FC = () => {
  const { users = [], setUsers } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newCommission, setNewCommission] = useState<number>(8);
  const [walletAdjustment, setWalletAdjustment] = useState<number>(0);

  const safeUsers = users || [];

  const filteredUsers = safeUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.mobile.includes(searchTerm) ||
      (u.agencyName && u.agencyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.agentCode && u.agentCode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            commissionValue: Number(newCommission),
            walletBalance: (u.walletBalance || 0) + Number(walletAdjustment),
          };
        }
        return u;
      })
    );
    alert(`Updated agent profile & commission for ${editingUser.name}`);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#F58220] uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">User & Travel Agent Directory</h1>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Total Registered Users: <strong className="text-slate-900">{users.length}</strong>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name, Agency, Code, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0264A6] w-72"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customers Only</option>
            <option value="AGENT">Travel Agents Only</option>
            <option value="OPERATOR">Fleet Operators</option>
            <option value="ADMIN">Master Admins</option>
          </select>
        </div>

        <div className="text-xs font-extrabold text-slate-500">
          Showing <span className="text-[#0264A6]">{filteredUsers.length}</span> Records
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User / Agency</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Agent Code / Org</th>
                <th className="py-3.5 px-4">Wallet Balance</th>
                <th className="py-3.5 px-4">Commission</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900">{u.name}</div>
                    {u.agencyName && <div className="text-[11px] text-slate-500">{u.agencyName}</div>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        u.role === 'ADMIN'
                          ? 'bg-red-100 text-red-800'
                          : u.role === 'AGENT'
                          ? 'bg-amber-100 text-amber-900'
                          : u.role === 'OPERATOR'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-700 font-bold">{u.mobile}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {u.agentCode || u.operatorCompanyName || '-'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-emerald-600">
                    {u.walletBalance !== undefined ? `₹${u.walletBalance.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#F58220]">
                    {u.commissionValue ? `${u.commissionValue}%` : '-'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    {u.role === 'AGENT' && (
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setNewCommission(u.commissionValue || 8);
                          setWalletAdjustment(0);
                        }}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#0264A6] rounded-lg transition-colors inline-flex"
                        title="Edit Commission & Balance"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Agent Commission Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                Edit Agent: {editingUser.name} ({editingUser.agentCode})
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Commission Rate (%)</label>
              <input
                type="number"
                min="0"
                max="25"
                step="0.5"
                value={newCommission}
                onChange={(e) => setNewCommission(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Direct Wallet Adjustment (+ Credit / - Debit INR)
              </label>
              <input
                type="number"
                step="500"
                value={walletAdjustment}
                onChange={(e) => setWalletAdjustment(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Current Balance: ₹{editingUser.walletBalance}
              </span>
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#0264A6] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
