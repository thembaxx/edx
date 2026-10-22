"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft, ArrowRight, Bell, BookOpen, CalendarBlank, CaretLeft, CaretRight,
  ChatCircleDots, Check, CheckCircle, Clock, Desktop, GearSix, GraduationCap,
  House, Info, Megaphone, Moon, PaperPlaneTilt, Plus, ShieldCheck, Sparkle,
  SquaresFour, Sun, UsersThree, WifiSlash, X,
} from "@phosphor-icons/react";
import Orb from "./components/Orb";
import {
  categoryColors, dayLabel, eventsForDate, initialState, loadState, resetState,
  saveState, subjects, today, unreadCount,
  type Category, type DemoState, type Role, type SchoolUpdate, type View,
} from "./data";

type Theme = "system" | "light" | "dark";
type ComposeType = "Homework" | "Notice" | "Assessment" | "Event";
type ModuleKey = "assignments" | "events" | "messages" | "community";
const VIEWS: { id: View; label: string; Icon: typeof House }[] = [
  { id: "home", label: "Home", Icon: House },
  { id: "updates", label: "Updates", Icon: Megaphone },
  { id: "calendar", label: "Calendar", Icon: CalendarBlank },
  { id: "inbox", label: "Inbox", Icon: ChatCircleDots },
];
const MODULES: { id: ModuleKey; name: string; detail: string }[] = [
  { id: "assignments", name: "Homework & tasks", detail: "Assignments and assessments" },
  { id: "events", name: "Calendar", detail: "Important school dates" },
  { id: "messages", name: "School messages", detail: "Private conversations" },
  { id: "community", name: "Teacher circle", detail: "Staff-only peer support concept" },
];
const storage = {
  get: (key: string, fallback: string) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
  set: (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* storage optional */ } },
};
const categoryIcon = (category: Category) => category === "Mathematics" ? "∑" : category === "English" ? "Aa" : category === "Sport" ? "↗" : category === "Arts" ? "✳" : category === "Natural Sciences" ? "✺" : "✦";
function Chip({ category }: { category: Category }) {
  return <span className={`subject-chip tone-${categoryColors[category]}`}><span className="subject-symbol">{categoryIcon(category)}</span>{category}</span>;
}
function Mark({ small = false }: { small?: boolean }) {
  return <span className={`mark ${small ? "mark-small" : ""}`} aria-hidden="true"><span className="mark-shine" /></span>;
}
function Badge({ children, color = "neutral" }: { children: React.ReactNode; color?: string }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}
function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{action}</div>;
}
function Empty({ title, body }: { title: string; body: string }) {
  return <div className="empty"><span className="empty-icon"><Sparkle size={25} weight="duotone" /></span><h3>{title}</h3><p>{body}</p></div>;
}
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`toggle ${checked ? "is-on" : ""}`} onClick={() => onChange(!checked)}><span /></button>;
}

export default function App() {
  const motionPreference = useReducedMotion();
  const [role, setRole] = useState<Role>(() => storage.get("edx-role", "parent") === "teacher" ? "teacher" : "parent");
  const [view, setView] = useState<View>("home");
  const [state, setState] = useState<DemoState>(loadState);
  const [theme, setTheme] = useState<Theme>(() => (["system", "light", "dark"].includes(storage.get("edx-theme", "system")) ? storage.get("edx-theme", "system") : "system") as Theme);
  const [lessMotion, setLessMotion] = useState(() => storage.get("edx-less-motion", "false") === "true");
  const reducedMotion = Boolean(motionPreference || lessMotion);
  const [settings, setSettings] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [onboardStep, setOnboardStep] = useState(() => storage.get("edx-onboarded", "false") === "true" ? -1 : 0);
  const [compose, setCompose] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [activeThread, setActiveThread] = useState("t1");
  const [draft, setDraft] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(today);
  const [online, setOnline] = useState(() => navigator.onLine);
  const [notice, setNotice] = useState("");
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [modules, setModules] = useState<Record<ModuleKey, boolean>>(() => {
    try {
      const stored: unknown = JSON.parse(storage.get("edx-modules", "{}"));
      const saved = stored && typeof stored === "object" ? stored as Partial<Record<ModuleKey, unknown>> : {};
      return {
        assignments: typeof saved.assignments === "boolean" ? saved.assignments : true,
        events: typeof saved.events === "boolean" ? saved.events : true,
        messages: typeof saved.messages === "boolean" ? saved.messages : true,
        community: typeof saved.community === "boolean" ? saved.community : true,
      };
    } catch { return { assignments: true, events: true, messages: true, community: true }; }
  });

  useEffect(() => { saveState(state); }, [state]);
  useEffect(() => { storage.set("edx-role", role); }, [role]);
  useEffect(() => { storage.set("edx-modules", JSON.stringify(modules)); }, [modules]);
  useEffect(() => { storage.set("edx-less-motion", String(lessMotion)); }, [lessMotion]);
  useEffect(() => {
    storage.set("edx-theme", theme);
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const actual = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      document.documentElement.dataset.theme = actual;
      const color = actual === "dark" ? "#15181f" : "#e5f2ff";
      let meta = document.querySelector('meta[name="theme-color"]:not([media])');
      if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "theme-color"); document.head.appendChild(meta); }
      meta.setAttribute("content", color);
    };
    apply(); media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  useEffect(() => {
    const yes = () => setOnline(true);
    const no = () => setOnline(false);
    window.addEventListener("online", yes); window.addEventListener("offline", no);
    const beforeInstall = (event: Event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener("beforeinstallprompt", beforeInstall);
    return () => {
      window.removeEventListener("online", yes); window.removeEventListener("offline", no);
      window.removeEventListener("beforeinstallprompt", beforeInstall);
    };
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSettings(false); setModulesOpen(false); setCompose(false);
      if (onboardStep >= 0) { storage.set("edx-onboarded", "true"); setOnboardStep(-1); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onboardStep]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const unread = unreadCount(state);
  const sortedEvents = useMemo(() => [...state.events].filter((event) => event.date >= today()).sort((a, b) => a.date.localeCompare(b.date)), [state.events]);
  const filteredUpdates = useMemo(() => state.updates.filter((item) => (modules.assignments || item.kind !== "Homework") && (filter === "All" || item.category === filter || item.kind === filter)).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.date.localeCompare(a.date)), [state.updates, filter, modules.assignments]);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";
  const navigate = (target: View) => { setView(target); setFilter("All"); };
  const showToast = (text: string) => setNotice(text);
  const markRead = (id: string) => setState((previous) => ({ ...previous, readIds: [...new Set([...previous.readIds, id])] }));
  const switchRole = (next: Role) => { setRole(next); setView("home"); setSettings(false); showToast(`Viewing the ${next === "teacher" ? "educator" : "parent"} demo`); };
  const resetDemo = () => { resetState(); setState(initialState()); setSettings(false); setView("home"); showToast("Fictional demo data restored"); };
  const saveUpdate = (item: Pick<SchoolUpdate, "title" | "body" | "category" | "kind" | "due">) => {
    const id = `u-${Date.now()}`;
    setState((previous) => ({
      ...previous,
      updates: [{ ...item, id, date: today(), author: "You · Educator demo" }, ...previous.updates],
      events: item.due ? [...previous.events, { id: `e-${Date.now()}`, title: item.title, date: item.due, category: item.category, note: item.body }] : previous.events,
    }));
    setCompose(false); setView("updates"); setFilter("All"); showToast("Added to this device's demo");
  };
  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setState((previous) => ({ ...previous, threads: previous.threads.map((thread) =>
      thread.id === activeThread ? { ...thread, messages: [...thread.messages, { id: `m-${Date.now()}`, from: role, body: text, at: today() }] } : thread,
    ) }));
    setDraft(""); showToast("Message saved in demo — not delivered");
  };
  const currentThread = state.threads.find((thread) => thread.id === activeThread) ?? state.threads[0];
  const closeOnboarding = () => { storage.set("edx-onboarded", "true"); setOnboardStep(-1); };
  const askPermission = async () => {
    if (!("Notification" in window) || !window.isSecureContext) { showToast("Browser notifications are unavailable here"); return; }
    const result = await Notification.requestPermission();
    showToast(result === "granted" ? "Notifications allowed; live alerts require school integration" : "Notification preferences unchanged");
  };
  const installApp = async () => {
    const candidate = installPrompt as (Event & { prompt: () => Promise<void> }) | null;
    if (candidate?.prompt) { await candidate.prompt(); setInstallPrompt(null); }
    else showToast("Use your browser's Add to Home Screen option");
  };
  const toggleModule = (key: ModuleKey) => { setModules((previous) => ({ ...previous, [key]: !previous[key] })); };

  return <div className={`app-shell ${reducedMotion ? "reduce-extra-motion" : ""}`}>
    <div className="ambient ambient-one" aria-hidden="true" /><div className="ambient ambient-two" aria-hidden="true" />
    <div className="page-wrap">
      <header className="topbar">
        <button className="brand interactive" aria-label="edx, go home" onClick={() => navigate("home")}><Mark /><span>edx<span className="brand-dot">.</span></span></button>
        <div className="topbar-right">
          <span className="demo-label"><span className="demo-pulse" /> Interactive demo</span>
          <button className="icon-button desktop-only" onClick={() => setModulesOpen(true)} aria-label="Manage modules" title="Modules"><SquaresFour size={22} /></button>
          <button className="icon-button settings-button" onClick={() => setSettings(true)} aria-label="Open settings" title="Settings"><GearSix size={23} /></button>
          <div className="user-avatar" aria-label={role === "parent" ? "Parent profile" : "Teacher profile"}>{role === "parent" ? "P" : "T"}</div>
        </div>
      </header>
      {!online && <div className="offline-strip" role="status"><WifiSlash size={16} /> You are offline. Previously loaded pages and fictional changes are still available on this device.</div>}
      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-school"><div className="school-emblem"><GraduationCap size={23} weight="duotone" /></div><div><strong>Bluebird Primary</strong><span>Fictional demo school</span></div></div>
          <p className="side-label">WORKSPACE</p>
          <nav aria-label="Primary navigation" className="sidebar-nav">
            {VIEWS.map(({ id, label, Icon }) => <button key={id} aria-current={view === id ? "page" : undefined} className={`side-nav-item ${view === id ? "selected" : ""}`} onClick={() => navigate(id)}><Icon size={22} weight={view === id ? "fill" : "regular"} />{label}{id === "updates" && unread > 0 && <span className="side-count">{unread}</span>}</button>)}
          </nav>
          <div className="sidebar-spacer" />
          <button className="sidebar-module" onClick={() => setModulesOpen(true)}><SquaresFour size={20} /><span>My modules</span><ArrowRight size={16} /></button>
          <div className="sidebar-bottom"><Mark small /><div><strong>Better days, together.</strong><p>Made for school communities in South Africa.</p></div></div>
        </aside>
        <main id="main" className="main-area">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={view + role} className="view-content" initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }} transition={{ duration: reducedMotion ? 0 : 0.26, ease: "easeOut" }}>
              {view === "home" && <div className="home-view">
                <div className="hero-grid">
                  <div className="hero-copy">
                    <div className="eyebrow hero-eyebrow"><span className="eyebrow-star">✳</span> YOUR SCHOOL, A LITTLE CLOSER</div>
                    <h1>{greeting},<br /><span className="gradient-text">{role === "parent" ? "Nomsa" : "Teacher"}!</span></h1>
                    <p className="hero-description">{role === "parent" ? "Every little school moment, all in one happy place. Here's what's happening in Thando's class." : "Less admin, more teaching. Here's everything your Grade 4 community needs today."}</p>
                    <div className="hero-actions">
                      <button className="primary-button" onClick={() => navigate(role === "parent" ? "updates" : "inbox")}>{role === "parent" ? "See latest updates" : "Open conversations"}<ArrowRight size={19} /></button>
                      <button className="quiet-button" onClick={() => navigate("calendar")}>View calendar <ArrowRight size={16} /></button>
                    </div>
                  </div>
                  <div className="hero-art">
                    <div className="hero-halo" aria-hidden="true" /><Orb reducedMotion={reducedMotion} />
                    <span className="float-tag tag-one"><Sparkle weight="fill" size={15} /> A brighter school day</span>
                    <span className="float-tag tag-two"><CheckCircle size={17} weight="fill" /> In the loop</span>
                  </div>
                </div>
                <div className="context-row">
                  <div className="learner-summary"><div className="learner-icon"><GraduationCap size={22} weight="duotone" /></div><div><span className="eyebrow">YOUR ${role === "parent" ? "LEARNER" : "CLASS"}</span><strong>{role === "parent" ? "Thando M. · Grade 4" : "Grade 4 · Room 12"}</strong></div></div>
                  <div className="context-date"><CalendarBlank size={17} /> {new Intl.DateTimeFormat("en-ZA", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</div>
                </div>
                <div className="stat-grid">
                  {modules.assignments && <button className="stat-card stat-card-blue" onClick={() => navigate("updates")}><div className="stat-top"><span className="stat-icon"><BookOpen size={23} weight="duotone" /></span><span className="stat-arrow"><ArrowRight size={17} /></span></div><strong className="stat-value">{state.updates.filter((u) => u.kind === "Homework").length.toString().padStart(2, "0")}</strong><div className="stat-title">Homework notes</div><p>Little steps, big progress</p></button>}
                  {modules.events && <button className="stat-card stat-card-purple" onClick={() => navigate("calendar")}><div className="stat-top"><span className="stat-icon"><CalendarBlank size={23} weight="duotone" /></span><span className="stat-arrow"><ArrowRight size={17} /></span></div><strong className="stat-value">{String(sortedEvents.length).padStart(2, "0")}</strong><div className="stat-title">Upcoming dates</div><p>Never miss a school moment</p></button>}
                  <button className="stat-card stat-card-white" onClick={() => navigate("updates")}><div className="stat-top"><span className="stat-icon"><Bell size={23} weight="duotone" /></span><span className="stat-arrow"><ArrowRight size={17} /></span></div><strong className="stat-value">{String(unread).padStart(2, "0")}</strong><div className="stat-title">Unread updates</div><p>All the news, in one place</p></button>
                </div>
                <div className="dashboard-grid">
                  <section className="panel updates-panel">
                    <SectionHeading eyebrow="STAY IN THE KNOW" title="The latest from class" action={<button className="text-link" onClick={() => navigate("updates")}>View all <ArrowRight size={16} /></button>} />
                    <div className="update-mini-list">{state.updates.slice(0, 3).map((item) => <button className="update-mini" key={item.id} onClick={() => { setFilter(item.category); setView("updates"); markRead(item.id); }}><span className={`mini-icon tone-${categoryColors[item.category]}`}>{categoryIcon(item.category)}</span><span className="mini-content"><strong>{item.title}</strong><span>{item.category} · {item.kind}</span></span><span className="mini-date">{dayLabel(item.date)}</span><ArrowRight size={16} className="mini-arrow" /></button>)}</div>
                  </section>
                  {modules.events && <section className="panel event-panel">
                    <SectionHeading eyebrow="ON THE HORIZON" title="Coming up next" action={<button className="text-link" onClick={() => navigate("calendar")}>Calendar <ArrowRight size={16} /></button>} />
                    <div className="event-mini-list">{sortedEvents.slice(0, 3).map((item) => <button className="event-mini" key={item.id} onClick={() => { setSelectedDay(item.date); setCalendarMonth(new Date(item.date + "T12:00:00")); setView("calendar"); }}><span className="date-box"><strong>{dayLabel(item.date, { day: "2-digit" })}</strong><small>{dayLabel(item.date, { month: "short" })}</small></span><span><strong>{item.title}</strong><small>{item.category}</small></span><ArrowRight size={16} /></button>)}</div>
                  </section>}
                </div>
                {role === "teacher" && <button className="teacher-cta" onClick={() => setCompose(true)}><span><Plus size={21} /></span><span><strong>Share something with families</strong><small>Post an update, homework task or class event</small></span><ArrowRight size={20} /></button>}
              </div>}
              {view === "updates" && <section className="subpage">
                <div className="page-heading"><div><p className="eyebrow">EVERYTHING IN ITS PLACE</p><h1>Class <span className="gradient-text">updates</span></h1><p>From small reminders to big milestones, you're in the loop.</p></div>{role === "teacher" && <button className="primary-button" onClick={() => setCompose(true)}><Plus size={19} /> New update</button>}</div>
                <div className="filter-tabs" aria-label="Filter updates">{["All", "Homework", "Notice", "Assessment", ...subjects].map((tab) => <button key={tab} className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)} aria-pressed={filter === tab}>{tab}</button>)}</div>
                <div className="updates-list">{filteredUpdates.length === 0 ? <Empty title="A little quiet here" body="No updates in this category yet. Try another filter." /> : filteredUpdates.map((item) => <article key={item.id} className="update-card">
                  <div className="update-card-top"><Chip category={item.category} /><span className="card-kind">{item.pinned && <span className="pin-label">Pinned · </span>}{item.kind}</span></div>
                  <h2>{item.title}</h2><p>{item.body}</p>
                  <div className="update-card-bottom"><span><span className="teacher-initial">{item.author.includes("Dlamini") ? "N" : item.author.includes("Mokoena") ? "J" : "E"}</span>{item.author} <span className="dot-separator">·</span> {dayLabel(item.date)}</span><div className="update-actions">{item.due && <Badge color="blue"><Clock size={13} /> Due {dayLabel(item.due)}</Badge>}{!state.readIds.includes(item.id) ? <button className="read-button" onClick={() => markRead(item.id)}><Check size={15} /> Mark read</button> : <span className="read-confirmed"><CheckCircle size={15} /> Read</span>}</div></div>
                </article>)}</div>
              </section>}
              {view === "calendar" && (modules.events ? <section className="subpage">
                <div className="page-heading"><div><p className="eyebrow">ONE DAY AT A TIME</p><h1>School <span className="gradient-text">calendar</span></h1><p>Every assessment, activity and special day at a glance.</p></div>{role === "teacher" && <button className="primary-button" onClick={() => setCompose(true)}><Plus size={19} /> Add event</button>}</div>
                <div className="calendar-grid"><div className="panel calendar-panel">
                  <div className="calendar-heading"><h2>{new Intl.DateTimeFormat("en-ZA", { month: "long", year: "numeric" }).format(calendarMonth)}</h2><div><button className="icon-button icon-small" aria-label="Previous month" onClick={() => setCalendarMonth((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}><CaretLeft size={20} /></button><button className="icon-button icon-small" aria-label="Next month" onClick={() => setCalendarMonth((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}><CaretRight size={20} /></button></div></div>
                  <CalendarGrid month={calendarMonth} selectedDay={selectedDay} onSelect={setSelectedDay} events={state.events} />
                </div><div className="panel daily-panel"><p className="eyebrow">SELECTED DAY</p><h2>{dayLabel(selectedDay, { weekday: "long", day: "numeric", month: "long" })}</h2><div className="day-events">{eventsForDate(state.events, selectedDay).length ? eventsForDate(state.events, selectedDay).map((event) => <article className="day-event" key={event.id}><span className={`event-dot tone-${categoryColors[event.category]}`} /><div><Chip category={event.category} /><h3>{event.title}</h3><p>{event.note}</p></div></article>) : <Empty title="Room to breathe" body="Nothing planned here yet. Enjoy the little pause." />}</div></div></div>
                <section className="upcoming-section"><SectionHeading eyebrow="LOOKING AHEAD" title="Upcoming milestones" /><div className="upcoming-grid">{sortedEvents.slice(0, 6).map((event) => <button className="upcoming-card" key={event.id} onClick={() => { setSelectedDay(event.date); setCalendarMonth(new Date(event.date + "T12:00:00")); }}><span className="date-box"><strong>{dayLabel(event.date, { day: "2-digit" })}</strong><small>{dayLabel(event.date, { month: "short" })}</small></span><span><strong>{event.title}</strong><small>{event.category}</small></span></button>)}</div></section>
              </section> : <section className="subpage"><Empty title="Calendar is hidden" body="Enable Calendar in My modules to see your school dates." /></section>)}
              {view === "inbox" && <section className="subpage inbox-page">
                <div className="page-heading"><div><p className="eyebrow">BETTER TOGETHER</p><h1>School <span className="gradient-text">conversations</span></h1><p>Thoughtful communication, without the noise.</p></div></div>
                {!modules.messages ? <Empty title="Messages are hidden" body="Enable School messages in My modules to show this area." /> : <div className="inbox-layout"><div className="thread-list panel"><div className="thread-heading"><strong>Messages</strong><Badge>Demo only</Badge></div>{state.threads.map((thread) => <button key={thread.id} onClick={() => setActiveThread(thread.id)} aria-pressed={activeThread === thread.id} className={`thread-item ${activeThread === thread.id ? "current" : ""}`}><span className="thread-avatar">{thread.title === "School office" ? "S" : thread.title.includes("Pillay") ? "M" : "N"}</span><span><strong>{thread.title}</strong><small>{thread.subtitle}</small></span><ArrowRight size={15} /></button>)}
                {role === "teacher" && modules.community && <button className="community-card" onClick={() => showToast("Teacher Circle is a concept preview; verified staff network is coming later")}><UsersThree size={22} /><span><strong>Teacher Circle</strong><small>Peer support · Coming later</small></span><ArrowRight size={16} /></button>}</div>
                  <div className="conversation panel"><div className="conversation-head"><span className="thread-avatar">{currentThread.title === "School office" ? "S" : "N"}</span><span><strong>{currentThread.title}</strong><small>{currentThread.subtitle}</small></span><Badge color="mint">Fictional</Badge></div><div className="messages" aria-label="Messages">{currentThread.messages.map((message) => <div key={message.id} className={`message ${message.from === role ? "mine" : "theirs"}`}><div className="message-bubble">{message.body}</div><span>{message.from === role ? "You" : message.from === "teacher" ? "Educator" : "Parent"} · {dayLabel(message.at)}</span></div>)}</div><form className="message-compose" onSubmit={send}><label className="sr-only" htmlFor="message-draft">Write a message</label><input id="message-draft" maxLength={1500} placeholder="Write a kind message..." value={draft} onChange={(event) => setDraft(event.target.value)} /><button type="submit" disabled={!draft.trim()} aria-label="Save demo message"><PaperPlaneTilt size={21} weight="fill" /></button></form><p className="message-note"><Info size={14} /> Messages are stored only in this browser. Nothing is sent to a school.</p></div>
                </div>}
              </section>}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
    <nav className="mobile-nav" aria-label="Mobile primary navigation"><div className="mobile-nav-track">{VIEWS.map(({ id, label, Icon }) => <button key={id} aria-current={view === id ? "page" : undefined} className={`mobile-nav-item ${view === id ? "selected" : ""}`} onClick={() => navigate(id)}>{view === id && <motion.span className="mobile-nav-active" layoutId="nav-pill" transition={{ type: "spring", stiffness: reducedMotion ? 1000 : 420, damping: 34, duration: reducedMotion ? 0 : undefined }} />}<span className="mobile-nav-content"><Icon size={22} weight={view === id ? "fill" : "regular"} /><small>{label}</small></span></button>)}</div></nav>
    {notice && <div className="toast" role="status"><CheckCircle size={18} weight="fill" />{notice}</div>}
    <AnimatePresence>
      {settings && <Dialog title="Settings" onClose={() => setSettings(false)} reducedMotion={reducedMotion}><div className="settings-body">
        <p className="modal-intro">Make edx feel just right for you.</p>
        <p className="settings-label">APPEARANCE</p>
        <div className="theme-picker" aria-label="Theme preference">{([{ key: "light", label: "Light", Icon: Sun }, { key: "dark", label: "Dark", Icon: Moon }, { key: "system", label: "System", Icon: Desktop }] as const).map(({ key, label, Icon }) => <button key={key} className={theme === key ? "active" : ""} aria-pressed={theme === key} onClick={() => setTheme(key)}><Icon size={20} /><span>{label}</span></button>)}</div>
        <div className="settings-row"><div><strong>Reduce extra motion</strong><small>Use calm transitions and a static orb</small></div><Toggle checked={lessMotion} onChange={setLessMotion} label="Reduce extra motion" /></div>
        <p className="settings-label">YOUR EXPERIENCE</p>
        <div className="role-toggle"><button className={role === "parent" ? "active" : ""} aria-pressed={role === "parent"} onClick={() => switchRole("parent")}><span>👋</span> Parent</button><button className={role === "teacher" ? "active" : ""} aria-pressed={role === "teacher"} onClick={() => switchRole("teacher")}><span>✏️</span> Educator</button></div>
        <div className="settings-row"><div><strong>My modules</strong><small>Choose what appears in your workspace</small></div><button className="settings-link" onClick={() => { setSettings(false); setModulesOpen(true); }}>Manage <ArrowRight size={16} /></button></div>
        <div className="settings-row"><div><strong>Replay welcome tour</strong><small>See how to get around edx</small></div><button className="settings-link" onClick={() => { setSettings(false); setOnboardStep(0); }}>Replay <ArrowRight size={16} /></button></div>
        <p className="settings-label">DEVICE & PRIVACY</p>
        <div className="settings-row"><div><strong>Install edx</strong><small>Add this web app to your home screen</small></div><button className="settings-link" onClick={installApp}>Install <ArrowRight size={16} /></button></div>
        <div className="settings-row"><div><strong>Browser notifications</strong><small>Permission only; real delivery is not active</small></div><button className="settings-link" onClick={askPermission}>Enable <ArrowRight size={16} /></button></div>
        <div className="settings-row"><div><strong>Reset fictional demo</strong><small>Clear practice entries on this device</small></div><button className="settings-link danger" onClick={resetDemo}>Reset</button></div>
        <div className="privacy-note"><ShieldCheck size={22} /><div><strong>Designed with privacy in mind</strong><p>This is a fictional, local-only demo, not a live school service. Please do not enter real learners' names, grades, behaviour notes or other personal details.</p></div></div>
      </div></Dialog>}
      {modulesOpen && <Dialog title="My modules" onClose={() => setModulesOpen(false)} reducedMotion={reducedMotion}><div className="settings-body"><p className="modal-intro">A little less clutter, a lot more of what matters to you.</p>{MODULES.filter((item) => item.id !== "community" || role === "teacher").map((item) => <div key={item.id} className="settings-row"><div><strong>{item.name}</strong><small>{item.detail}</small></div><Toggle checked={modules[item.id]} onChange={() => toggleModule(item.id)} label={`Show ${item.name}`} /></div>)}<p className="settings-footnote">Modules control visibility in this demo. They are not permissions or school access controls.</p></div></Dialog>}
      {compose && role === "teacher" && <ComposeDialog onClose={() => setCompose(false)} save={saveUpdate} reducedMotion={reducedMotion} />}
      {onboardStep >= 0 && <div className="onboard-backdrop" role="presentation"><div className="onboard-dialog" role="dialog" aria-modal="true" aria-label="Welcome to edx"><button className="onboard-skip" onClick={closeOnboarding}>Skip tour <X size={16} /></button><div className="onboard-visual"><span className="onboard-spark spark-a">✳</span><Orb size="small" interactive reducedMotion={reducedMotion} /><span className="onboard-spark spark-b">✦</span></div><div className="onboard-dots" aria-label={`Step ${onboardStep + 1} of 3`}>{[0, 1, 2].map((step) => <span key={step} className={step === onboardStep ? "active" : ""} />)}</div><AnimatePresence mode="wait"><motion.div key={onboardStep} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }} transition={{ duration: .24 }} className="onboard-copy"><span className="eyebrow">{["HELLO, THERE", "THE IMPORTANT THINGS", "MAKE IT YOURS"][onboardStep]}</span><h2>{["School feels closer, together.", "Less searching. More knowing.", "Your school day, your way."][onboardStep]}</h2><p>{["A calmer, friendlier place for educators and families to stay connected.", "Homework, dates and conversations each have their own happy place.", "Choose a parent or educator view. Everything here is fictional until a school is connected."][onboardStep]}</p></motion.div></AnimatePresence>{onboardStep === 2 && <div className="onboard-roles"><button className={role === "parent" ? "active" : ""} onClick={() => setRole("parent")}>I'm a parent</button><button className={role === "teacher" ? "active" : ""} onClick={() => setRole("teacher")}>I'm an educator</button></div>}<div className="onboard-actions">{onboardStep > 0 && <button className="quiet-button" onClick={() => setOnboardStep((step) => step - 1)}><ArrowLeft size={17} /> Back</button>}<button className="primary-button" onClick={() => onboardStep === 2 ? closeOnboarding() : setOnboardStep((step) => step + 1)}>{onboardStep === 2 ? "Explore edx" : "Continue"}<ArrowRight size={19} /></button></div></div></div>}
    </AnimatePresence>
  </div>;
}
function CalendarGrid({ month, selectedDay, onSelect, events }: { month: Date; selectedDay: string; onSelect: (date: string) => void; events: DemoState["events"] }) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return <div className="calendar-table"><div className="weekday-row">{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => <span key={i}>{day}</span>)}</div><div className="calendar-days">{Array.from({ length: offset }, (_, i) => <span key={`empty-${i}`} />)}{Array.from({ length: days }, (_, i) => { const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`; const hits = eventsForDate(events, date); return <button key={date} aria-label={`${dayLabel(date, { day: "numeric", month: "long", year: "numeric" })}, ${hits.length} events`} aria-pressed={selectedDay === date} className={`${date === today() ? "today" : ""} ${selectedDay === date ? "selected" : ""}`} onClick={() => onSelect(date)}><span>{i + 1}</span>{hits.length > 0 && <span className="calendar-dots">{hits.slice(0, 3).map((event) => <i key={event.id} className={`tone-${categoryColors[event.category]}`} />)}</span>}</button>; })}</div></div>;
}
function Dialog({ title, onClose, reducedMotion, children }: { title: string; onClose: () => void; reducedMotion: boolean; children: React.ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => previousFocus?.focus();
  }, []);
  return <motion.div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}><motion.div role="dialog" aria-modal="true" aria-label={title} className="modal-panel" initial={reducedMotion ? false : { y: 28, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={reducedMotion ? { opacity: 0 } : { y: 30, opacity: 0 }} transition={{ type: "spring", stiffness: 360, damping: 33, duration: reducedMotion ? 0 : undefined }}><div className="modal-head"><div><p className="eyebrow">EDX WORKSPACE</p><h2>{title}</h2></div><button ref={closeRef} className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={21} /></button></div>{children}</motion.div></motion.div>;
}
function ComposeDialog({ onClose, save, reducedMotion }: { onClose: () => void; save: (item: Pick<SchoolUpdate, "title" | "body" | "category" | "kind" | "due">) => void; reducedMotion: boolean }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<Category>("General");
  const [kind, setKind] = useState<ComposeType>("Notice");
  const [due, setDue] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); if (title.trim().length < 3 || body.trim().length < 5) return; save({ title: title.trim(), body: body.trim(), category, kind, due: due || undefined }); };
  return <Dialog title="Share an update" onClose={onClose} reducedMotion={reducedMotion}><form className="compose-form" onSubmit={submit}><p className="modal-intro">Keep families informed in just a few moments. This practice post stays on your device.</p><label>What kind of update?<select value={kind} onChange={(event) => setKind(event.target.value as ComposeType)}>{["Notice", "Homework", "Assessment", "Event"].map((entry) => <option key={entry}>{entry}</option>)}</select></label><label>Subject or group<select value={category} onChange={(event) => setCategory(event.target.value as Category)}>{subjects.map((entry) => <option key={entry}>{entry}</option>)}</select></label><label>Title<input required minLength={3} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Reading challenge this week" /></label><label>Details<textarea required minLength={5} maxLength={2000} rows={4} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Share what parents need to know..." /></label><label>Due date / event date <small>(optional)</small><input type="date" min={today()} value={due} onChange={(event) => setDue(event.target.value)} /></label><div className="compose-actions"><button type="button" className="quiet-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Add to demo <ArrowRight size={18} /></button></div></form></Dialog>;
}
