"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Globe,
  Upload,
  ImageIcon,
  Link2,
  Trophy,
  GraduationCap,
  ShieldCheck,
  Languages,
  Award,
  BookOpen
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
            onClick={() => setActiveTab("awards")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "awards"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Awards & Prestasi ({awardsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("trainings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "trainings"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Trainings & Experience ({trainingsList.length})</span>
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
                  {/* Photo Preview & Upload (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                    {/* Hidden file input */}
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
                      className="w-full max-w-[220px] aspect-[4/5] relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl mb-3 group cursor-pointer hover:border-emerald-500/50 transition-all duration-300"
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
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                        <Upload className="w-6 h-6 text-emerald-400 animate-bounce" />
                        <span className="text-xs font-bold text-white">Ganti Foto</span>
                        <span className="text-[10px] text-zinc-300">Klik untuk upload</span>
                      </div>

                      {/* Bottom Tag */}
                      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-mono font-bold text-zinc-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                          Live Card
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          <span>4:5</span>
                        </span>
                      </div>

                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 z-10">
                          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                          <span className="text-xs font-semibold text-emerald-300">Memproses...</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls & Actions */}
                    <div className="w-full space-y-2.5">
                      {/* Primary Upload Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
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

                      {/* URL Toggle & Reset Button */}
                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <button
                          type="button"
                          onClick={() => setShowManualUrl(!showManualUrl)}
                          className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Link2 className="w-3 h-3" />
                          <span>{showManualUrl ? "Tutup Input URL" : "Pakai URL Online"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPersonalData({ ...personalData, avatar_url: "/images/nauval-portrait.png" })
                          }
                          className="text-emerald-400 hover:text-emerald-300 transition-colors underline cursor-pointer"
                        >
                          Reset Default
                        </button>
                      </div>

                      {/* Manual URL Input (Collapsible) */}
                      {showManualUrl && (
                        <div className="space-y-1 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          <label className="block text-[11px] font-medium text-zinc-400">
                            URL Gambar Alternatif:
                          </label>
                          <input
                            type="text"
                            value={personalData.avatar_url}
                            onChange={(e) => setPersonalData({ ...personalData, avatar_url: e.target.value })}
                            placeholder="/images/nauval-portrait.png atau https://..."
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      )}
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

        {/* ============================================================== */}
        {/* TAB 4: AWARDS & ACHIEVEMENTS + PHOTO COLLAGE */}
        {/* ============================================================== */}
        {activeTab === "awards" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>Awards, Prestasi & Kolase Foto</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Bagian ini mengatur daftar pencapaian di sebelah kanan dan 8 foto kolase (4 kolom) di sebelah kiri pada section Recognition.
                  Data tersimpan secara otomatis di kolom <code className="text-emerald-400">currently.awards</code> dan <code className="text-emerald-400">currently.award_photos</code>.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingAward({ title: "", link: "", icon: "trophy" })}
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Penghargaan</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveAwards()}
                  disabled={isSavingAwards}
                  className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingAwards ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Semua</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* SECTION 1: AWARDS LIST */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Daftar Penghargaan & Sertifikasi ({awardsList.length})</span>
                </h3>
                <span className="text-xs text-zinc-400">Tampil di sisi kanan section Awards</span>
              </div>

              {awardsList.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                  Belum ada penghargaan. Klik &ldquo;Tambah Penghargaan&rdquo; untuk menambahkan.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {awardsList.map((award, idx) => (
                    <div
                      key={award.id || idx}
                      className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0">
                          {award.icon === "cap" && <GraduationCap className="w-5 h-5 text-emerald-400" />}
                          {award.icon === "trophy" && <Trophy className="w-5 h-5 text-amber-400" />}
                          {award.icon === "shield" && <ShieldCheck className="w-5 h-5 text-teal-400" />}
                          {award.icon === "languages" && <Languages className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">{award.title}</h4>
                          <a
                            href={award.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-zinc-400 hover:text-emerald-400 flex items-center gap-1 mt-0.5 truncate transition-colors"
                          >
                            <span className="truncate">{award.link}</span>
                            <ArrowUpRight className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingAward({ ...award })}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Penghargaan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAward(award.id, award.title)}
                          className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                          title="Hapus Penghargaan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 2: PHOTO COLLAGE */}
            <div className="space-y-4 pt-4 border-t border-zinc-800/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Galeri Kolase Foto (4 Kolom × 2 Foto)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tampil sebagai animasi bergerak di sisi kiri section Awards. Klik &ldquo;Edit Foto &amp; Badge&rdquo; untuk upload dari HP/laptop atau ganti label.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  Total 8 Foto Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {awardPhotos.map((column, colIdx) => (
                  <div
                    key={colIdx}
                    className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3.5 space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                      <span className="text-xs font-bold text-zinc-300">Kolom #{colIdx + 1}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                        {colIdx % 2 === 0 ? "Normal" : "Reverse"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {column.map((photo, photoIdx) => (
                        <div
                          key={photo.id || photoIdx}
                          className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-2.5 space-y-2 hover:border-zinc-700 transition-all"
                        >
                          <div className="relative w-full h-32 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800/60 group">
                            {photo.src ? (
                              <Image
                                src={photo.src}
                                alt={photo.badge || "Award Photo"}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                                Tanpa Foto
                              </div>
                            )}
                            <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-300 border border-emerald-500/20">
                              {photo.badge || "Photo"}
                            </div>
                            <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-400 capitalize">
                              {photo.orientation}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setEditingPhoto({
                                colIndex: colIdx,
                                photoIndex: photoIdx,
                                photo: { ...photo },
                              })
                            }
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-300 text-xs font-medium border border-zinc-700/60 hover:border-emerald-500/30 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Foto &amp; Badge</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: TRAININGS & EXPERIENCE */}
        {/* ============================================================== */}
        {activeTab === "trainings" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Trainings &amp; Experience (Milestones)</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Bagian ini menampilkan kartu milestone teknis di section Trainings &amp; Experience. Setiap milestone memiliki 3 gambar flipper interaktif yang berputar saat diklik.
                  Tersimpan di Supabase di kolom <code className="text-emerald-400">currently.trainings</code>.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTraining({
                      id: `training-${Date.now()}`,
                      title: "",
                      date: "2026 — Present",
                      org: "",
                      desc: "",
                      certificateName: "Sertifikat Pelatihan",
                      certificateUrl: "https://github.com/Neideav",
                    });
                    setTrainingImgInputs(["", "", ""]);
                  }}
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pelatihan Baru</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveTrainings()}
                  disabled={isSavingTrainings}
                  className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingTrainings ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trainings List */}
            {trainingsList.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                Belum ada data pelatihan. Klik &ldquo;Tambah Pelatihan Baru&rdquo; untuk memulai.
              </div>
            ) : (
              <div className="space-y-4">
                {trainingsList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-zinc-700 transition-all"
                  >
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
                            {item.date}
                          </span>
                          <span className="text-xs text-zinc-400">· {item.org}</span>
                        </div>
                        <h3 className="text-base font-bold text-white">{item.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTraining({ ...item });
                            setTrainingImgInputs(
                              item.images && item.images.length > 0
                                ? [...item.images, "", "", ""].slice(0, 3)
                                : ["", "", ""]
                            );
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Pelatihan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTraining(item.id, item.title)}
                          className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                          title="Hapus Pelatihan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Description & Certificate */}
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-zinc-500">Sertifikat:</span>
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1 rounded-lg hover:bg-emerald-950/50 transition-colors"
                      >
                        <span>{item.certificateName}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>

                    {/* 3 Images Flipper Preview */}
                    <div>
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                        3 Gambar Flipper (Tampil Bergantian saat Diklik):
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {(item.images || []).slice(0, 3).map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative h-24 sm:h-28 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800"
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
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px]">
                                Slot {imgIdx + 1} Kosong
                              </div>
                            )}
                            <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-300">
                              {imgIdx + 1}/3
                            </div>
                          </div>
                        ))}
                      </div>
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingAward(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingAward.id ? "Edit Penghargaan" : "Tambah Penghargaan Baru"}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Data akan disimpan ke kolom <code className="text-emerald-400">currently.awards</code> Supabase.
            </p>

            <form onSubmit={handleSaveAwardModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Judul Penghargaan / Sertifikasi
                </label>
                <input
                  type="text"
                  value={editingAward.title || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })}
                  placeholder="Misal: Dean's Lister, Top 30 Nasional"
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Link Sertifikat / Bukti Kredensial (URL)
                </label>
                <input
                  type="url"
                  value={editingAward.link || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, link: e.target.value })}
                  placeholder="https://..."
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Pilih Ikon Tampilan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { key: "trophy", label: "Trophy", icon: Trophy, color: "text-amber-400" },
                    { key: "cap", label: "Toga", icon: GraduationCap, color: "text-emerald-400" },
                    { key: "shield", label: "Perisai", icon: ShieldCheck, color: "text-teal-400" },
                    { key: "languages", label: "Bahasa", icon: Languages, color: "text-cyan-400" },
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
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                        }`}
                      >
                        <IconComp className={`w-5 h-5 ${item.color}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingAward(null)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingPhoto(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              Edit Foto Kolase (Kolom #{editingPhoto.colIndex + 1}, Foto #{editingPhoto.photoIndex + 1})
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Ganti gambar langsung dari perangkat Anda atau masukkan link gambar.
            </p>

            <form onSubmit={handleSavePhotoModal} className="space-y-4">
              {/* Photo Preview */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Pratinjau Foto</label>
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/60 border border-zinc-800 flex items-center justify-center">
                  {editingPhoto.photo.src ? (
                    <Image
                      src={editingPhoto.photo.src}
                      alt={editingPhoto.photo.badge || "Preview"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs text-zinc-600">Belum ada foto</span>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <div>
                <button
                  type="button"
                  onClick={() => photoFileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Unggah Foto dari Perangkat (HP / Laptop)</span>
                </button>
              </div>

              {/* Manual URL Input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
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
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
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
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
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
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        editingPhoto.photo.orientation === ori.key
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {ori.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingTraining(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingTraining.id && trainingsList.some((t) => t.id === editingTraining.id)
                ? "Edit Training & Experience"
                : "Tambah Pelatihan Baru"}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Milestone teknis dengan 3 gambar flipper interaktif yang berputar saat kartu diklik.
            </p>

            <form onSubmit={handleSaveTrainingModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Periode / Tahun
                  </label>
                  <input
                    type="text"
                    value={editingTraining.date || ""}
                    onChange={(e) => setEditingTraining({ ...editingTraining, date: e.target.value })}
                    placeholder="2026 — Present atau 2025"
                    required
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Sub-Judul / Penyelenggara
                  </label>
                  <input
                    type="text"
                    value={editingTraining.org || ""}
                    onChange={(e) => setEditingTraining({ ...editingTraining, org: e.target.value })}
                    placeholder="Infrastructure & CI/CD Development"
                    required
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Judul Pelatihan / Milestone
                </label>
                <input
                  type="text"
                  value={editingTraining.title || ""}
                  onChange={(e) => setEditingTraining({ ...editingTraining, title: e.target.value })}
                  placeholder="Cloud & DevOps Infrastructure Engineering"
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Deskripsi Pengalaman
                </label>
                <textarea
                  rows={3}
                  value={editingTraining.desc || ""}
                  onChange={(e) => setEditingTraining({ ...editingTraining, desc: e.target.value })}
                  placeholder="Tuliskan ringkasan peran, teknologi, dan pencapaian selama kegiatan..."
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
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
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
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
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 3 FLIPPER IMAGES EDITOR */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  3 Slot Gambar Card Flipper (Berganti saat Kartu Diklik)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((slotIdx) => {
                    const currentImg = trainingImgInputs[slotIdx] || "";
                    return (
                      <div
                        key={slotIdx}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-300">
                            Slot #{slotIdx + 1} {slotIdx === 0 ? "(Default)" : `(Flip ${slotIdx})`}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {slotIdx + 1}/3
                          </span>
                        </div>

                        <div className="relative w-full h-24 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                          {currentImg ? (
                            <Image
                              src={currentImg}
                              alt={`Slot ${slotIdx + 1}`}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-zinc-600">Belum ada</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveTrainingImgSlot(slotIdx);
                            trainingFileInputRef.current?.click();
                          }}
                          className="w-full py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Upload className="w-3 h-3 text-emerald-400" />
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
                          className="w-full px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingTraining(null)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors cursor-pointer"
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
