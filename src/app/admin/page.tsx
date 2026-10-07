"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  FolderGit2, 
  User, 
  Mail, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  Sparkles,
  ArrowUpRight,
  Shield,
  Layers,
  Camera,
  RefreshCw,
  FileText,
  Globe
} from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ProjectRow, PersonalInfoRow, ContactMessageRow } from "@/lib/supabase/types";
import { projects as fallbackProjects } from "@/data/projects";
import { personalInfo as fallbackPersonal } from "@/data/personal";

type TabType = "projects" | "profile" | "messages";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Status feedback toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Data States
  const [projectsList, setProjectsList] = useState<ProjectRow[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const [personalData, setPersonalData] = useState<{
    name: string;
    nickname: string;
    title: string;
    roles: string;
    short_bio: string;
    bio: string;
    my_approach: string;
    avatar_url: string;
    email: string;
    place_of_birth: string;
    gpa: string;
    education: string;
    github: string;
    linkedin: string;
    location: string;
    availability: string;
    status: string;
    resume_url: string;
    currently_building: string;
    currently_exploring: string;
    currently_learning: string;
  }>({
    name: fallbackPersonal.name,
    nickname: fallbackPersonal.nickname,
    title: fallbackPersonal.title,
    roles: fallbackPersonal.roles.join(", "),
    short_bio: fallbackPersonal.shortBio,
    bio: fallbackPersonal.bio,
    my_approach: fallbackPersonal.approach,
    avatar_url: fallbackPersonal.avatarUrl,
    email: fallbackPersonal.email,
    place_of_birth: fallbackPersonal.placeOfBirth,
    gpa: fallbackPersonal.gpa,
    education: fallbackPersonal.education,
    github: fallbackPersonal.github,
    linkedin: fallbackPersonal.linkedin,
    location: fallbackPersonal.location,
    availability: fallbackPersonal.availability,
    status: fallbackPersonal.status,
    resume_url: fallbackPersonal.resumeUrl,
    currently_building: fallbackPersonal.currently.building,
    currently_exploring: fallbackPersonal.currently.exploring,
    currently_learning: fallbackPersonal.currently.learning,
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [messagesList, setMessagesList] = useState<ContactMessageRow[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Project Modal State (Add or Edit)
  const [editingProject, setEditingProject] = useState<Partial<ProjectRow> | null>(null);
  const [techInput, setTechInput] = useState<string>("");
  const [isSavingProject, setIsSavingProject] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Verify Authentication
  useEffect(() => {
    async function verifyAuth() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        router.replace("/admin/login");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }

      setUserEmail(session.user.email || "Owner");
      setIsLoadingUser(false);
    }

    verifyAuth();
  }, [router]);

  // 2. Fetch Projects
  const fetchProjects = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Fetch projects error:", error);
        // Fallback to static if table not populated
        const mappedFallback: ProjectRow[] = fallbackProjects.map((p, idx) => ({
          id: p.id,
          number: p.number,
          title: p.title,
          category: p.category,
          description: p.description,
          detailed_description: p.detailedDescription || null,
          technologies: p.technologies,
          github_url: p.githubUrl,
          live_url: p.liveUrl || null,
          featured: p.featured,
          metrics: (p.metrics as unknown as ProjectRow["metrics"]) || null,
          architecture_points: p.architecturePoints || null,
          banner_gradient: p.bannerGradient || null,
          sort_order: idx + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        setProjectsList(mappedFallback);
      } else if (data && data.length > 0) {
        setProjectsList(data);
      } else {
        // Table is empty, provide static projects as template
        const mappedFallback: ProjectRow[] = fallbackProjects.map((p, idx) => ({
          id: p.id,
          number: p.number,
          title: p.title,
          category: p.category,
          description: p.description,
          detailed_description: p.detailedDescription || null,
          technologies: p.technologies,
          github_url: p.githubUrl,
          live_url: p.liveUrl || null,
          featured: p.featured,
          metrics: (p.metrics as unknown as ProjectRow["metrics"]) || null,
          architecture_points: p.architecturePoints || null,
          banner_gradient: p.bannerGradient || null,
          sort_order: idx + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        setProjectsList(mappedFallback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  // 3. Fetch Profile Info
  const fetchProfile = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from("personal_info")
        .select("*")
        .eq("id", "default")
        .single();

      if (!error && data) {
        const currently =
          (data.currently as {
            building?: string;
            exploring?: string;
            learning?: string;
            approach?: string;
            avatar_url?: string;
          }) || {};
        const rowAny = data as Record<string, unknown>;

        setPersonalData({
          name: data.name || fallbackPersonal.name,
          nickname: data.nickname || fallbackPersonal.nickname,
          title: data.title || fallbackPersonal.title,
          roles: Array.isArray(data.roles) ? data.roles.join(", ") : fallbackPersonal.roles.join(", "),
          short_bio: data.short_bio || fallbackPersonal.shortBio,
          bio: data.bio || fallbackPersonal.bio,
          my_approach:
            (rowAny.my_approach as string) ||
            currently.approach ||
            fallbackPersonal.approach,
          avatar_url:
            (rowAny.avatar_url as string) ||
            currently.avatar_url ||
            fallbackPersonal.avatarUrl,
          email: data.email || fallbackPersonal.email,
          place_of_birth: data.place_of_birth || fallbackPersonal.placeOfBirth,
          gpa: data.gpa || fallbackPersonal.gpa,
          education: data.education || fallbackPersonal.education,
          github: data.github || fallbackPersonal.github,
          linkedin: data.linkedin || fallbackPersonal.linkedin,
          location: data.location || fallbackPersonal.location,
          availability: data.availability || fallbackPersonal.availability,
          status: data.status || fallbackPersonal.status,
          resume_url: data.resume_url || fallbackPersonal.resumeUrl,
          currently_building: currently.building || "",
          currently_exploring: currently.exploring || "",
          currently_learning: currently.learning || "",
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  // 4. Fetch Messages
  const fetchMessages = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMessagesList(data);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingUser) {
      fetchProjects();
      fetchProfile();
      fetchMessages();
    }
  }, [isLoadingUser, fetchProjects, fetchProfile, fetchMessages]);

  // Handle Logout
  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace("/admin/login");
  };

  // Open Edit Modal for a project
  const handleEditProject = (proj: ProjectRow) => {
    setEditingProject(proj);
    setTechInput(proj.technologies ? proj.technologies.join(", ") : "");
  };

  // Open Create Modal
  const handleCreateProject = () => {
    const nextNum = String(projectsList.length + 1).padStart(2, "0");
    setEditingProject({
      id: `project-${Date.now()}`,
      number: nextNum,
      title: "",
      category: "Fullstack Web App",
      description: "",
      detailed_description: "",
      technologies: [],
      github_url: "https://github.com/Neideav",
      live_url: "",
      featured: true,
      banner_gradient: "from-emerald-950/40 via-slate-900/60 to-zinc-950/80",
      sort_order: projectsList.length + 1,
    });
    setTechInput("");
  };

  // Save Project (Insert or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.id) {
      showToast("error", "Harap isi ID dan Judul proyek.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      showToast("error", "Supabase client tidak tersedia.");
      return;
    }

    setIsSavingProject(true);

    try {
      const techArray = techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        id: editingProject.id,
        number: editingProject.number || "01",
        title: editingProject.title,
        category: editingProject.category || "Fullstack",
        description: editingProject.description || "",
        detailed_description: editingProject.detailed_description || null,
        technologies: techArray,
        github_url: editingProject.github_url || "https://github.com/Neideav",
        live_url: editingProject.live_url || null,
        featured: Boolean(editingProject.featured),
        banner_gradient:
          editingProject.banner_gradient || "from-emerald-950/40 via-slate-900/60 to-zinc-950/80",
        sort_order: Number(editingProject.sort_order) || 1,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("projects").upsert(payload);

      if (error) {
        console.error("Upsert project error:", error);
        showToast("error", `Gagal menyimpan: ${error.message}`);
      } else {
        showToast("success", "Proyek berhasil disimpan ke Supabase!");
        setEditingProject(null);
        fetchProjects();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      showToast("error", msg);
    } finally {
      setIsSavingProject(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus proyek "${title}"?`)) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
        showToast("error", `Gagal menghapus: ${error.message}`);
      } else {
        showToast("success", `Proyek "${title}" berhasil dihapus.`);
        fetchProjects();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      showToast("error", msg);
    }
  };

  // Save Profile Info
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      showToast("error", "Supabase client tidak tersedia.");
      return;
    }

    setIsSavingProfile(true);

    try {
      const rolesArray = personalData.roles
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);

      const payload = {
        id: "default",
        name: personalData.name,
        nickname: personalData.nickname,
        title: personalData.title,
        roles: rolesArray,
        short_bio: personalData.short_bio,
        bio: personalData.bio,
        email: personalData.email,
        place_of_birth: personalData.place_of_birth,
        gpa: personalData.gpa,
        education: personalData.education,
        github: personalData.github,
        linkedin: personalData.linkedin,
        location: personalData.location,
        availability: personalData.availability,
        status: personalData.status,
        resume_url: personalData.resume_url,
        currently: {
          building: personalData.currently_building,
          exploring: personalData.currently_exploring,
          learning: personalData.currently_learning,
          approach: personalData.my_approach,
          avatar_url: personalData.avatar_url,
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("personal_info").upsert(payload);

      if (error) {
        showToast("error", `Gagal menyimpan profil: ${error.message}`);
      } else {
        showToast("success", "Data profil berhasil diperbarui di Supabase!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      showToast("error", msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Mark Message as Read
  const handleToggleMessageStatus = async (msg: ContactMessageRow) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const nextStatus = msg.status === "unread" ? "read" : "unread";

    const { error } = await supabase
      .from("contact_messages")
      .update({ status: nextStatus })
      .eq("id", msg.id);

    if (!error) {
      setMessagesList((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
      );
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Hapus pesan ini secara permanen?")) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (!error) {
      setMessagesList((prev) => prev.filter((m) => m.id !== id));
      showToast("success", "Pesan berhasil dihapus.");
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#070b12] text-zinc-200 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090e] text-zinc-100 font-sans flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/90 border-red-500/40 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 border-b border-zinc-800/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>VallPortofolio CMS</span>
              <span className="text-[10px] uppercase font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Supabase Connected
              </span>
            </h1>
            <p className="text-xs text-zinc-400">Login sebagai: {userEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
          >
            <span>Lihat Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3.5 py-2 rounded-xl border border-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "projects"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Kelola Proyek ({projectsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "profile"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil & Data Diri</span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "messages"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Kotak Masuk Pesan</span>
            {messagesList.filter((m) => m.status === "unread").length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: PROJECTS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl">
              <div>
                <h2 className="text-base font-bold text-white">Daftar Proyek Portofolio</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Data ini tersimpan di tabel Supabase PostgreSQL <code className="text-emerald-400">projects</code>.
                  Perubahan akan langsung tampil di halaman Work dan Showcase.
                </p>
              </div>
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Proyek Baru</span>
              </button>
            </div>

            {isLoadingProjects ? (
              <div className="p-12 text-center text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                <span className="text-xs">Memuat proyek dari Supabase...</span>
              </div>
            ) : projectsList.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                Belum ada proyek di database. Klik &ldquo;Tambah Proyek Baru&rdquo; untuk memulai.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectsList.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
                          #{proj.number}
                        </span>
                        {proj.featured && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-300 bg-teal-950/60 border border-teal-500/30 px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white line-clamp-1">{proj.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{proj.description}</p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(proj.technologies || []).slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {proj.github_url && (
                          <a
                            href={proj.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-500 hover:text-white transition-colors"
                            title="GitHub"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(proj)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors cursor-pointer"
                          title="Edit Proyek"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          className="p-2 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-colors cursor-pointer border border-red-500/20"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PROFILE & ABOUT ME */}
        {/* ============================================================== */}
        {activeTab === "profile" && (
          <div className="max-w-5xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span>Kelola About Me & Data Portofolio</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Semua perubahan langsung tersimpan ke Supabase PostgreSQL <code className="text-emerald-400">personal_info</code> dan langsung tampil di website utama.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchProfile}
                disabled={isLoadingProfile}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer w-fit"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProfile ? "animate-spin" : ""}`} />
                <span>Muat Ulang Data</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              {/* SECTION A: ABOUT ME (PHOTO, WHO AM I, MY APPROACH) */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800/60">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Bagian About Me (Foto & Narasi)</h3>
                    <p className="text-[11px] text-zinc-400">Tampilan foto portrait, bio &ldquo;Who Am I&rdquo;, dan &ldquo;My Approach&rdquo;.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Photo Preview & URL (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="w-full max-w-[220px] aspect-[4/5] relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl mb-3 group">
                      <Image
                        src={personalData.avatar_url || "/images/nauval-portrait.png"}
                        alt={personalData.name || "Portrait Preview"}
                        fill
                        unoptimized
                        className="object-cover object-[48%_14%]"
                        onError={(e) => {
                          // Fallback to default image on error
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/nauval-portrait.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[10px] font-mono font-bold text-zinc-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                          Live Preview Card
                        </span>
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <label className="block text-xs font-semibold text-zinc-300">
                        URL Foto Portrait
                      </label>
                      <input
                        type="text"
                        value={personalData.avatar_url}
                        onChange={(e) => setPersonalData({ ...personalData, avatar_url: e.target.value })}
                        placeholder="/images/nauval-portrait.png atau https://..."
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPersonalData({ ...personalData, avatar_url: "/images/nauval-portrait.png" })
                        }
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors underline cursor-pointer"
                      >
                        Reset ke foto default (/images/nauval-portrait.png)
                      </button>
                    </div>
                  </div>

                  {/* Narration Texts (8 cols) */}
                  <div className="lg:col-span-8 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                        <span>Who Am I (Deskripsi Diri)</span>
                        <span className="text-[10px] text-zinc-500 font-normal">Kolom kiri About Me</span>
                      </label>
                      <textarea
                        rows={4}
                        value={personalData.bio}
                        onChange={(e) => setPersonalData({ ...personalData, bio: e.target.value })}
                        placeholder="Deskripsi spesialisasi dan latar belakang kamu..."
                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                        <span>My Approach (Pendekatan Saya)</span>
                        <span className="text-[10px] text-zinc-500 font-normal">Kolom kanan About Me</span>
                      </label>
                      <textarea
                        rows={4}
                        value={personalData.my_approach}
                        onChange={(e) => setPersonalData({ ...personalData, my_approach: e.target.value })}
                        placeholder="Prinsip rekayasa, keandalan sistem, standar kualitas..."
                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: PERSONAL DETAILS (THE 6 SPECIFIC FIELDS) */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800/60">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Personal Details (Tabel 6 Rincian)</h3>
                    <p className="text-[11px] text-zinc-400">Data ini muncul pada kartu rincian di bawah narasi About Me.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Name */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider text-[11px]">
                      1. Name (Nama Lengkap)
                    </label>
                    <input
                      type="text"
                      value={personalData.name}
                      onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                      required
                      placeholder="Muhammad Bahruddin Nauvaldy Maulana"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* 2. Place of Birth */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider text-[11px]">
                      2. Place of Birth (Tempat Lahir)
                    </label>
                    <input
                      type="text"
                      value={personalData.place_of_birth}
                      onChange={(e) => setPersonalData({ ...personalData, place_of_birth: e.target.value })}
                      placeholder="Batu, Indonesia"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* 3. Role */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider text-[11px]">
                      3. Role (Jabatan / Peran)
                    </label>
                    <input
                      type="text"
                      value={personalData.title}
                      onChange={(e) => setPersonalData({ ...personalData, title: e.target.value })}
                      placeholder="Cloud Engineer · Backend Developer · DevOps Engineer"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* 4. GPA */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider text-[11px]">
                      4. GPA (Nilai / IPK)
                    </label>
                    <input
                      type="text"
                      value={personalData.gpa}
                      onChange={(e) => setPersonalData({ ...personalData, gpa: e.target.value })}
                      placeholder="N/A atau 3.90"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* 5. Email */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider text-[11px]">
                      5. Email Kontak
                    </label>
                    <input
                      type="email"
                      value={personalData.email}
                      onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                      required
                      placeholder="nvaldymaulana@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* 6. Education */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider text-[11px]">
                      6. Education (Pendidikan)
                    </label>
                    <input
                      type="text"
                      value={personalData.education}
                      onChange={(e) => setPersonalData({ ...personalData, education: e.target.value })}
                      placeholder="SMKS PGRI 3 Malang"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: HERO HEADLINE & STATUS PUBLIK */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800/60">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Hero Section & Status Portofolio</h3>
                    <p className="text-[11px] text-zinc-400">Teks pembuka hero, badge status kerja, dan ketersediaan.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Nama Panggilan (Hero Marquee)</label>
                    <input
                      type="text"
                      value={personalData.nickname}
                      onChange={(e) => setPersonalData({ ...personalData, nickname: e.target.value })}
                      placeholder="Nauval"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Roles (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      value={personalData.roles}
                      onChange={(e) => setPersonalData({ ...personalData, roles: e.target.value })}
                      placeholder="Cloud Engineer, Backend Developer, DevOps Engineer"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Short Statement (Hero Headline Quote)
                  </label>
                  <textarea
                    rows={2}
                    value={personalData.short_bio}
                    onChange={(e) => setPersonalData({ ...personalData, short_bio: e.target.value })}
                    placeholder="I build reliable backend systems, cloud infrastructure..."
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Status Ketersediaan</label>
                    <input
                      type="text"
                      value={personalData.availability}
                      onChange={(e) => setPersonalData({ ...personalData, availability: e.target.value })}
                      placeholder="Open to Opportunities"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Status Badge Hero</label>
                    <input
                      type="text"
                      value={personalData.status}
                      onChange={(e) => setPersonalData({ ...personalData, status: e.target.value })}
                      placeholder="System Active & Deploying"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Lokasi Domisili</label>
                    <input
                      type="text"
                      value={personalData.location}
                      onChange={(e) => setPersonalData({ ...personalData, location: e.target.value })}
                      placeholder="Indonesia (Remote / Hybrid)"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Link Resume / CV</label>
                  <input
                    type="text"
                    value={personalData.resume_url}
                    onChange={(e) => setPersonalData({ ...personalData, resume_url: e.target.value })}
                    placeholder="#contact atau URL Google Drive CV"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* SECTION D: SOCIAL & CURRENTLY */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800/60">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Sosial Media & Aktivitas Terkini (Currently)</h3>
                    <p className="text-[11px] text-zinc-400">Tautan profil luar dan aktivitas belajar / riset saat ini.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">GitHub URL</label>
                    <input
                      type="url"
                      value={personalData.github}
                      onChange={(e) => setPersonalData({ ...personalData, github: e.target.value })}
                      placeholder="https://github.com/Neideav"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">LinkedIn URL</label>
                    <input
                      type="url"
                      value={personalData.linkedin}
                      onChange={(e) => setPersonalData({ ...personalData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/nvaldymaulana"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Building</label>
                    <input
                      type="text"
                      value={personalData.currently_building}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, currently_building: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Exploring</label>
                    <input
                      type="text"
                      value={personalData.currently_exploring}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, currently_exploring: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Learning</label>
                    <input
                      type="text"
                      value={personalData.currently_learning}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, currently_learning: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-2 sticky bottom-4 z-20">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm tracking-wide shadow-xl shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan About Me & Profil</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CONTACT MESSAGES */}
        {/* ============================================================== */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl">
              <h2 className="text-base font-bold text-white">Pesan Masuk dari Formulir Kontak</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Data ini dikirim oleh pengunjung melalui formulir kontak dan tersimpan di tabel{" "}
                <code className="text-emerald-400">contact_messages</code>.
              </p>
            </div>

            {isLoadingMessages ? (
              <div className="p-12 text-center text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                <span className="text-xs">Memuat pesan masuk...</span>
              </div>
            ) : messagesList.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                Belum ada pesan yang masuk dari pengunjung.
              </div>
            ) : (
              <div className="space-y-3">
                {messagesList.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      msg.status === "unread"
                        ? "bg-zinc-900/80 border-emerald-500/40 shadow-lg shadow-emerald-950/20"
                        : "bg-zinc-900/30 border-zinc-800/70 opacity-80"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-white">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-emerald-400 hover:underline"
                        >
                          {msg.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>{new Date(msg.created_at).toLocaleString("id-ID")}</span>
                        <span
                          className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                            msg.status === "unread"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/60">
                      {msg.message}
                    </p>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleMessageStatus(msg)}
                        className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        {msg.status === "unread" ? "Tandai Sudah Dibaca" : "Tandai Belum Dibaca"}
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/20 transition-colors cursor-pointer"
                      >
                        Hapus Pesan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ============================================================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingProject(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingProject.title ? `Edit: ${editingProject.title}` : "Tambah Proyek Baru"}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Data akan disimpan langsung ke database Supabase.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Slug ID (Unik)
                  </label>
                  <input
                    type="text"
                    value={editingProject.id || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                    }
                    placeholder="my-cool-project"
                    required
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nomor Urut (misal 01, 02)
                  </label>
                  <input
                    type="text"
                    value={editingProject.number || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, number: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Judul Proyek</label>
                <input
                  type="text"
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="FinTrack Pro — Aplikasi Keuangan"
                  required
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Kategori</label>
                <input
                  type="text"
                  value={editingProject.category || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  placeholder="Full-Stack Web App & Finance Analytics"
                  required
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Deskripsi Lengkap (Untuk halaman detail)
                </label>
                <textarea
                  rows={3}
                  value={editingProject.detailed_description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, detailed_description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Technologies (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React.js, Node.js, Tailwind CSS, PostgreSQL"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={editingProject.github_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, github_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Live Demo URL (Opsional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.live_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, live_url: e.target.value })
                    }
                    placeholder="https://myproject.vercel.app"
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-zinc-950 border-zinc-800"
                  />
                  <span className="text-xs text-zinc-300">Tampilkan di Featured Showcase</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Urutan (Sort):</span>
                  <input
                    type="number"
                    value={editingProject.sort_order || 1}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, sort_order: Number(e.target.value) })
                    }
                    className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSavingProject ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Proyek</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
