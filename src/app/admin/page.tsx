"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BackgroundLines } from "@/components/BackgroundLines";
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
  Globe,
  Upload,
  ImageIcon,
  Link2,
  Trophy,
  GraduationCap,
  ShieldCheck,
  Languages,
  Award,
  BookOpen,
  Sun,
  Moon
} from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ProjectRow, PersonalInfoRow, ContactMessageRow } from "@/lib/supabase/types";
import { projects as fallbackProjects } from "@/data/projects";
import { personalInfo as fallbackPersonal } from "@/data/personal";
import { 
  AwardItem, 
  AwardPhoto, 
  defaultAwardsList, 
  defaultPhotoColumns 
} from "@/data/awards";
import { TrainingEntry, defaultTrainingData } from "@/data/trainings";
import { optimizeImageFile } from "@/lib/image-utils";

type TabType = "projects" | "profile" | "awards" | "trainings" | "messages";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsDarkTheme(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDarkTheme;
    setIsDarkTheme(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messagesList, setMessagesList] = useState<ContactMessageRow[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Awards & Collage States
  const [awardsList, setAwardsList] = useState<AwardItem[]>(defaultAwardsList);
  const [awardPhotos, setAwardPhotos] = useState<AwardPhoto[][]>(defaultPhotoColumns);
  const [editingAward, setEditingAward] = useState<Partial<AwardItem> | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<{ colIndex: number; photoIndex: number; photo: AwardPhoto } | null>(null);
  const [isSavingAwards, setIsSavingAwards] = useState(false);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Trainings States
  const [trainingsList, setTrainingsList] = useState<TrainingEntry[]>(defaultTrainingData);
  const [editingTraining, setEditingTraining] = useState<Partial<TrainingEntry> | null>(null);
  const [trainingImgInputs, setTrainingImgInputs] = useState<string[]>(["", "", ""]);
  const [isSavingTrainings, setIsSavingTrainings] = useState(false);
  const trainingFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTrainingImgSlot, setActiveTrainingImgSlot] = useState<number>(0);

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

        // Populate dynamic Awards & Trainings if saved
        const customAwards = (currently as Record<string, unknown>).awards as AwardItem[] | undefined;
        const customPhotos = (currently as Record<string, unknown>).award_photos as AwardPhoto[][] | undefined;
        const customTrainings = (currently as Record<string, unknown>).trainings as TrainingEntry[] | undefined;

        if (customAwards && customAwards.length > 0) setAwardsList(customAwards);
        if (customPhotos && customPhotos.length > 0) setAwardPhotos(customPhotos);
        if (customTrainings && customTrainings.length > 0) setTrainingsList(customTrainings);
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

  // Handle Image File Upload (Compacts client-side and/or uploads to Supabase)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Harap pilih file gambar (JPG, PNG, atau WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast("error", "Ukuran file terlalu besar (maksimal 15MB).");
      return;
    }

    setIsUploadingImage(true);
    try {
      const supabase = getSupabaseBrowserClient();
      let uploadedUrl: string | null = null;

      // Attempt upload to Supabase storage if portfolio bucket is available
      if (supabase) {
        try {
          const ext = file.name.split(".").pop() || "png";
          const fileName = `portrait-${Date.now()}.${ext}`;
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from("portfolio")
            .upload(fileName, file, { upsert: true });

          if (!uploadErr && uploadData) {
            const { data: pubData } = supabase.storage
              .from("portfolio")
              .getPublicUrl(uploadData.path);
            uploadedUrl = pubData.publicUrl;
          }
        } catch {
          // fallback to client-side data URL
        }
      }

      // If storage bucket is not available, optimize client-side into lightweight high-res data URL
      if (!uploadedUrl) {
        uploadedUrl = await optimizeImageFile(file, 1000, 0.85);
      }

      setPersonalData((prev) => ({ ...prev, avatar_url: uploadedUrl! }));
      showToast("success", "Foto berhasil dimuat! Klik 'Simpan Perubahan' di bawah untuk menerapkan.");
    } catch (err) {
      console.error("Image upload error:", err);
      showToast("error", "Gagal memproses gambar.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ================================================================
  // AWARDS & COLLAGE HANDLERS
  // ================================================================
  const handleSaveAwards = async (newAwards?: AwardItem[], newPhotos?: AwardPhoto[][]) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      showToast("error", "Supabase client tidak tersedia.");
      return;
    }

    setIsSavingAwards(true);
    try {
      const listToSave = newAwards || awardsList;
      const photosToSave = newPhotos || awardPhotos;

      const { data: currentInfo } = await supabase
        .from("personal_info")
        .select("currently")
        .eq("id", "default")
        .single();

      const currJson = ((currentInfo?.currently as Record<string, unknown>) || {});
      const updatedCurrently = {
        ...currJson,
        awards: listToSave,
        award_photos: photosToSave,
      };

      const { error } = await supabase
        .from("personal_info")
        .update({
          currently: updatedCurrently as any,
          updated_at: new Date().toISOString(),
        })
        .eq("id", "default");

      if (error) {
        showToast("error", `Gagal menyimpan: ${error.message}`);
      } else {
        showToast("success", "Data Awards & Kolase Foto berhasil disimpan ke Supabase!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      showToast("error", msg);
    } finally {
      setIsSavingAwards(false);
    }
  };

  const handleDeleteAward = (id: string, title: string) => {
    if (!confirm(`Hapus penghargaan "${title}"?`)) return;
    const nextList = awardsList.filter((a) => a.id !== id);
    setAwardsList(nextList);
    handleSaveAwards(nextList);
  };

  const handleSaveAwardModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAward || !editingAward.title) return;

    let nextList: AwardItem[];
    if (editingAward.id && awardsList.some((a) => a.id === editingAward.id)) {
      nextList = awardsList.map((a) => (a.id === editingAward.id ? (editingAward as AwardItem) : a));
    } else {
      const newItem: AwardItem = {
        id: editingAward.id || `award-${Date.now()}`,
        title: editingAward.title,
        link: editingAward.link || "https://github.com/Neideav",
        icon: editingAward.icon || "trophy",
      };
      nextList = [...awardsList, newItem];
    }

    setAwardsList(nextList);
    setEditingAward(null);
    handleSaveAwards(nextList);
  };

  const handleCollagePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPhoto) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Harap pilih file gambar.");
      return;
    }

    try {
      const dataUrl = await optimizeImageFile(file, 900, 0.85);
      const { colIndex, photoIndex } = editingPhoto;
      const nextCols = awardPhotos.map((col, cIdx) =>
        cIdx === colIndex
          ? col.map((p, pIdx) => (pIdx === photoIndex ? { ...p, src: dataUrl } : p))
          : col
      );
      setAwardPhotos(nextCols);
      setEditingPhoto((prev) => (prev ? { ...prev, photo: { ...prev.photo, src: dataUrl } } : null));
      showToast("success", "Foto kolase berhasil diunggah!");
      handleSaveAwards(undefined, nextCols);
    } catch (err) {
      console.error(err);
      showToast("error", "Gagal memproses gambar kolase.");
    } finally {
      if (photoFileInputRef.current) photoFileInputRef.current.value = "";
    }
  };

  const handleSavePhotoModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    const { colIndex, photoIndex, photo } = editingPhoto;
    const nextCols = awardPhotos.map((col, cIdx) =>
      cIdx === colIndex
        ? col.map((p, pIdx) => (pIdx === photoIndex ? photo : p))
        : col
    );

    setAwardPhotos(nextCols);
    setEditingPhoto(null);
    handleSaveAwards(undefined, nextCols);
  };

  // ================================================================
  // TRAININGS HANDLERS
  // ================================================================
  const handleSaveTrainings = async (newTrainings?: TrainingEntry[]) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      showToast("error", "Supabase client tidak tersedia.");
      return;
    }

    setIsSavingTrainings(true);
    try {
      const listToSave = newTrainings || trainingsList;

      const { data: currentInfo } = await supabase
        .from("personal_info")
        .select("currently")
        .eq("id", "default")
        .single();

      const currJson = ((currentInfo?.currently as Record<string, unknown>) || {});
      const updatedCurrently = {
        ...currJson,
        trainings: listToSave,
      };

      const { error } = await supabase
        .from("personal_info")
        .update({
          currently: updatedCurrently as any,
          updated_at: new Date().toISOString(),
        })
        .eq("id", "default");

      if (error) {
        showToast("error", `Gagal menyimpan: ${error.message}`);
      } else {
        showToast("success", "Data Trainings & Experience berhasil disimpan ke Supabase!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      showToast("error", msg);
    } finally {
      setIsSavingTrainings(false);
    }
  };

  const handleDeleteTraining = (id: string, title: string) => {
    if (!confirm(`Hapus pelatihan "${title}"?`)) return;
    const nextList = trainingsList.filter((t) => t.id !== id);
    setTrainingsList(nextList);
    handleSaveTrainings(nextList);
  };

  const handleSaveTrainingModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTraining || !editingTraining.title) return;

    const validImages = trainingImgInputs.filter(Boolean);
    const finalImages = validImages.length > 0 ? validImages : ["/images/projects/cloudops.png"];

    let nextList: TrainingEntry[];
    if (editingTraining.id && trainingsList.some((t) => t.id === editingTraining.id)) {
      nextList = trainingsList.map((t) =>
        t.id === editingTraining.id
          ? {
              ...(editingTraining as TrainingEntry),
              images: finalImages,
            }
          : t
      );
    } else {
      const newEntry: TrainingEntry = {
        id: editingTraining.id || `training-${Date.now()}`,
        title: editingTraining.title,
        date: editingTraining.date || "2026",
        org: editingTraining.org || "Engineering Milestone",
        desc: editingTraining.desc || "",
        certificateName: editingTraining.certificateName || "Sertifikat Pelatihan",
        certificateUrl: editingTraining.certificateUrl || "https://github.com/Neideav",
        images: finalImages,
      };
      nextList = [...trainingsList, newEntry];
    }

    setTrainingsList(nextList);
    setEditingTraining(null);
    handleSaveTrainings(nextList);
  };

  const handleTrainingFlipperImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Harap pilih file gambar.");
      return;
    }

    try {
      const dataUrl = await optimizeImageFile(file, 1000, 0.85);
      const nextInputs = [...trainingImgInputs];
      nextInputs[activeTrainingImgSlot] = dataUrl;
      setTrainingImgInputs(nextInputs);
      showToast("success", `Gambar ke-${activeTrainingImgSlot + 1} berhasil diunggah!`);
    } catch (err) {
      console.error(err);
      showToast("error", "Gagal memproses gambar pelatihan.");
    } finally {
      if (trainingFileInputRef.current) trainingFileInputRef.current.value = "";
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
      <div className="portfolio-root min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text)]" />
      </div>
    );
  }

  return (
    <div className="portfolio-root relative min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-400 font-sans flex flex-col selection:bg-[var(--text)] selection:text-[var(--surface)]">
      {/* Background SVG curved topographic lines spanning the entire page */}
      <BackgroundLines />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === "success"
              ? "bg-[var(--surface)] border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-emerald-950/20"
              : "bg-[var(--surface)] border-rose-500/40 text-rose-600 dark:text-rose-400 shadow-rose-950/20"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Top Floating Navbar matching Main Page Navbar pill */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 w-full max-w-7xl mx-auto">
        <div className="w-full bg-[#141414]/90 dark:bg-[#161616]/95 backdrop-blur-xl rounded-full px-5 sm:px-7 py-3 shadow-2xl border border-white/10 dark:border-white/20 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-white text-black dark:bg-white dark:text-black flex items-center justify-center text-xs font-bold font-mono shadow-md hover:scale-105 transition-all"
              title="Kembali ke Portofolio"
            >
              VM
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-[0.2em] uppercase font-bold text-white">
                  NAUVALDY // CMS
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[10px] text-white/60 font-mono hidden sm:block">
                {userEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
            >
              <span>Lihat Website</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
            </Link>

            {/* Theme Toggle matching Main Page Navbar */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              {isDarkTheme ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-white" />}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-rose-300 hover:text-rose-200 bg-rose-500/15 hover:bg-rose-500/25 px-3 py-1.5 rounded-full border border-rose-500/25 transition-all cursor-pointer"
              title="Keluar dari Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {/* Tab Navigation Capsule */}
        <div className="my-6 sm:my-8 flex justify-center">
          <div className="inline-flex items-center gap-1 p-1.5 bg-[var(--surface)] border border-[var(--line)] rounded-full shadow-md overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "projects"
                  ? "bg-[var(--text)] text-[var(--surface)] shadow-sm font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Projects</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === "projects"
                  ? "bg-[var(--surface)]/20 text-[var(--surface)]"
                  : "bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]"
              }`}>
                {projectsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "profile"
                  ? "bg-[var(--text)] text-[var(--surface)] shadow-sm font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile &amp; About</span>
            </button>

            <button
              onClick={() => setActiveTab("awards")}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "awards"
                  ? "bg-[var(--text)] text-[var(--surface)] shadow-sm font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Awards &amp; Collage</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === "awards"
                  ? "bg-[var(--surface)]/20 text-[var(--surface)]"
                  : "bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]"
              }`}>
                {awardsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("trainings")}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "trainings"
                  ? "bg-[var(--text)] text-[var(--surface)] shadow-sm font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Trainings</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === "trainings"
                  ? "bg-[var(--surface)]/20 text-[var(--surface)]"
                  : "bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]"
              }`}>
                {trainingsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "messages"
                  ? "bg-[var(--text)] text-[var(--surface)] shadow-sm font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Messages</span>
              {messagesList.filter((m) => m.status === "unread").length > 0 ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === "messages"
                    ? "bg-[var(--surface)]/20 text-[var(--surface)]"
                    : "bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]"
                }`}>
                  {messagesList.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: PROJECTS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm">
              <div>
                <div className="section-label mb-2">01 // REPOSITORY</div>
                <h2 className="section-title text-2xl sm:text-3xl font-bold mb-2">Projects &amp; Work Gallery</h2>
                <p className="section-desc text-xs sm:text-sm mb-0">
                  Kelola daftar proyek, deskripsi, teknologi, link GitHub, dan demo live Anda di Supabase.
                </p>
              </div>
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--surface)] hover:opacity-90 font-mono text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full shadow-sm active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Proyek Baru</span>
              </button>
            </div>

            {isLoadingProjects ? (
              <div className="p-12 text-center text-[var(--muted)] bg-[var(--surface)] border border-[var(--line)] rounded-3xl shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--text)]" />
                <span className="text-xs font-mono">Memuat proyek dari Supabase...</span>
              </div>
            ) : projectsList.length === 0 ? (
              <div className="p-12 text-center text-[var(--muted)] border border-dashed border-[var(--line)] rounded-3xl bg-[var(--surface)]">
                Belum ada proyek di database. Klik &ldquo;Tambah Proyek Baru&rdquo; untuk memulai.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projectsList.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-[var(--text)]/40 hover:-translate-y-0.5 transition-all text-[var(--text)] group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-bold text-[var(--text)] bg-[var(--surface-2)] px-2.5 py-1 rounded-md border border-[var(--line)]">
                          #{proj.number}
                        </span>
                        {proj.featured && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[var(--text)] line-clamp-1 group-hover:underline transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-2 leading-relaxed">{proj.description}</p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(proj.technologies || []).slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {proj.github_url && (
                          <a
                            href={proj.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--muted)] hover:text-[var(--text)] transition-colors p-1"
                            title="GitHub"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(proj)}
                          className="px-3 py-1.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--text)] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5"
                          title="Edit Proyek"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
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
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm">
              <div>
                <div className="section-label mb-2">02 // BIOGRAPHY &amp; PROFILE</div>
                <h2 className="section-title text-2xl sm:text-3xl font-bold mb-2">Kelola About Me &amp; Data Portofolio</h2>
                <p className="section-desc text-xs sm:text-sm mb-0">
                  Semua perubahan langsung tersimpan ke Supabase PostgreSQL <code className="font-mono bg-[var(--surface-2)] px-1.5 py-0.5 rounded border border-[var(--line)]">personal_info</code> dan tampil di portofolio.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchProfile}
                disabled={isLoadingProfile}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--text)] transition-all cursor-pointer w-fit shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProfile ? "animate-spin" : ""}`} />
                <span>Muat Ulang Data</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* SECTION A: ABOUT ME (PHOTO, WHO AM I, MY APPROACH) */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--line)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--text)]">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">Bagian About Me (Foto &amp; Narasi)</h3>
                    <p className="text-xs text-[var(--muted)] font-mono">Tampilan foto portrait, bio &ldquo;Who Am I&rdquo;, dan &ldquo;My Approach&rdquo;.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Photo Preview & Upload (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {/* Interactive Preview Card (Click to upload) */}
                    <div
                      onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                      className="w-full max-w-[240px] aspect-[4/5] relative rounded-3xl overflow-hidden bg-[var(--surface-2)] border border-[var(--line)] shadow-xl mb-4 group cursor-pointer hover:border-[var(--text)]/60 transition-all duration-300"
                      title="Klik untuk memilih foto baru dari perangkat"
                    >
                      <Image
                        src={personalData.avatar_url || "/images/nauval-portrait.png"}
                        alt={personalData.name || "Portrait Preview"}
                        fill
                        unoptimized
                        className="object-cover object-[48%_14%] transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/nauval-portrait.png";
                        }}
                      />

                      {/* Hover Overlay with Upload Icon */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3 text-center text-white">
                        <Upload className="w-6 h-6 animate-bounce" />
                        <span className="text-xs font-bold font-mono uppercase tracking-wider">Ganti Foto</span>
                        <span className="text-[10px] text-white/70 font-mono">Klik untuk upload</span>
                      </div>

                      {/* Bottom Tag */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none text-white">
                        <span className="text-[10px] font-mono font-bold bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                          About Card
                        </span>
                        <span className="text-[10px] font-mono font-semibold flex items-center gap-1 text-white/80">
                          <Camera className="w-3 h-3" />
                          <span>4:5</span>
                        </span>
                      </div>

                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 z-10 text-white">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="text-xs font-mono font-semibold">Memproses...</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls & Actions */}
                    <div className="w-full space-y-2.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[var(--text)] text-[var(--surface)] hover:opacity-90 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Memproses Foto...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Pilih Foto dari Perangkat</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-[11px] pt-1 font-mono">
                        <button
                          type="button"
                          onClick={() => setShowManualUrl(!showManualUrl)}
                          className="text-[var(--muted)] hover:text-[var(--text)] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Link2 className="w-3 h-3" />
                          <span>{showManualUrl ? "Tutup Input URL" : "Pakai URL Online"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPersonalData({ ...personalData, avatar_url: "/images/nauval-portrait.png" })
                          }
                          className="text-[var(--text)] hover:underline cursor-pointer"
                        >
                          Reset Default
                        </button>
                      </div>

                      {showManualUrl && (
                        <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                            URL Gambar Alternatif:
                          </label>
                          <input
                            type="text"
                            value={personalData.avatar_url}
                            onChange={(e) => setPersonalData({ ...personalData, avatar_url: e.target.value })}
                            placeholder="/images/nauval-portrait.png atau https://..."
                            className="w-full px-3.5 py-2 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs text-[var(--text)] outline-none font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Narration Texts (8 cols) */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2 flex items-center justify-between">
                        <span>Who Am I (Deskripsi Diri)</span>
                        <span className="text-[10px] text-[var(--muted)]/70 font-mono normal-case">Kolom kiri About Me</span>
                      </label>
                      <textarea
                        rows={4}
                        value={personalData.bio}
                        onChange={(e) => setPersonalData({ ...personalData, bio: e.target.value })}
                        placeholder="Deskripsi spesialisasi dan latar belakang kamu..."
                        className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-2xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2 flex items-center justify-between">
                        <span>My Approach (Pendekatan Saya)</span>
                        <span className="text-[10px] text-[var(--muted)]/70 font-mono normal-case">Kolom kanan About Me</span>
                      </label>
                      <textarea
                        rows={4}
                        value={personalData.my_approach}
                        onChange={(e) => setPersonalData({ ...personalData, my_approach: e.target.value })}
                        placeholder="Prinsip rekayasa, keandalan sistem, standar kualitas..."
                        className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-2xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: PERSONAL DETAILS (THE 6 SPECIFIC FIELDS) */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--line)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--text)]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">Personal Details (Tabel 6 Rincian)</h3>
                    <p className="text-xs text-[var(--muted)] font-mono">Data ini muncul pada kartu rincian di bawah narasi About Me.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* 1. Name */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      1. Name (Nama Lengkap)
                    </label>
                    <input
                      type="text"
                      value={personalData.name}
                      onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                      required
                      placeholder="Muhammad Bahruddin Nauvaldy Maulana"
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors font-medium"
                    />
                  </div>

                  {/* 2. Place of Birth */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      2. Place of Birth (Tempat Lahir)
                    </label>
                    <input
                      type="text"
                      value={personalData.place_of_birth}
                      onChange={(e) => setPersonalData({ ...personalData, place_of_birth: e.target.value })}
                      placeholder="Batu, Indonesia"
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors font-medium"
                    />
                  </div>

                  {/* 3. Role */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      3. Role (Jabatan / Peran)
                    </label>
                    <input
                      type="text"
                      value={personalData.title}
                      onChange={(e) => setPersonalData({ ...personalData, title: e.target.value })}
                      placeholder="Cloud Engineer · Backend Developer · DevOps Engineer"
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors font-medium"
                    />
                  </div>

                  {/* 4. GPA */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      4. GPA (Nilai / IPK)
                    </label>
                    <input
                      type="text"
                      value={personalData.gpa}
                      onChange={(e) => setPersonalData({ ...personalData, gpa: e.target.value })}
                      placeholder="N/A atau 3.90"
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors font-mono font-medium"
                    />
                  </div>

                  {/* 5. Email */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      5. Email Kontak
                    </label>
                    <input
                      type="email"
                      value={personalData.email}
                      onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                      required
                      placeholder="nvaldymaulana@gmail.com"
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors font-mono"
                    />
                  </div>

                  {/* 6. Education */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      6. Education (Pendidikan)
                    </label>
                    <input
                      type="text"
                      value={personalData.education}
                      onChange={(e) => setPersonalData({ ...personalData, education: e.target.value })}
                      placeholder="SMKS PGRI 3 Malang"
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: HERO SECTION HEADLINE & AVAILABILITY */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--line)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--text)]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">Hero Section (Headline &amp; Ketersediaan)</h3>
                    <p className="text-xs text-[var(--muted)] font-mono">Teks pembuka di layar utama portofolio.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      Hero Statement / Kutipan Utama
                    </label>
                    <textarea
                      rows={2}
                      value={personalData.short_bio}
                      onChange={(e) => setPersonalData({ ...personalData, short_bio: e.target.value })}
                      placeholder="Kalimat pengantar di bagian bawah foto Hero..."
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                        Status Ketersediaan
                      </label>
                      <input
                        type="text"
                        value={personalData.availability}
                        onChange={(e) => setPersonalData({ ...personalData, availability: e.target.value })}
                        placeholder="Available for hire"
                        className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                        Lokasi Domisili
                      </label>
                      <input
                        type="text"
                        value={personalData.location}
                        onChange={(e) => setPersonalData({ ...personalData, location: e.target.value })}
                        placeholder="Malang, Indonesia"
                        className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                        Link Dokumen CV / Resume
                      </label>
                      <input
                        type="url"
                        value={personalData.resume_url}
                        onChange={(e) => setPersonalData({ ...personalData, resume_url: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION D: SOCIAL MEDIA & "CURRENTLY" STATUS */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--line)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--text)]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">Tautan Sosial &amp; Status Terkini</h3>
                    <p className="text-xs text-[var(--muted)] font-mono">Akun media sosial dan fokus kegiatan saat ini.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={personalData.github}
                      onChange={(e) => setPersonalData({ ...personalData, github: e.target.value })}
                      placeholder="https://github.com/Neideav"
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={personalData.linkedin}
                      onChange={(e) => setPersonalData({ ...personalData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/nvaldymaulana"
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      Currently Building
                    </label>
                    <input
                      type="text"
                      value={personalData.currently_building}
                      onChange={(e) => setPersonalData({ ...personalData, currently_building: e.target.value })}
                      placeholder="Cloud-native microservices..."
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      Currently Exploring
                    </label>
                    <input
                      type="text"
                      value={personalData.currently_exploring}
                      onChange={(e) => setPersonalData({ ...personalData, currently_exploring: e.target.value })}
                      placeholder="Kubernetes Operators..."
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                      Currently Learning
                    </label>
                    <input
                      type="text"
                      value={personalData.currently_learning}
                      onChange={(e) => setPersonalData({ ...personalData, currently_learning: e.target.value })}
                      placeholder="Rust &amp; eBPF security..."
                      className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[var(--text)] text-[var(--surface)] hover:opacity-90 shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Seluruh Perubahan Profil</span>
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm">
              <div>
                <div className="section-label mb-2">03 // COMMUNICATIONS</div>
                <h2 className="section-title text-2xl sm:text-3xl font-bold mb-2">Contact Messages Inbox</h2>
                <p className="section-desc text-xs sm:text-sm mb-0">
                  Daftar pesan masuk yang dikirim pengunjung melalui formulir kontak portofolio.
                </p>
              </div>
              <button
                onClick={fetchMessages}
                disabled={isLoadingMessages}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--text)] transition-all cursor-pointer w-fit shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? "animate-spin" : ""}`} />
                <span>Refresh Inbox</span>
              </button>
            </div>

            {isLoadingMessages ? (
              <div className="p-12 text-center text-[var(--muted)] bg-[var(--surface)] border border-[var(--line)] rounded-3xl shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--text)]" />
                <span className="text-xs font-mono">Memuat pesan...</span>
              </div>
            ) : messagesList.length === 0 ? (
              <div className="p-12 text-center text-[var(--muted)] border border-dashed border-[var(--line)] rounded-3xl bg-[var(--surface)]">
                Belum ada pesan yang masuk dari pengunjung.
              </div>
            ) : (
              <div className="space-y-4">
                {messagesList.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-[var(--surface)] border rounded-2xl p-6 shadow-sm transition-all ${
                      msg.status === "unread"
                        ? "border-[var(--text)]/40 shadow-md"
                        : "border-[var(--line)]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--line)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center font-bold font-mono text-sm text-[var(--text)]">
                          {(msg.name || "A")[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                            <span>{msg.name}</span>
                            {msg.status === "unread" && (
                              <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                                Baru
                              </span>
                            )}
                          </h3>
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-xs text-[var(--muted)] hover:text-[var(--text)] font-mono transition-colors"
                          >
                            {msg.email}
                          </a>
                        </div>
                      </div>
                      <span className="text-[11px] text-[var(--muted)] font-mono">
                        {new Date(msg.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="bg-[var(--surface-2)] border-l-2 border-[var(--text)] p-4 rounded-r-xl my-4 text-xs sm:text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => handleToggleMessageStatus(msg)}
                        className="px-3.5 py-1.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--text)] font-mono text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{msg.status === "unread" ? "Tandai Dibaca" : "Tandai Belum Dibaca"}</span>
                      </button>
                      <a
                        href={`mailto:${msg.email}?subject=Balasan: Portofolio Nauvaldy&body=Halo ${msg.name},%0D%0A%0D%0ATerima kasih atas pesan Anda:%0D%0A"${encodeURIComponent(msg.message)}"%0D%0A%0D%0A`}
                        className="px-3.5 py-1.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--text)] font-mono text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Balas Email</span>
                      </a>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: AWARDS & 8-PHOTO COLLAGE */}
        {/* ============================================================== */}
        {activeTab === "awards" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm">
              <div>
                <div className="section-label mb-2">04 // RECOGNITION</div>
                <h2 className="section-title text-2xl sm:text-3xl font-bold mb-2">Awards &amp; 8-Photo Collage</h2>
                <p className="section-desc text-xs sm:text-sm mb-0">
                  Kelola kartu penghargaan di sisi kanan dan galeri 8 foto kolase di sisi kiri pada section Recognition.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setEditingAward({ id: "", title: "", link: "", icon: "trophy" })}
                  className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--surface)] hover:opacity-90 font-mono text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full shadow-sm active:scale-[0.98] transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Penghargaan</span>
                </button>
              </div>
            </div>

            {/* AWARDS SECTION */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--text)]">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">Daftar Penghargaan (Sisi Kanan)</h3>
                    <p className="text-xs text-[var(--muted)] font-mono">Tersimpan di JSON awards Supabase.</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-[var(--surface-2)] text-[var(--muted)] px-3 py-1 rounded-full border border-[var(--line)]">
                  Total: {awardsList.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {awardsList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[var(--surface-2)] border border-[var(--line)] rounded-2xl p-4 flex items-center justify-between hover:border-[var(--text)]/40 hover:-translate-y-0.5 transition-all text-[var(--text)] group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--text)] shrink-0">
                        {item.icon === "cap" && <GraduationCap className="w-5 h-5" />}
                        {item.icon === "trophy" && <Trophy className="w-5 h-5" />}
                        {item.icon === "shield" && <ShieldCheck className="w-5 h-5" />}
                        {item.icon === "languages" && <Languages className="w-5 h-5" />}
                        {!["cap", "trophy", "shield", "languages"].includes(item.icon) && (
                          <Award className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[var(--text)] truncate">{item.title}</h4>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[var(--muted)] hover:text-[var(--text)] font-mono truncate flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate">{item.link}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                      <button
                        onClick={() => setEditingAward(item)}
                        className="p-2 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] transition-all cursor-pointer"
                        title="Edit Penghargaan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAward(item.id, item.title)}
                        className="p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                        title="Hapus Penghargaan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8-PHOTO COLLAGE SECTION */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--text)]">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">Galeri 8 Foto Kolase (Sisi Kiri)</h3>
                    <p className="text-xs text-[var(--muted)] font-mono">4 Kolom x 2 Foto vertikal dan landscape.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Reset penghargaan & foto kolase ke default?")) {
                      setAwardsList(defaultAwardsList);
                      setAwardPhotos(defaultPhotoColumns);
                      handleSaveAwards(defaultAwardsList, defaultPhotoColumns);
                    }
                  }}
                  className="text-xs font-mono text-[var(--muted)] hover:text-[var(--text)] hover:underline cursor-pointer"
                >
                  Reset Default
                </button>
              </div>

              {/* 4 Columns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {awardPhotos.map((col, colIndex) => (
                  <div key={colIndex} className="bg-[var(--surface-2)] border border-[var(--line)] rounded-2xl p-4 space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                      <span className="font-mono text-xs font-bold text-[var(--text)]">
                        Kolom #{colIndex + 1}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--muted)]">2 Foto</span>
                    </div>

                    {col.map((photo, photoIndex) => (
                      <div
                        key={photo.id}
                        className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 space-y-2.5 shadow-sm"
                      >
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-[var(--surface-2)] border border-[var(--line)]">
                          {photo.src ? (
                            <Image
                              src={photo.src}
                              alt={photo.badge}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-[10px] font-mono">
                              Kosong
                            </div>
                          )}
                          <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded-full text-[9px] font-mono text-white backdrop-blur-sm border border-white/10">
                            {photo.orientation}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-[var(--text)] truncate">{photo.badge}</div>
                          <div className="text-[10px] text-[var(--muted)] font-mono truncate">{photo.alt}</div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPhoto({ colIndex, photoIndex, photo });
                              photoFileInputRef.current?.click();
                            }}
                            className="flex-1 py-1 px-2 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--text)] flex items-center justify-center gap-1 cursor-pointer transition-all"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPhoto({ colIndex, photoIndex, photo })}
                            className="p-1 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--text)] cursor-pointer transition-all"
                            title="Edit URL &amp; Badge"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: TRAININGS & FLIPPER EXPERIENCE */}
        {/* ============================================================== */}
        {activeTab === "trainings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--surface)] border border-[var(--line)] p-6 sm:p-8 rounded-3xl shadow-sm">
              <div>
                <div className="section-label mb-2">05 // GROWTH &amp; EXPERIENCE</div>
                <h2 className="section-title text-2xl sm:text-3xl font-bold mb-2">Trainings &amp; Interactive Milestones</h2>
                <p className="section-desc text-xs sm:text-sm mb-0">
                  Setiap milestone memiliki 3 slot gambar interaktif flipper yang berputar saat kartu diklik oleh pengunjung.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingTraining({ id: "", date: "2026", title: "", org: "", desc: "", certificateName: "", certificateUrl: "" });
                  setTrainingImgInputs(["", "", ""]);
                }}
                className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--surface)] hover:opacity-90 font-mono text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full shadow-sm active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pelatihan</span>
              </button>
            </div>

            {trainingsList.length === 0 ? (
              <div className="p-12 text-center text-[var(--muted)] border border-dashed border-[var(--line)] rounded-3xl bg-[var(--surface)]">
                Belum ada pelatihan di database.
              </div>
            ) : (
              <div className="space-y-6">
                {trainingsList.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 shadow-sm text-[var(--text)] space-y-6 hover:border-[var(--text)]/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--line)]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] px-2.5 py-1 rounded-md">
                          0{index + 1}
                        </span>
                        <div>
                          <div className="font-mono text-xs text-[var(--muted)]">{entry.date}</div>
                          <h3 className="text-lg font-bold text-[var(--text)]">{entry.title}</h3>
                          <div className="text-xs text-[var(--muted)] font-medium">{entry.org}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTraining(entry);
                            setTrainingImgInputs(entry.images || ["", "", ""]);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--text)] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTraining(entry.id, entry.title)}
                          className="px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">{entry.desc}</p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <a
                        href={entry.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono bg-[var(--surface-2)] border border-[var(--line)] px-3.5 py-1.5 rounded-full text-[var(--text)] hover:border-[var(--text)] transition-colors"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{entry.certificateName}</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>

                      <span className="font-mono text-xs text-[var(--muted)]">3 Flipper Cards:</span>
                    </div>

                    {/* 3 Thumbnails Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {[0, 1, 2].map((imgIdx) => {
                        const imgUrl = (entry.images || [])[imgIdx];
                        return (
                          <div
                            key={imgIdx}
                            className="relative h-28 rounded-xl overflow-hidden bg-[var(--surface-2)] border border-[var(--line)]"
                          >
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={`Flipper ${imgIdx + 1}`}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-[10px] font-mono">
                                Slot {imgIdx + 1} Kosong
                              </div>
                            )}
                            <div className="absolute bottom-1.5 right-1.5 bg-black/70 px-2 py-0.5 rounded-full text-[9px] font-mono text-white border border-white/10 backdrop-blur-sm">
                              {imgIdx + 1}/3
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ============================================================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-[var(--text)]">
            <button
              onClick={() => setEditingProject(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <div className="section-label mb-1">// PROJECT REPOSITORY</div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
                {editingProject.title ? `Edit: ${editingProject.title}` : "Tambah Proyek Baru"}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Data akan disinkronkan langsung ke database Supabase dan tampil di portofolio.
              </p>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
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
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-mono transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                    Nomor Urut (misal 01, 02)
                  </label>
                  <input
                    type="text"
                    value={editingProject.number || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, number: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Judul Proyek
                </label>
                <input
                  type="text"
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="FinTrack Pro — Aplikasi Keuangan"
                  required
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-medium transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Kategori
                </label>
                <input
                  type="text"
                  value={editingProject.category || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  placeholder="Full-Stack Web App &amp; Finance Analytics"
                  required
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Deskripsi Lengkap
                </label>
                <textarea
                  rows={3}
                  value={editingProject.detailed_description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, detailed_description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Technologies (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React.js, Node.js, Tailwind CSS, PostgreSQL"
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-mono transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.github_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, github_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-mono transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                    Live Demo URL (Opsional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.live_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, live_url: e.target.value })
                    }
                    placeholder="https://myproject.vercel.app"
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[var(--text)] focus:ring-[var(--text)]"
                  />
                  <span className="text-xs text-[var(--text)] font-medium">Tampilkan di Featured Showcase</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">Sort:</span>
                  <input
                    type="number"
                    value={editingProject.sort_order || 1}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, sort_order: Number(e.target.value) })
                    }
                    className="w-16 px-2.5 py-1.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-xs text-[var(--text)] font-mono text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold text-[var(--muted)] hover:text-[var(--text)] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[var(--text)] text-[var(--surface)] hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
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

      {/* Hidden file input for Photo Collage upload */}
      <input
        type="file"
        ref={photoFileInputRef}
        onChange={handleCollagePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden file input for Trainings Flipper upload */}
      <input
        type="file"
        ref={trainingFileInputRef}
        onChange={handleTrainingFlipperImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT AWARD */}
      {/* ============================================================== */}
      {editingAward && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 text-[var(--text)]">
            <button
              onClick={() => setEditingAward(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <div className="section-label mb-1">// HONORS &amp; CREDENTIALS</div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
                {editingAward.id ? "Edit Penghargaan" : "Tambah Penghargaan Baru"}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1 font-mono">
                Tersimpan di kolom <code className="bg-[var(--surface-2)] px-1 py-0.5 rounded border border-[var(--line)]">currently.awards</code>
              </p>
            </div>

            <form onSubmit={handleSaveAwardModal} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Judul Penghargaan / Sertifikasi
                </label>
                <input
                  type="text"
                  value={editingAward.title || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })}
                  placeholder="Misal: Dean's Lister, Top 30 Nasional"
                  required
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-medium transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Link Sertifikat / Bukti Kredensial (URL)
                </label>
                <input
                  type="url"
                  value={editingAward.link || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, link: e.target.value })}
                  placeholder="https://..."
                  required
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                  Pilih Ikon Tampilan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { key: "trophy", label: "Trophy", icon: Trophy },
                    { key: "cap", label: "Toga", icon: GraduationCap },
                    { key: "shield", label: "Perisai", icon: ShieldCheck },
                    { key: "languages", label: "Bahasa", icon: Languages },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isSelected = (editingAward.icon || "trophy") === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setEditingAward({
                            ...editingAward,
                            icon: item.key as AwardItem["icon"],
                          })
                        }
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[var(--text)] text-[var(--surface)] border-[var(--text)] shadow-sm font-semibold"
                            : "bg-[var(--surface-2)] border-[var(--line)] text-[var(--muted)] hover:border-[var(--text)]/40 hover:text-[var(--text)]"
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="font-mono text-[11px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setEditingAward(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold text-[var(--muted)] hover:text-[var(--text)] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[var(--text)] text-[var(--surface)] hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  Simpan Penghargaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT COLLAGE PHOTO */}
      {/* ============================================================== */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative my-8 text-[var(--text)]">
            <button
              onClick={() => setEditingPhoto(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <div className="section-label mb-1">// COLLAGE FRAME EDITOR</div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
                Edit Foto Kolase (Kolom #{editingPhoto.colIndex + 1}, Foto #{editingPhoto.photoIndex + 1})
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Ganti gambar langsung dari file perangkat Anda atau masukkan link gambar.
              </p>
            </div>

            <form onSubmit={handleSavePhotoModal} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                  Pratinjau Foto
                </label>
                <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center">
                  {editingPhoto.photo.src ? (
                    <Image
                      src={editingPhoto.photo.src}
                      alt={editingPhoto.photo.badge || "Preview"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs font-mono text-[var(--muted)]">Belum ada foto</span>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => photoFileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--text)] text-xs font-mono uppercase tracking-wider font-semibold border border-[var(--line)] hover:border-[var(--text)] transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Unggah Foto dari Perangkat</span>
                </button>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Atau Masukkan URL Gambar Manual
                </label>
                <input
                  type="text"
                  value={editingPhoto.photo.src || ""}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      photo: { ...editingPhoto.photo, src: e.target.value },
                    })
                  }
                  placeholder="/images/awards/photo.jpg atau https://..."
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Label Badge Foto
                </label>
                <input
                  type="text"
                  value={editingPhoto.photo.badge || ""}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      photo: { ...editingPhoto.photo, badge: e.target.value },
                    })
                  }
                  placeholder="Misal: Dean's Lister, Competition Winner"
                  required
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-medium transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Orientasi Tampilan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "vertical", label: "Tegak (Portrait)" },
                    { key: "landscape", label: "Melebar (Landscape)" },
                  ].map((ori) => (
                    <button
                      key={ori.key}
                      type="button"
                      onClick={() =>
                        setEditingPhoto({
                          ...editingPhoto,
                          photo: {
                            ...editingPhoto.photo,
                            orientation: ori.key as "vertical" | "landscape",
                          },
                        })
                      }
                      className={`py-2 px-3 rounded-xl border text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                        editingPhoto.photo.orientation === ori.key
                          ? "bg-[var(--text)] text-[var(--surface)] border-[var(--text)] shadow-sm"
                          : "bg-[var(--surface-2)] border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
                      }`}
                    >
                      {ori.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold text-[var(--muted)] hover:text-[var(--text)] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[var(--text)] text-[var(--surface)] hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT TRAINING */}
      {/* ============================================================== */}
      {editingTraining && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-[var(--text)]">
            <button
              onClick={() => setEditingTraining(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <div className="section-label mb-1">// TRAINING &amp; FLIPPER EXPERIENCE</div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
                {editingTraining.id && trainingsList.some((t) => t.id === editingTraining.id)
                  ? "Edit Training & Experience"
                  : "Tambah Pelatihan Baru"}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Milestone teknis dengan 3 gambar flipper interaktif yang berputar saat kartu diklik.
              </p>
            </div>

            <form onSubmit={handleSaveTrainingModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                    Periode / Tahun
                  </label>
                  <input
                    type="text"
                    value={editingTraining.date || ""}
                    onChange={(e) => setEditingTraining({ ...editingTraining, date: e.target.value })}
                    placeholder="2026 — Present atau 2025"
                    required
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-mono transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                    Sub-Judul / Penyelenggara
                  </label>
                  <input
                    type="text"
                    value={editingTraining.org || ""}
                    onChange={(e) => setEditingTraining({ ...editingTraining, org: e.target.value })}
                    placeholder="Infrastructure &amp; CI/CD Development"
                    required
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Judul Pelatihan / Milestone
                </label>
                <input
                  type="text"
                  value={editingTraining.title || ""}
                  onChange={(e) => setEditingTraining({ ...editingTraining, title: e.target.value })}
                  placeholder="Cloud &amp; DevOps Infrastructure Engineering"
                  required
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-medium transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                  Deskripsi Pengalaman
                </label>
                <textarea
                  rows={3}
                  value={editingTraining.desc || ""}
                  onChange={(e) => setEditingTraining({ ...editingTraining, desc: e.target.value })}
                  placeholder="Tuliskan ringkasan peran, teknologi, dan pencapaian selama kegiatan..."
                  required
                  className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                    Nama Badge Sertifikat
                  </label>
                  <input
                    type="text"
                    value={editingTraining.certificateName || ""}
                    onChange={(e) =>
                      setEditingTraining({ ...editingTraining, certificateName: e.target.value })
                    }
                    placeholder="IBM DevOps and Software Engineering"
                    required
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-1.5">
                    Link Sertifikat (URL)
                  </label>
                  <input
                    type="url"
                    value={editingTraining.certificateUrl || ""}
                    onChange={(e) =>
                      setEditingTraining({ ...editingTraining, certificateUrl: e.target.value })
                    }
                    placeholder="https://..."
                    required
                    className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none font-mono transition-colors"
                  />
                </div>
              </div>

              {/* 3 FLIPPER IMAGES EDITOR */}
              <div className="pt-2">
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2.5">
                  3 Slot Gambar Card Flipper (Berganti saat Kartu Diklik)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((slotIdx) => {
                    const currentImg = trainingImgInputs[slotIdx] || "";
                    return (
                      <div
                        key={slotIdx}
                        className="bg-[var(--surface-2)] border border-[var(--line)] rounded-2xl p-3.5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[var(--text)] font-mono">
                            Slot #{slotIdx + 1} {slotIdx === 0 ? "(Utama)" : `(Flip ${slotIdx})`}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--line)]">
                            {slotIdx + 1}/3
                          </span>
                        </div>

                        <div className="relative w-full h-24 rounded-xl overflow-hidden bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center">
                          {currentImg ? (
                            <Image
                              src={currentImg}
                              alt={`Slot ${slotIdx + 1}`}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-mono text-[var(--muted)]">Belum ada</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveTrainingImgSlot(slotIdx);
                            trainingFileInputRef.current?.click();
                          }}
                          className="w-full py-1.5 px-2 bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--line)] hover:border-[var(--text)] text-[var(--text)] rounded-full text-[11px] font-mono uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Pilih Gambar</span>
                        </button>

                        <input
                          type="text"
                          value={currentImg}
                          onChange={(e) => {
                            const next = [...trainingImgInputs];
                            next[slotIdx] = e.target.value;
                            setTrainingImgInputs(next);
                          }}
                          placeholder="URL manual..."
                          className="w-full px-3 py-1.5 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-[10px] text-[var(--text)] placeholder-[var(--muted)]/50 focus:border-[var(--text)] outline-none font-mono"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setEditingTraining(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold text-[var(--muted)] hover:text-[var(--text)] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--line)] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[var(--text)] text-[var(--surface)] hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  Simpan Pelatihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
