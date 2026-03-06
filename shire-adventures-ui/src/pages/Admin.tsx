import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogOut, UserPlus, Trash2, KeyRound, Shield, ScrollText, Plus, Pencil, Check, X } from "lucide-react";

interface AdminProps {
  currentUser: any;
  token: string;
  onLogout: () => void;
}

export default function Admin({ currentUser, token, onLogout }: AdminProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'players' | 'rules'>('players');
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Player");
  const [newPassword, setNewPassword] = useState("");
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [newRuleTitle, setNewRuleTitle] = useState("");
  const [newRuleDesc, setNewRuleDesc] = useState("");
  const [newRuleCategory, setNewRuleCategory] = useState("General");
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchRules();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("https://the-shadow-backend.vercel.app/api/users");
    if (res.ok) setUsers(await res.json());
  };

  const fetchRules = async () => {
    const res = await fetch("https://the-shadow-backend.vercel.app/api/rules");
    if (res.ok) setRules(await res.json());
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAddPlayer = async () => {
    if (!newName || !newPassword) return;
    const res = await fetch("https://the-shadow-backend.vercel.app/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, role: newRole, password: newPassword, adminToken: token }),
    });
    if (res.ok) {
      await fetchUsers();
      setNewName("");
      setNewPassword("");
      showMessage(`${newName} has joined the Fellowship!`);
    }
  };

  const handleRemovePlayer = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from the Fellowship?`)) return;
    const res = await fetch("https://the-shadow-backend.vercel.app/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminToken: token }),
    });
    if (res.ok) {
      await fetchUsers();
      showMessage(`${name} has left the Fellowship.`);
    }
  };

  const handleResetPassword = async (id: string) => {
    if (!resetPassword) return;
    const res = await fetch("https://the-shadow-backend.vercel.app/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: resetPassword, adminToken: token }),
    });
    if (res.ok) {
      setResetUserId(null);
      setResetPassword("");
      showMessage("Password updated!");
    }
  };

  const handleChangeRole = async (id: string, role: string) => {
    const res = await fetch("https://the-shadow-backend.vercel.app/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role, adminToken: token }),
    });
    if (res.ok) {
      await fetchUsers();
      showMessage("Role updated!");
    }
  };

  const handleAddRule = async () => {
    if (!newRuleTitle) return;
    const res = await fetch("https://the-shadow-backend.vercel.app/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newRuleTitle, description: newRuleDesc, category: newRuleCategory }),
    });
    if (res.ok) {
      await fetchRules();
      setNewRuleTitle("");
      setNewRuleDesc("");
      showMessage("Rule added!");
    }
  };

  const handleUpdateRule = async () => {
    if (!editingRule) return;
    const res = await fetch("https://the-shadow-backend.vercel.app/api/rules", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingRule),
    });
    if (res.ok) {
      await fetchRules();
      setEditingRule(null);
      showMessage("Rule updated!");
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Delete this rule?")) return;
    const res = await fetch("https://the-shadow-backend.vercel.app/api/rules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      await fetchRules();
      showMessage("Rule removed!");
    }
  };

  const categories = [...new Set(rules.map(r => r.category))];

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <button
        onClick={onLogout}
        className="absolute right-4 top-4 flex items-center gap-1 text-gold/40 hover:text-gold text-xs font-display uppercase tracking-widest transition-colors"
      >
        <LogOut className="w-3 h-3" />
        Leave the Shire
      </button>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-gold animate-flicker" />
          <h1 className="font-display text-4xl gold-text">DM Command Center</h1>
          <Sparkles className="w-6 h-6 text-gold animate-flicker" />
        </div>
        <p className="text-muted-foreground font-body italic">
          Welcome, {currentUser.name}. Your word is law.
        </p>
        <a href="/" className="text-gold/40 hover:text-gold text-xs font-display uppercase tracking-widest transition-colors mt-2 inline-block">
          ← Back to the Shire
        </a>
      </motion.header>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-4 p-3 bg-gold/10 border border-gold/30 rounded text-gold text-center font-display text-sm"
        >
          {message}
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('players')}
            className={`flex items-center gap-2 px-4 py-2 rounded font-display text-sm transition-colors ${activeTab === 'players' ? 'bg-gold text-background' : 'border border-gold/30 text-gold hover:bg-gold/10'}`}
          >
            <Shield className="w-4 h-4" />
            Players
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2 rounded font-display text-sm transition-colors ${activeTab === 'rules' ? 'bg-gold text-background' : 'border border-gold/30 text-gold hover:bg-gold/10'}`}
          >
            <ScrollText className="w-4 h-4" />
            Table Rules
          </button>
        </div>

        {activeTab === 'players' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <div className="p-6 border border-gold/30 bg-muted/10 rounded-lg">
              <h3 className="text-gold font-display mb-4 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add New Player
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Player name"
                    className="flex-1 p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
                  />
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
                  >
                    <option value="Player">Player</option>
                    <option value="DM">DM</option>
                  </select>
                </div>
                <input
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  type="password"
                  placeholder="Initial password"
                  className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
                />
                <button
                  onClick={handleAddPlayer}
                  disabled={!newName || !newPassword}
                  className="bg-gold text-background font-bold py-2 rounded hover:bg-gold/80 transition-colors disabled:opacity-50 font-display"
                >
                  Add to Fellowship
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {users.map(user => (
                <div key={user.id} className="p-4 border border-gold/20 bg-muted/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gold font-display">{user.name}</p>
                      <p className="text-muted-foreground text-xs">{user.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={e => handleChangeRole(user.id, e.target.value)}
                        className="p-1 bg-background border border-gold/20 text-gold rounded outline-none text-xs"
                      >
                        <option value="Player">Player</option>
                        <option value="DM">DM</option>
                      </select>
                      <button
                        onClick={() => setResetUserId(resetUserId === user.id ? null : user.id)}
                        className="p-2 border border-gold/20 text-gold rounded hover:bg-gold/10 transition-colors"
                        title="Reset password"
                      >
                        <KeyRound className="w-3 h-3" />
                      </button>
                      {user.name !== currentUser.name && (
                        <button
                          onClick={() => handleRemovePlayer(user.id, user.name)}
                          className="p-2 border border-red-400/20 text-red-400 rounded hover:bg-red-400/10 transition-colors"
                          title="Remove player"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  {resetUserId === user.id && (
                    <div className="flex gap-2 mt-3">
                      <input
                        value={resetPassword}
                        onChange={e => setResetPassword(e.target.value)}
                        type="password"
                        placeholder="New password"
                        className="flex-1 p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 text-sm"
                      />
                      <button
                        onClick={() => handleResetPassword(user.id)}
                        className="p-2 bg-gold text-background rounded hover:bg-gold/80 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setResetUserId(null); setResetPassword(""); }}
                        className="p-2 border border-gold/20 text-gold rounded hover:bg-muted/20 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'rules' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <div className="p-6 border border-gold/30 bg-muted/10 rounded-lg">
              <h3 className="text-gold font-display mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Rule
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    value={newRuleTitle}
                    onChange={e => setNewRuleTitle(e.target.value)}
                    placeholder="Rule title"
                    className="flex-1 p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
                  />
                  <input
                    value={newRuleCategory}
                    onChange={e => setNewRuleCategory(e.target.value)}
                    placeholder="Category"
                    className="w-32 p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
                  />
                </div>
                <textarea
                  value={newRuleDesc}
                  onChange={e => setNewRuleDesc(e.target.value)}
                  placeholder="Rule description..."
                  className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 h-20"
                />
                <button
                  onClick={handleAddRule}
                  disabled={!newRuleTitle}
                  className="bg-gold text-background font-bold py-2 rounded hover:bg-gold/80 transition-colors disabled:opacity-50 font-display"
                >
                  Inscribe Rule
                </button>
              </div>
            </div>

            {categories.length === 0 && (
              <p className="text-muted-foreground text-center italic font-body">No rules yet. Add your first rule above!</p>
            )}
            {categories.map(category => (
              <div key={category as string}>
                <h3 className="text-gold/60 text-xs uppercase tracking-widest font-display mb-3">{category as string}</h3>
                <div className="flex flex-col gap-3">
                  {rules.filter(r => r.category === category).map(rule => (
                    <div key={rule.id} className="p-4 border border-gold/20 bg-muted/5 rounded-lg">
                      {editingRule?.id === rule.id ? (
                        <div className="flex flex-col gap-2">
                          <input
                            value={editingRule.title}
                            onChange={e => setEditingRule({ ...editingRule, title: e.target.value })}
                            className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 text-sm"
                          />
                          <input
                            value={editingRule.category}
                            onChange={e => setEditingRule({ ...editingRule, category: e.target.value })}
                            className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 text-sm"
                          />
                          <textarea
                            value={editingRule.description}
                            onChange={e => setEditingRule({ ...editingRule, description: e.target.value })}
                            className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 text-sm h-16"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleUpdateRule} className="p-2 bg-gold text-background rounded hover:bg-gold/80">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingRule(null)} className="p-2 border border-gold/20 text-gold rounded hover:bg-muted/20">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-gold font-display">{rule.title}</p>
                            {rule.description && (
                              <p className="text-muted-foreground text-sm mt-1 font-body italic">{rule.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => setEditingRule(rule)}
                              className="p-2 border border-gold/20 text-gold rounded hover:bg-gold/10 transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteRule(rule.id)}
                              className="p-2 border border-red-400/20 text-red-400 rounded hover:bg-red-400/10 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}