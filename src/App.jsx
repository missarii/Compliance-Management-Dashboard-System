// src/App.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
/**
 * Full single-file frontend (React + Vite).
 * - Stores data in localStorage (so it's persistent across reloads).
 * - Simulates background workers with setInterval to generate reminders/notifications.
 * - Implements Tasks (create/assign/approve/comment), Maintenance records, Audits,
 * Documents with expiries and reminders, Users/Roles, Dashboard, Reports export, Settings.
 *
 * Paste into src/App.jsx in a Vite React project.
 */
/* ============================
   CSS (injected by component)
   UPDATED — Enhanced Professional Theme with Light/Dark Mode, Better Responsiveness for Mobile/Desktop
   ============================ */
const css = `
:root{
  /* Base variables for light mode */
  --bg-light: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
  --card-light: #ffffff;
  --text-light: #111827;
  --muted-light: #6b7280;
  --primary: #3b82f6; /* blue-500 */
  --primary-dark: #1d4ed8; /* blue-700 */
  --secondary: #10b981; /* green-500 */
  --danger: #ef4444;
  --warning: #f59e0b;
  --border: rgba(209, 213, 219, 0.8);
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  font-size: 14px;
  transition: all 300ms ease;
}

/* Dark mode variables */
.dark {
  --bg: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  --card: #1f2937;
  --text: #f3f4f6;
  --muted: #9ca3af;
  --primary: #60a5fa; /* blue-400 */
  --primary-dark: #3b82f6;
  --secondary: #34d399;
  --danger: #f87171;
  --warning: #fbbf24;
  --border: rgba(55, 65, 81, 0.8);
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

body {
  margin: 0;
  background: var(--bg-light);
  color: var(--text-light);
  height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dark body {
  background: var(--bg);
  color: var(--text);
}

/* Reset & base */
*{box-sizing:border-box}
html,body,#root{height:100%}

/* Layout */
.app{
  display:flex; height:100vh; overflow: hidden;
}
.sidebar{
  width: 280px; background: var(--card-light); border-right: 1px solid var(--border);
  padding: 20px; flex-shrink: 0; overflow-y: auto; transition: transform 300ms ease;
  box-shadow: var(--shadow);
}
.dark .sidebar { background: var(--card); }

/* Mobile sidebar */
@media (max-width: 768px) {
  .sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); z-index: 1000; }
  .sidebar.open { transform: translateX(0); }
  .app { flex-direction: column; }
}

/* Branding */
.brand{display:flex; gap:12px; align-items:center; margin-bottom: 20px;}
.logo{
  width:48px; height:48px; border-radius:8px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  display:flex; align-items:center; justify-content:center; font-weight:800; color:white;
  box-shadow: var(--shadow);
  transition: transform 300ms ease;
}
.logo:hover{ transform: scale(1.05); }
.brand h1{font-size:18px; margin:0;}

/* Nav */
.nav{display:flex; flex-direction:column; gap:8px;}
.nav button{
  background:transparent; border:0; color:var(--muted-light); text-align:left; padding:12px 16px; border-radius:8px; cursor:pointer;
  font-weight:500; display:flex; align-items:center; gap:8px; transition: all 200ms ease;
}
.dark .nav button { color: var(--muted); }
.nav button:hover{ background: rgba(59, 130, 246, 0.1); color: var(--primary); }
.nav button.active{ background: rgba(59, 130, 246, 0.15); color: var(--primary); font-weight:600; }

/* User box */
.user-box{margin-top:auto; padding-top:16px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:12px;}
.avatar{
  width:40px; height:40px; border-radius:50%; background: var(--primary); color:white;
  display:flex; align-items:center; justify-content:center; font-weight:700;
}

/* Main container */
.container{
  flex:1; overflow-y: auto; padding:20px; background: var(--bg-light);
}
.dark .container { background: var(--bg); }

/* Topbar */
.topbar{
  display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:20px;
  background: var(--card-light); padding:12px 16px; border-radius:12px; box-shadow: var(--shadow);
  border:1px solid var(--border);
}
.dark .topbar { background: var(--card); }
.search{
  flex:1; max-width:600px; display:flex; align-items:center; gap:8px; background:transparent;
  border:1px solid var(--border); padding:8px 12px; border-radius:8px;
}
.search input{ flex:1; background:transparent; border:0; outline:none; color:var(--text-light); }
.dark .search input { color: var(--text); }
.actions{display:flex; gap:8px;}

/* Buttons */
.btn{
  padding:10px 16px; border-radius:8px; border:0; background: var(--primary); color:white; cursor:pointer;
  font-weight:600; transition: all 200ms ease; box-shadow: var(--shadow);
}
.btn:hover{ background: var(--primary-dark); transform: translateY(-2px); }
.icon-btn{
  background: transparent; padding:8px; border-radius:8px; border:1px solid var(--border); color:var(--muted-light);
  cursor:pointer; transition: all 200ms ease;
}
.dark .icon-btn { color: var(--muted); }
.icon-btn:hover{ color: var(--primary); border-color: var(--primary); }

/* Cards */
.card{
  background:var(--card-light); padding:16px; border-radius:12px; box-shadow: var(--shadow);
  border:1px solid var(--border); transition: all 200ms ease;
}
.dark .card { background: var(--card); }
.card:hover{ transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
.grid-3{display:grid; grid-template-columns: repeat(3, 1fr); gap:16px;}
.grid-2{display:grid; grid-template-columns: repeat(2, 1fr); gap:16px;}
@media (max-width: 1024px) { .grid-3, .grid-2 { grid-template-columns: 1fr; } }

/* Tables */
.table{width:100%; border-collapse:collapse;}
.table th{font-weight:600; text-align:left; color:var(--muted-light); padding:12px; cursor:pointer;}
.dark .table th { color: var(--muted); }
.table th:hover { color: var(--primary); }
.table td{padding:12px; border-top:1px solid var(--border); color:var(--text-light);}
.dark .table td { color: var(--text); }
.table tr:hover { background: rgba(59, 130, 246, 0.05); }

/* Forms */
.input, textarea, select{
  background: transparent; border:1px solid var(--border); padding:10px 12px; border-radius:8px;
  color:var(--text-light); width:100%; transition: all 200ms ease;
}
.dark .input, .dark textarea, .dark select { color: var(--text); }
.input:focus, textarea:focus, select:focus{ border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); outline:none; }

/* Status badges */
.status-open{ background: rgba(59,130,246,0.1); color:var(--primary); padding:6px 12px; border-radius:999px; font-weight:600; }
.status-done{ background: rgba(16,185,129,0.1); color:var(--secondary); padding:6px 12px; border-radius:999px; font-weight:600; }
.status-overdue{ background: rgba(239,68,68,0.1); color:var(--danger); padding:6px 12px; border-radius:999px; font-weight:600; }

/* Animations */
@keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: none; } }
.fade-in { animation: fadeIn 300ms ease; }

/* Hamburger for mobile */
.hamburger { display:none; cursor:pointer; }
@media (max-width: 768px) { .hamburger { display: block; font-size:24px; } }

/* Accessibility */
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
`;
/* ============================
   Utilities & helpers
   ============================ */
const uid = (prefix = "") =>
  prefix +
  Math.random().toString(36).slice(2, 9) +
  "-" +
  Date.now().toString(36).slice(-4);
const nowISO = () => new Date().toISOString();
const daysFromNowISO = (d) =>
  new Date(Date.now() + d * 24 * 60 * 60 * 1000).toISOString();
const readStorage = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    if (!v) return fallback;
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};
const writeStorage = (k, v) => localStorage.setItem(k, JSON.stringify(v));
/* Defaults seed (only if nothing in localStorage) */
const seedIfEmpty = () => {
  if (!localStorage.getItem("cms_users")) {
    const users = [
      {
        id: "u_admin",
        name: "Admin User",
        email: "admin@local",
        role: "Admin",
        password: "password",
        createdAt: nowISO(),
      },
      {
        id: "u_sup",
        name: "Supervisor",
        email: "super@local",
        role: "Supervisor",
        password: "password",
        createdAt: nowISO(),
      },
      {
        id: "u_aud",
        name: "Auditor",
        email: "auditor@local",
        role: "Auditor",
        password: "password",
        createdAt: nowISO(),
      },
      {
        id: "u_user",
        name: "Regular User",
        email: "user@local",
        role: "User",
        password: "password",
        createdAt: nowISO(),
      },
    ];
    writeStorage("cms_users", users);
  }
  if (!localStorage.getItem("cms_settings")) {
    writeStorage("cms_settings", {
      reminderDays: [90, 60, 30, 7],
      siteName: "Compliance CMS (Demo)",
      timezone: "UTC",
      theme: "light",
    });
  }
  if (!localStorage.getItem("cms_tasks")) {
    const tasks = [
      {
        id: uid("t_"),
        title: "Inspect backup generator",
        description: "Check oil level and start test run",
        category: "Maintenance",
        priority: "High",
        status: "Open",
        assignedTo: "u_user",
        createdBy: "u_admin",
        dueDate: daysFromNowISO(2),
        approval: "Pending",
        comments: [],
        attachments: [],
        createdAt: nowISO(),
      },
    ];
    writeStorage("cms_tasks", tasks);
  }
  if (!localStorage.getItem("cms_documents")) {
    const documents = [
      {
        id: uid("d_"),
        title: "Company Insurance",
        owner: "Company",
        docType: "Insurance",
        expiryDate: daysFromNowISO(40),
        uploadedBy: "u_admin",
        file: null,
        remindersSent: [],
        createdAt: nowISO(),
      },
      {
        id: uid("d_"),
        title: "Supervisor Passport",
        owner: "Supervisor",
        docType: "Passport",
        expiryDate: daysFromNowISO(370),
        uploadedBy: "u_sup",
        file: null,
        remindersSent: [],
        createdAt: nowISO(),
      },
    ];
    writeStorage("cms_documents", documents);
  }
  if (!localStorage.getItem("cms_maintenance")) {
    const maintenance = [
      {
        id: uid("m_"),
        title: "AC Filter Replacement",
        asset: "HQ AC #1",
        category: "HVAC",
        vendor: "CoolAir Solutions",
        cost: 120,
        date: daysFromNowISO(-10),
        nextServiceDate: daysFromNowISO(180),
        notes: "Replaced filters and inspected coolant",
        attachments: [],
        createdBy: "u_user",
        createdAt: nowISO(),
      },
    ];
    writeStorage("cms_maintenance", maintenance);
  }
  if (!localStorage.getItem("cms_audits")) {
    const audits = [
      {
        id: uid("a_"),
        auditDate: daysFromNowISO(-30),
        auditor: "u_aud",
        findings: "Minor safety signage missing near storage",
        correctiveActions: [
          { id: uid("ca_"), text: "Install signage", owner: "u_user", dueDate: daysFromNowISO(5), status: "Open" },
        ],
        status: "Closed",
        attachments: [],
        createdAt: nowISO(),
      },
    ];
    writeStorage("cms_audits", audits);
  }
  if (!localStorage.getItem("cms_notifications")) {
    writeStorage("cms_notifications", []);
  }
  if (!localStorage.getItem("cms_logs")) {
    writeStorage("cms_logs", []);
  }
};
seedIfEmpty();
/* ============================
   Hook: useLocalModel
   Tiny local persistence + change triggers
   ============================ */
function useLocalModel(key, initial) {
  const [state, setState] = useState(() => readStorage(key, initial || []));
  useEffect(() => {
    writeStorage(key, state);
  }, [key, state]);
  return [state, setState];
}
/* ============================
   Simple chart components (SVG)
   ============================ */
function MiniBar({ values = [], colors = ["#3b82f6"] }) {
  const max = Math.max(1, ...values);
  return (
    <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
      {values.map((v, i) => {
        const w = 16;
        const gap = 4;
        const x = i * (w + gap);
        const h = (v / max) * 32;
        return (
          <rect key={i} x={x} y={40 - h} width={w} height={h} rx="4" fill={colors[i % colors.length]} />
        );
      })}
    </svg>
  );
}
function Donut({ value = 0, total = 100, color = "#10b981", size = 64 }) {
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.round((value / Math.max(1, total)) * 100));
  const strokeDashoffset = circumference * (1 - pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke={color + "33"} strokeWidth="8" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90)"
      />
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize="14" fill={color} fontWeight="600">
        {pct}%
      </text>
    </svg>
  );
}
/* ============================
   CSV Export/Import helpers
   ============================ */
const exportCSV = (filename, rows) => {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(",")]
    .concat(rows.map((r) => keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
const importCSV = (file, onImport) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const rows = text.split("\n").map((line) => line.split(",").map((v) => v.replace(/^"|"$/g, "")));
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i]));
      return obj;
    });
    onImport(data);
  };
  reader.readAsText(file);
};
/* ============================
   Main App
   ============================ */
export default function App() {
  /* State models (persisted) */
  const [users, setUsers] = useLocalModel("cms_users", []);
  const [tasks, setTasks] = useLocalModel("cms_tasks", []);
  const [documents, setDocuments] = useLocalModel("cms_documents", []);
  const [maintenance, setMaintenance] = useLocalModel("cms_maintenance", []);
  const [audits, setAudits] = useLocalModel("cms_audits", []);
  const [notifications, setNotifications] = useLocalModel("cms_notifications", []);
  const [logs, setLogs] = useLocalModel("cms_logs", []);
  const [settings, setSettings] = useLocalModel("cms_settings", { reminderDays: [90, 60, 30, 7], siteName: "Compliance CMS (Demo)", timezone: "UTC", theme: "light" });
  /* UI state */
  const [route, setRoute] = useState("Dashboard");
  const [filterText, setFilterText] = useState("");
  const [currentUser, setCurrentUser] = useState(() => readStorage("cms_current_user", null));
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // local refs
  const schedulerRef = useRef();
  /* Derived metrics */
  const totals = useMemo(() => {
    const overdueTasks = tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "Done").length;
    const upcomingExpiries = documents.filter((d) => new Date(d.expiryDate) < new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)).length;
    const openAudits = audits.filter((a) => a.status !== "Closed").length;
    return { tasksTotal: tasks.length, overdueTasks, upcomingExpiries, openAudits };
  }, [tasks, documents, audits]);
  /* Apply theme */
  useEffect(() => {
    document.body.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme]);
  /* ===== Authentication (simple simulated) ===== */
  const login = (email, password) => {
    const u = users.find((x) => x.email === email && x.password === password);
    if (!u) {
      setToast({ type: "error", text: "Invalid credentials" });
      return false;
    }
    setCurrentUser(u);
    writeStorage("cms_current_user", u);
    logAction(`User ${u.name} logged in`);
    setToast({ type: "success", text: `Welcome back, ${u.name}` });
    return true;
  };
  const logout = () => {
    logAction(`User ${currentUser.name} logged out`);
    setCurrentUser(null);
    localStorage.removeItem("cms_current_user");
    setToast({ type: "info", text: "Logged out" });
  };
  const updatePassword = (oldPass, newPass) => {
    if (currentUser.password !== oldPass) {
      setToast({ type: "error", text: "Incorrect old password" });
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, password: newPass } : u))
    );
    setToast({ type: "success", text: "Password updated" });
    logAction(`User ${currentUser.name} updated password`);
  };
  /* ===== Notifications & Scheduler (simulate background jobs) ===== */
  useEffect(() => {
    // one-time scheduling function: evaluate documents expiries and create notifications
    const runReminderWorker = () => {
      const rd = settings.reminderDays || [90, 60, 30, 7];
      const now = Date.now();
      const newNotes = [];
      documents.forEach((doc) => {
        const expiry = new Date(doc.expiryDate).getTime();
        rd.forEach((daysBefore) => {
          const target = expiry - daysBefore * 24 * 60 * 60 * 1000;
          const already = doc.remindersSent?.includes(daysBefore);
          if (!already && now >= target - 1000 * 60 * 60 * 12 && now <= target + 1000 * 60 * 60 * 24 * 14) {
            newNotes.push({
              id: uid("n_"),
              type: "ExpiryReminder",
              title: `Reminder: "${doc.title}" expires in ${daysBefore} day(s)`,
              docId: doc.id,
              recipient: null,
              createdAt: nowISO(),
              meta: { daysBefore },
              status: "Pending",
              read: false,
            });
            doc.remindersSent = doc.remindersSent || [];
            doc.remindersSent.push(daysBefore);
          }
        });
      });
      if (newNotes.length) {
        setNotifications((prev) => [...newNotes, ...prev]);
        // persist modified documents
        setDocuments([...documents]);
        logAction(`Generated ${newNotes.length} expiry reminders`);
      }
    };
    // run on load
    runReminderWorker();
    // schedule periodic worker every 60 seconds (demo)
    schedulerRef.current = setInterval(runReminderWorker, 60 * 1000);
    return () => clearInterval(schedulerRef.current);
  }, [documents, settings.reminderDays]);
  // Simulate "sending" notifications: process pending notifications and mark delivered
  useEffect(() => {
    const deliverPending = () => {
      const pending = notifications.filter((n) => n.status === "Pending");
      if (pending.length === 0) return;
      const next = pending[0];
      // deliver to admins or all based on type
      const recipients = users.filter((u) => u.role === "Admin" || u.role === "Supervisor");
      next.recipient = recipients.map((r) => r.id);
      next.status = "Sent";
      next.deliveredAt = nowISO();
      setNotifications((prev) => {
        const others = prev.filter((p) => p.id !== next.id);
        return [next, ...others];
      });
      setToast({ type: "info", text: `Notification sent: ${next.title}` });
      logAction(`Sent notification: ${next.title}`);
    };
    const t = setInterval(deliverPending, 8 * 1000);
    return () => clearInterval(t);
  }, [notifications, users]);
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  /* ===== Activity Logging ===== */
  const logAction = (action) => {
    const log = {
      id: uid("l_"),
      user: currentUser?.id || "system",
      action,
      createdAt: nowISO(),
    };
    setLogs((prev) => [log, ...prev]);
  };
  /* ===== CRUD operations for modules ===== */
  // Tasks
  const createTask = async (payload) => {
    if (!hasPermission("create_task")) return;
    let attachments = [];
    if (payload.attachments) {
      attachments = await Promise.all(
        payload.attachments.map((f) => toBase64(f).then((c) => ({ name: f.name, content: c })))
      );
    }
    const t = {
      id: uid("t_"),
      ...payload,
      status: "Open",
      createdBy: currentUser?.id,
      approval: "Pending",
      comments: [],
      attachments,
      createdAt: nowISO(),
    };
    setTasks((p) => [t, ...p]);
    setToast({ type: "success", text: "Task created" });
    logAction(`Created task: ${t.title}`);
    return t;
  };
  const updateTask = (id, patch) => {
    if (!hasPermission("update_task")) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: nowISO() } : t)));
    logAction(`Updated task ${id}`);
  };
  const addTaskComment = (id, comment) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, comments: [{ id: uid("c_"), user: currentUser?.id, text: comment, createdAt: nowISO() }, ...t.comments] }
          : t
      )
    );
    logAction(`Commented on task ${id}`);
  };
  // Documents
  const createDocument = async ({ title, owner, docType, expiryDate, file }) => {
    if (!hasPermission("create_document")) return;
    let fileData = null;
    if (file) {
      fileData = await toBase64(file);
    }
    const d = {
      id: uid("d_"),
      title,
      owner,
      docType,
      expiryDate,
      uploadedBy: currentUser?.id,
      file: fileData ? { name: file.name, content: fileData } : null,
      remindersSent: [],
      createdAt: nowISO(),
    };
    setDocuments((p) => [d, ...p]);
    setToast({ type: "success", text: "Document saved" });
    logAction(`Created document: ${d.title}`);
  };
  const updateDocument = (id, patch) => {
    if (!hasPermission("update_document")) return;
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    logAction(`Updated document ${id}`);
  };
  // Maintenance
  const createMaintenance = async ({ title, asset, category, vendor, cost, date, nextServiceDate, notes, attachments }) => {
    if (!hasPermission("create_maintenance")) return;
    const att = await Promise.all((attachments || []).map((f) => toBase64(f).then((c) => ({ name: f.name, content: c }))));
    const m = { id: uid("m_"), title, asset, category, vendor, cost: +cost, date, nextServiceDate, notes, attachments: att, createdBy: currentUser?.id, createdAt: nowISO() };
    setMaintenance((p) => [m, ...p]);
    setToast({ type: "success", text: "Maintenance record saved" });
    logAction(`Created maintenance: ${m.title}`);
  };
  // Audits
  const createAudit = ({ auditDate, auditor, findings, correctiveActions = [], attachments = [] }) => {
    if (!hasPermission("create_audit")) return;
    const a = { id: uid("a_"), auditDate, auditor, findings, correctiveActions, attachments, status: "Open", createdAt: nowISO() };
    setAudits((p) => [a, ...p]);
    setToast({ type: "success", text: "Audit created" });
    logAction(`Created audit on ${auditDate}`);
  };
  // Users
  const createUser = ({ name, email, role, password }) => {
    if (!hasPermission("create_user")) return;
    if (users.find((u) => u.email === email)) {
      setToast({ type: "error", text: "Email already exists" });
      return;
    }
    const u = { id: uid("u_"), name, email, role, password, createdAt: nowISO() };
    setUsers((p) => [u, ...p]);
    setToast({ type: "success", text: "User created" });
    logAction(`Created user: ${u.name}`);
  };
  const updateUser = (id, patch) => {
    if (!hasPermission("update_user")) return;
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    logAction(`Updated user ${id}`);
  };
  // Notifications: admin can send custom
  const sendNotification = (title, text, type = "Custom", recipientIds = []) => {
    if (!hasPermission("send_notification")) return;
    const n = { id: uid("n_"), type, title, text, createdAt: nowISO(), status: "Pending", recipient: recipientIds, read: false };
    setNotifications((p) => [n, ...p]);
    setToast({ type: "success", text: "Notification queued" });
    logAction(`Queued notification: ${title}`);
  };
  /* ===== Permissions based on role ===== */
  const hasPermission = (perm) => {
    if (!currentUser) return false;
    const role = currentUser.role;
    if (role === "Admin") return true;
    if (role === "Supervisor" && ["create_task", "update_task", "approve_task", "create_document", "update_document", "create_maintenance"].includes(perm)) return true;
    if (role === "Auditor" && ["create_audit"].includes(perm)) return true;
    if (role === "User" && ["view_own"].includes(perm)) return true;
    return false;
  };
  const ensureAuth = (perm) => {
    if (!currentUser) {
      setModal({ type: "login" });
      return false;
    }
    if (perm && !hasPermission(perm)) {
      setToast({ type: "error", text: "Insufficient permissions" });
      return false;
    }
    return true;
  };
  // convert File to base64
  function toBase64(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }
  /* ===== Small reusable components inside App ===== */
  const SideNav = () => (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="brand">
        <div className="logo">CMS</div>
        <div>
          <h1>{settings.siteName || "Compliance CMS (Demo)"}</h1>
          <div className="small-muted">Enhanced Demo</div>
        </div>
      </div>
      <div className="nav">
        {["Dashboard", "Tasks", "Maintenance", "Audits", "Documents", "Reports", "Users", "Notifications", "Activity Log", "Settings"].map((r) => (
          <button key={r} className={r === route ? "active" : ""} onClick={() => { setRoute(r); setSidebarOpen(false); }}>
            {r}
          </button>
        ))}
      </div>
      <div className="user-box">
        {currentUser ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="avatar">{currentUser.name.split(" ").map((s) => s[0]).join("")}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{currentUser.name}</div>
                <div className="small-muted">{currentUser.role}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="icon-btn" onClick={() => { setModal({ type: "profile" }); setSidebarOpen(false); }}>Profile</button>
              <button className="icon-btn" onClick={() => { logout(); setSidebarOpen(false); }}>Logout</button>
            </div>
          </>
        ) : (
          <button className="btn" onClick={() => { setModal({ type: "login" }); setSidebarOpen(false); }}>Login</button>
        )}
      </div>
    </div>
  );
  /* ===== Pages ===== */
  function DashboardPage() {
    const upcomingDocs = documents.filter((d) => new Date(d.expiryDate) < new Date(Date.now() + 1000 * 60 * 60 * 24 * 120)).slice(0, 5);
    const recentTasks = tasks.slice(0, 6);
    const costs = maintenance.slice(0, 6).map((m) => m.cost || 0);
    const unreadNotes = notifications.filter((n) => !n.read && (n.recipient?.includes(currentUser?.id) || !n.recipient)).length;
    return (
      <div className="fade-in">
        <div className="grid-3">
          <div className="card">
            <div className="widget-title"><div className="kpi"><h3>Tasks</h3><div className="value">{totals.tasksTotal}</div></div><Donut value={totals.tasksTotal - totals.overdueTasks} total={totals.tasksTotal || 1} /></div>
            <div>Overdue: <span style={{ color: totals.overdueTasks ? "var(--danger)" : "var(--muted)" }}>{totals.overdueTasks}</span></div>
          </div>
          <div className="card">
            <div className="widget-title"><div className="kpi"><h3>Expiries (120d)</h3><div className="value">{totals.upcomingExpiries}</div></div><Donut value={totals.upcomingExpiries} total={documents.length || 1} color="#f59e0b" /></div>
            <div>Reminders: {settings.reminderDays?.join(", ")} days</div>
          </div>
          <div className="card">
            <div className="widget-title"><div className="kpi"><h3>Open Audits</h3><div className="value">{totals.openAudits}</div></div><MiniBar values={costs} /></div>
            <div>Recent costs</div>
          </div>
        </div>
        <div className="grid-2" style={{ marginTop: 16 }}>
          <div className="card">
            <div className="widget-title"><h3>Upcoming Expiries</h3><span>{upcomingDocs.length} items</span></div>
            <table className="table">
              <thead><tr><th>Title</th><th>Type</th><th>Expiry</th></tr></thead>
              <tbody>{upcomingDocs.map((d) => (<tr key={d.id}><td>{d.title}</td><td>{d.docType}</td><td>{new Date(d.expiryDate).toLocaleDateString()}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="card">
            <div className="widget-title"><h3>Recent Tasks</h3><span>Unread Notifications: {unreadNotes}</span></div>
            {recentTasks.map((t) => (
              <div key={t.id} className="file-preview"><strong>{t.title}</strong><span className={`status-${t.status.toLowerCase()}`}>{t.status}</span><button className="icon-btn" onClick={() => setModal({ type: "viewTask", id: t.id })}>View</button></div>
            ))}
          </div>
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          <div className="widget-title"><h3>Quick Actions</h3></div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => ensureAuth("create_task") && setModal({ type: "createTask" })}>New Task</button>
            <button className="btn" onClick={() => ensureAuth("create_document") && setModal({ type: "uploadDoc" })}>Upload Doc</button>
            <button className="btn" onClick={() => ensureAuth("create_maintenance") && setModal({ type: "createMaintenance" })}>Add Maintenance</button>
            <button className="btn" onClick={() => ensureAuth("create_audit") && setModal({ type: "createAudit" })}>New Audit</button>
          </div>
        </div>
      </div>
    );
  }
  function TasksPage() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ field: "dueDate", dir: "asc" });
    let list = tasks.filter((t) => {
      if (filter === "My" && t.assignedTo !== currentUser?.id) return false;
      if (filter === "Open" && t.status !== "Open") return false;
      if (filter === "Done" && t.status !== "Done") return false;
      if (search && !`${t.title} ${t.description}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    list = list.sort((a, b) => {
      const valA = a[sort.field], valB = b[sort.field];
      if (sort.field === "dueDate") return (new Date(valA) - new Date(valB)) * (sort.dir === "asc" ? 1 : -1);
      return (valA > valB ? 1 : -1) * (sort.dir === "asc" ? 1 : -1);
    });
    const toggleSort = (field) => setSort({ field, dir: sort.field === field && sort.dir === "asc" ? "desc" : "asc" });
    return (
      <div className="card fade-in">
        <div className="row">
          <h3>Tasks</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={() => ensureAuth("create_task") && setModal({ type: "createTask" })}>New Task</button>
            <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option><option>My</option><option>Open</option><option>Done</option></select>
            <input className="input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th onClick={() => toggleSort("title")}>Title {sort.field === "title" && (sort.dir === "asc" ? "↑" : "↓")}</th>
              <th onClick={() => toggleSort("assignedTo")}>Assigned</th>
              <th onClick={() => toggleSort("priority")}>Priority</th>
              <th onClick={() => toggleSort("dueDate")}>Due {sort.field === "dueDate" && (sort.dir === "asc" ? "↑" : "↓")}</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.title}</strong> <div className="small-muted">{t.description.slice(0, 50)}...</div></td>
                <td>{users.find((u) => u.id === t.assignedTo)?.name || "Unassigned"}</td>
                <td>{t.priority}</td>
                <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                <td><span className={`status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="icon-btn" onClick={() => setModal({ type: "viewTask", id: t.id })}>View</button>
                  {hasPermission("update_task") && <button className="icon-btn" onClick={() => updateTask(t.id, { status: t.status === "Done" ? "Open" : "Done" })}>{t.status === "Done" ? "Reopen" : "Done"}</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  function MaintenancePage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ field: "nextServiceDate", dir: "asc" });
    let list = maintenance.filter((m) => search ? `${m.title} ${m.asset}`.toLowerCase().includes(search.toLowerCase()) : true);
    list = list.sort((a, b) => (new Date(a[sort.field]) - new Date(b[sort.field])) * (sort.dir === "asc" ? 1 : -1));
    const toggleSort = (field) => setSort({ field, dir: sort.field === field && sort.dir === "asc" ? "desc" : "asc" });
    return (
      <div className="card fade-in">
        <div className="row">
          <h3>Maintenance</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={() => ensureAuth("create_maintenance") && setModal({ type: "createMaintenance" })}>Add Record</button>
            <input className="input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th onClick={() => toggleSort("title")}>Title</th>
              <th>Asset</th>
              <th>Vendor</th>
              <th>Cost</th>
              <th onClick={() => toggleSort("nextServiceDate")}>Next Service {sort.field === "nextServiceDate" && (sort.dir === "asc" ? "↑" : "↓")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td><strong>{m.title}</strong> <div className="small-muted">{m.notes.slice(0, 50)}...</div></td>
                <td>{m.asset}</td>
                <td>{m.vendor}</td>
                <td>${m.cost}</td>
                <td>{new Date(m.nextServiceDate).toLocaleDateString()}</td>
                <td><button className="icon-btn" onClick={() => setModal({ type: "viewMaintenance", id: m.id })}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  function AuditsPage() {
    const [search, setSearch] = useState("");
    const list = audits.filter((a) => search ? a.findings.toLowerCase().includes(search.toLowerCase()) : true);
    return (
      <div className="card fade-in">
        <div className="row">
          <h3>Audits</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={() => ensureAuth("create_audit") && setModal({ type: "createAudit" })}>New Audit</button>
            <input className="input" placeholder="Search findings..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          {list.map((a) => (
            <div key={a.id} className="card" style={{ marginBottom: 12 }}>
              <div className="row"><strong>Audit {new Date(a.auditDate).toLocaleDateString()}</strong><span className={`status-${a.status.toLowerCase()}`}>{a.status}</span></div>
              <div>By: {users.find((u) => u.id === a.auditor)?.name}</div>
              <div>{a.findings}</div>
              <div style={{ marginTop: 8 }}>
                <strong>Actions:</strong>
                <ul>{a.correctiveActions.map((c) => <li key={c.id}>{c.text} - {users.find((u) => u.id === c.owner)?.name} - Due: {new Date(c.dueDate).toLocaleDateString()} - {c.status}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  function DocumentsPage() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const types = [...new Set(documents.map((d) => d.docType))];
    const list = documents.filter((d) => (filter === "All" || d.docType === filter || d.owner === filter) && (!search || d.title.toLowerCase().includes(search.toLowerCase())));
    return (
      <div className="card fade-in">
        <div className="row">
          <h3>Documents</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={() => ensureAuth("create_document") && setModal({ type: "uploadDoc" })}>Upload</button>
            <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option><option>Company</option><option>Supervisor</option>{types.map((t) => <option key={t}>{t}</option>)}</select>
            <input className="input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <table className="table" style={{ marginTop: 12 }}>
          <thead><tr><th>Title</th><th>Owner</th><th>Type</th><th>Expiry</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td>{d.owner}</td>
                <td>{d.docType}</td>
                <td style={{ color: new Date(d.expiryDate) < new Date() ? "var(--danger)" : "var(--muted)" }}>{new Date(d.expiryDate).toLocaleDateString()}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  {d.file && <button className="icon-btn" onClick={() => setModal({ type: "viewFile", file: d.file, title: d.title })}>View</button>}
                  {hasPermission("update_document") && <button className="icon-btn" onClick={() => setModal({ type: "editDoc", id: d.id })}>Edit</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  function ReportsPage() {
    const exportTasks = () => exportCSV("tasks.csv", tasks.map((t) => ({ ...t, assignedTo: users.find((u) => u.id === t.assignedTo)?.name })));
    const exportDocs = () => exportCSV("documents.csv", documents);
    const importTasks = (file) => importCSV(file, (data) => { setTasks((p) => [...data.map((d) => ({ ...d, id: uid("t_"), createdAt: nowISO() })), ...p]); setToast({ type: "success", text: "Imported tasks" }); logAction("Imported tasks from CSV"); });
    return (
      <div className="card fade-in">
        <div className="row"><h3>Reports</h3><div style={{ display: "flex", gap: 8 }}><button className="btn" onClick={exportTasks}>Export Tasks</button><button className="btn" onClick={exportDocs}>Export Docs</button></div></div>
        <div style={{ marginTop: 12 }}>
          <label>Import Tasks CSV <input type="file" accept=".csv" onChange={(e) => importTasks(e.target.files[0])} /></label>
        </div>
      </div>
    );
  }
  function UsersPage() {
    const [form, setForm] = useState({ name: "", email: "", role: "User", password: "password" });
    return (
      <div className="fade-in">
        <div className="card">
          <div className="row"><h3>Users</h3></div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h4>Create User</h4>
              <div className="flex-col">
                <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>User</option><option>Supervisor</option><option>Auditor</option><option>Admin</option></select>
                <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button className="btn" onClick={() => { ensureAuth("create_user") && createUser(form); setForm({ name: "", email: "", role: "User", password: "password" }); }}>Create</button>
              </div>
            </div>
            <div style={{ flex: 2 }}>
              <h4>Users List</h4>
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className="status-open">{u.role}</span></td>
                      <td><button className="icon-btn" onClick={() => ensureAuth("update_user") && setModal({ type: "editUser", id: u.id })}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function NotificationsPage() {
    const userNotes = notifications.filter((n) => n.recipient?.includes(currentUser?.id) || !n.recipient);
    return (
      <div className="card fade-in">
        <div className="row"><h3>Notifications</h3><button className="btn" onClick={() => ensureAuth("send_notification") && setModal({ type: "sendNotification" })}>Send Custom</button></div>
        <table className="table" style={{ marginTop: 12 }}>
          <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {userNotes.map((n) => (
              <tr key={n.id} style={{ opacity: n.read ? 0.6 : 1 }}>
                <td>{n.title}</td>
                <td>{n.type}</td>
                <td>{n.status}</td>
                <td>{new Date(n.createdAt).toLocaleString()}</td>
                <td>{!n.read && <button className="icon-btn" onClick={() => markNotificationRead(n.id)}>Mark Read</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  function ActivityLogPage() {
    return (
      <div className="card fade-in">
        <h3>Activity Log</h3>
        <table className="table">
          <thead><tr><th>User</th><th>Action</th><th>Date</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{users.find((u) => u.id === l.user)?.name || "System"}</td>
                <td>{l.action}</td>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  function SettingsPage() {
    const [local, setLocal] = useState(settings);
    const save = () => { setSettings(local); setToast({ type: "success", text: "Settings saved" }); logAction("Updated settings"); };
    return (
      <div className="card fade-in">
        <h3>Settings</h3>
        <div className="flex-col" style={{ maxWidth: 400 }}>
          <label>Site Name</label>
          <input className="input" value={local.siteName} onChange={(e) => setLocal({ ...local, siteName: e.target.value })} />
          <label>Reminder Days (comma separated)</label>
          <input className="input" value={local.reminderDays.join(", ")} onChange={(e) => setLocal({ ...local, reminderDays: e.target.value.split(",").map((s) => +s.trim()).filter((n) => !isNaN(n)) })} />
          <label>Theme</label>
          <select className="input" value={local.theme} onChange={(e) => setLocal({ ...local, theme: e.target.value })}><option>light</option><option>dark</option></select>
          <button className="btn" onClick={save}>Save</button>
        </div>
      </div>
    );
  }
  /* ===== Modal handling ===== */
  function ModalContainer() {
    if (!modal) return null;
    const t = modal.type;
    if (t === "login") return <LoginModal onClose={() => setModal(null)} onLogin={login} />;
    if (t === "profile") return <ProfileModal user={currentUser} onClose={() => setModal(null)} onUpdate={(patch) => updateUser(currentUser.id, patch)} onPassword={updatePassword} />;
    if (t === "editUser") {
      const user = users.find((u) => u.id === modal.id);
      return <ProfileModal user={user} onClose={() => setModal(null)} onUpdate={(patch) => updateUser(user.id, patch)} />;
    }
    if (t === "createTask") return <CreateTaskModal onClose={() => setModal(null)} onCreate={createTask} users={users} />;
    if (t === "viewTask") {
      const tsk = tasks.find((x) => x.id === modal.id);
      return <ViewTaskModal task={tsk} onClose={() => setModal(null)} onUpdate={updateTask} onComment={addTaskComment} users={users} currentUser={currentUser} hasApprove={hasPermission("approve_task")} />;
    }
    if (t === "uploadDoc") return <UploadDocModal onClose={() => setModal(null)} onUpload={createDocument} />;
    if (t === "editDoc") {
      const doc = documents.find((d) => d.id === modal.id);
      return <EditDocModal doc={doc} onClose={() => setModal(null)} onSave={updateDocument} />;
    }
    if (t === "viewFile") return <FileViewer file={modal.file} title={modal.title} onClose={() => setModal(null)} />;
    if (t === "createMaintenance") return <CreateMaintenanceModal onClose={() => setModal(null)} onCreate={createMaintenance} />;
    if (t === "viewMaintenance") {
      const m = maintenance.find((x) => x.id === modal.id);
      return <ViewMaintenanceModal maintenance={m} onClose={() => setModal(null)} />;
    }
    if (t === "createAudit") return <CreateAuditModal onClose={() => setModal(null)} onCreate={createAudit} users={users} />;
    if (t === "sendNotification") return <SendNotificationModal onClose={() => setModal(null)} onSend={sendNotification} users={users} />;
    return null;
  }
  /* ===== UI Layout ===== */
  return (
    <div className="app">
      <style>{css}</style>
      <SideNav />
      <div className="container">
        <div className="topbar">
          <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</div>
          <div className="search">
            <input placeholder="Global Search..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div className="actions">
            <button className="icon-btn" onClick={() => setRoute("Notifications")}>🔔 {notifications.filter((n) => !n.read && (n.recipient?.includes(currentUser?.id) || !n.recipient)).length}</button>
            {currentUser && <button className="icon-btn" onClick={() => setModal({ type: "profile" })}>Profile</button>}
            {!currentUser && <button className="btn" onClick={() => setModal({ type: "login" })}>Login</button>}
          </div>
        </div>
        {route === "Dashboard" && <DashboardPage />}
        {route === "Tasks" && <TasksPage />}
        {route === "Maintenance" && <MaintenancePage />}
        {route === "Audits" && <AuditsPage />}
        {route === "Documents" && <DocumentsPage />}
        {route === "Reports" && <ReportsPage />}
        {route === "Users" && <UsersPage />}
        {route === "Notifications" && <NotificationsPage />}
        {route === "Activity Log" && <ActivityLogPage />}
        {route === "Settings" && <SettingsPage />}
      </div>
      <ModalContainer />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
/* ============================
   Modal Components & forms
   ============================ */
function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("admin@local");
  const [password, setPassword] = useState("password");
  return (
    <ModalShell title="Login" onClose={onClose}>
      <div className="flex-col">
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" onClick={() => { if (onLogin(email, password)) onClose(); }}>Login</button>
        <div className="small-muted">Demo: admin@local / password</div>
      </div>
    </ModalShell>
  );
}
function ProfileModal({ user, onClose, onUpdate, onPassword }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role });
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  return (
    <ModalShell title="Profile" onClose={onClose}>
      <div className="flex-col">
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} disabled={user.id === "u_admin"}><option>User</option><option>Supervisor</option><option>Auditor</option><option>Admin</option></select>
        <button className="btn" onClick={() => { onUpdate(form); onClose(); }}>Update Profile</button>
        <div style={{ marginTop: 16 }}>
          <h4>Change Password</h4>
          <input className="input" type="password" placeholder="Old Password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
          <input className="input" type="password" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          <button className="btn" onClick={() => { onPassword(oldPass, newPass); onClose(); }}>Change</button>
        </div>
      </div>
    </ModalShell>
  );
}
function CreateTaskModal({ onClose, onCreate, users }) {
  const [form, setForm] = useState({ title: "", description: "", category: "General", priority: "Medium", assignedTo: users[0]?.id, dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), attachments: [] });
  return (
    <ModalShell title="Create Task" onClose={onClose}>
      <div className="flex-col">
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>General</option><option>Maintenance</option><option>Safety</option></select>
        <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>High</option><option>Medium</option><option>Low</option></select>
        <select className="input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
        <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <input type="file" multiple onChange={(e) => setForm({ ...form, attachments: Array.from(e.target.files) })} />
        <button className="btn" onClick={() => { onCreate(form); onClose(); }}>Create</button>
      </div>
    </ModalShell>
  );
}
function ViewTaskModal({ task, onClose, onUpdate, onComment, users, currentUser, hasApprove }) {
  const [comment, setComment] = useState("");
  return (
    <ModalShell title={task.title} onClose={onClose}>
      <div className="flex-col">
        <div>Priority: {task.priority} | Due: {new Date(task.dueDate).toLocaleDateString()} | Category: {task.category}</div>
        <p>{task.description}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => onUpdate(task.id, { status: task.status === "Done" ? "Open" : "Done" })}>{task.status === "Done" ? "Reopen" : "Mark Done"}</button>
          {hasApprove && task.approval === "Pending" && (
            <>
              <button className="btn" onClick={() => onUpdate(task.id, { approval: "Approved" })}>Approve</button>
              <button className="icon-btn" onClick={() => onUpdate(task.id, { approval: "Rejected" })}>Reject</button>
            </>
          )}
        </div>
        <div>
          <h4>Comments</h4>
          <input className="input" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button className="btn" onClick={() => { onComment(task.id, comment); setComment(""); }}>Add</button>
          {task.comments.map((c) => (
            <div key={c.id} className="file-preview"><strong>{users.find((u) => u.id === c.user)?.name}</strong>: {c.text} <span>{new Date(c.createdAt).toLocaleString()}</span></div>
          ))}
        </div>
        <div>
          <h4>Attachments</h4>
          {task.attachments?.map((a) => <div className="file-preview"><a href={a.content} download={a.name}>{a.name}</a></div>)}
        </div>
      </div>
    </ModalShell>
  );
}
function UploadDocModal({ onClose, onUpload }) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("Company");
  const [docType, setDocType] = useState("Contract");
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10));
  const [file, setFile] = useState(null);
  return (
    <ModalShell title="Upload Document" onClose={onClose}>
      <div className="flex-col">
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className="input" value={owner} onChange={(e) => setOwner(e.target.value)}><option>Company</option><option>Supervisor</option></select>
        <input className="input" placeholder="Type" value={docType} onChange={(e) => setDocType(e.target.value)} />
        <input className="input" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn" onClick={() => { onUpload({ title, owner, docType, expiryDate: new Date(expiryDate).toISOString(), file }); onClose(); }}>Upload</button>
      </div>
    </ModalShell>
  );
}
function EditDocModal({ doc, onClose, onSave }) {
  const [title, setTitle] = useState(doc.title);
  const [expiryDate, setExpiryDate] = useState(doc.expiryDate.slice(0, 10));
  return (
    <ModalShell title="Edit Document" onClose={onClose}>
      <div className="flex-col">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="input" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        <button className="btn" onClick={() => { onSave(doc.id, { title, expiryDate: new Date(expiryDate).toISOString() }); onClose(); }}>Save</button>
      </div>
    </ModalShell>
  );
}
function FileViewer({ file, title, onClose }) {
  return (
    <ModalShell title={title} onClose={onClose}>
      {file.content.startsWith("data:image/") ? <img src={file.content} alt={title} style={{ maxWidth: "100%" }} /> : <div>Preview not available</div>}
      <a className="btn" href={file.content} download={file.name}>Download</a>
    </ModalShell>
  );
}
function CreateMaintenanceModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: "", asset: "", category: "General", vendor: "", cost: 0, date: new Date().toISOString().slice(0, 10), nextServiceDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10), notes: "", attachments: [] });
  return (
    <ModalShell title="Add Maintenance" onClose={onClose}>
      <div className="flex-col">
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="Asset" value={form.asset} onChange={(e) => setForm({ ...form, asset: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>General</option><option>HVAC</option><option>Electrical</option></select>
        <input className="input" placeholder="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
        <input className="input" type="number" placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
        <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className="input" type="date" value={form.nextServiceDate} onChange={(e) => setForm({ ...form, nextServiceDate: e.target.value })} />
        <textarea className="input" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <input type="file" multiple onChange={(e) => setForm({ ...form, attachments: Array.from(e.target.files) })} />
        <button className="btn" onClick={() => { onCreate(form); onClose(); }}>Save</button>
      </div>
    </ModalShell>
  );
}
function ViewMaintenanceModal({ maintenance, onClose }) {
  return (
    <ModalShell title={maintenance.title} onClose={onClose}>
      <div className="flex-col">
        <div>Asset: {maintenance.asset} | Category: {maintenance.category} | Vendor: {maintenance.vendor}</div>
        <div>Cost: ${maintenance.cost} | Date: {new Date(maintenance.date).toLocaleDateString()}</div>
        <div>Next: {new Date(maintenance.nextServiceDate).toLocaleDateString()}</div>
        <p>{maintenance.notes}</p>
        <h4>Attachments</h4>
        {maintenance.attachments.map((a) => <div className="file-preview"><a href={a.content} download={a.name}>{a.name}</a></div>)}
      </div>
    </ModalShell>
  );
}
function CreateAuditModal({ onClose, onCreate, users }) {
  const [auditDate, setAuditDate] = useState(new Date().toISOString().slice(0, 10));
  const [auditor, setAuditor] = useState(users[0]?.id);
  const [findings, setFindings] = useState("");
  const [corrections, setCorrections] = useState([{ id: uid("ca_"), text: "", owner: users[0]?.id, dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), status: "Open" }]);
  const addAction = () => setCorrections([...corrections, { id: uid("ca_"), text: "", owner: users[0]?.id, dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), status: "Open" }]);
  const updateAction = (idx, key, val) => {
    const cs = [...corrections];
    cs[idx][key] = val;
    setCorrections(cs);
  };
  return (
    <ModalShell title="Create Audit" onClose={onClose}>
      <div className="flex-col">
        <input className="input" type="date" value={auditDate} onChange={(e) => setAuditDate(e.target.value)} />
        <select className="input" value={auditor} onChange={(e) => setAuditor(e.target.value)}>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
        <textarea className="input" placeholder="Findings" value={findings} onChange={(e) => setFindings(e.target.value)} />
        <h4>Corrective Actions</h4>
        {corrections.map((c, idx) => (
          <div key={c.id} style={{ display: "flex", gap: 8 }}>
            <input className="input" placeholder="Action" value={c.text} onChange={(e) => updateAction(idx, "text", e.target.value)} />
            <select className="input" value={c.owner} onChange={(e) => updateAction(idx, "owner", e.target.value)}>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
            <input className="input" type="date" value={c.dueDate} onChange={(e) => updateAction(idx, "dueDate", e.target.value)} />
          </div>
        ))}
        <button className="icon-btn" onClick={addAction}>Add Action</button>
        <button className="btn" onClick={() => { onCreate({ auditDate: new Date(auditDate).toISOString(), auditor, findings, correctiveActions: corrections }); onClose(); }}>Create</button>
      </div>
    </ModalShell>
  );
}
function SendNotificationModal({ onClose, onSend, users }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [recipients, setRecipients] = useState([]);
  const toggleRecipient = (id) => setRecipients((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  return (
    <ModalShell title="Send Notification" onClose={onClose}>
      <div className="flex-col">
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input" placeholder="Text" value={text} onChange={(e) => setText(e.target.value)} />
        <h4>Recipients</h4>
        {users.map((u) => (
          <label key={u.id}><input type="checkbox" checked={recipients.includes(u.id)} onChange={() => toggleRecipient(u.id)} /> {u.name} ({u.role})</label>
        ))}
        <button className="btn" onClick={() => { onSend(title, text, "Custom", recipients); onClose(); }}>Send</button>
      </div>
    </ModalShell>
  );
}
/* ============================
   Generic modal, toast
   ============================ */
function ModalShell({ title, children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", zIndex: 1000 }}>
      <div className="card" style={{ maxWidth: "90%", maxHeight: "90vh", overflow: "auto", minWidth: 320 }}>
        <div className="row"><h3>{title}</h3><button className="icon-btn" onClick={onClose}>Close</button></div>
        {children}
      </div>
    </div>
  );
}
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  const color = message.type === "error" ? "var(--danger)" : message.type === "success" ? "var(--secondary)" : "var(--primary)";
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, background: color, color: "white", padding: 12, borderRadius: 8, zIndex: 1000 }}>
      {message.text}
    </div>
  );
}