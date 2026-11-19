'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Send, Upload, CheckCircle2, Clock, AlertTriangle, ShieldCheck, MessageSquare } from 'lucide-react';
import { compressImageToWebP } from '@/lib/utils/compression';
import { submitComplaint } from '@/lib/actions/mutations';
import { PublicComplaint } from '@/lib/types/database';

interface ComplaintSectionProps {
  initialComplaints: PublicComplaint[];
}

export default function ComplaintSection({ initialComplaints }: ComplaintSectionProps) {
  const [complaints, setComplaints] = useState<PublicComplaint[]>(initialComplaints);
  const [formData, setFormData] = useState({
    citizen_name: '',
    citizen_nik: '',
    citizen_phone: '',
    citizen_email: '',
    title: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsCompressing(true);
      try {
        const compressed = await compressImageToWebP(file);
        setSelectedFile(compressed);
      } catch {
        setSelectedFile(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    let photoUrl = '';
    // If selectedFile is present and Supabase storage is active, upload here or handle gracefully
    if (selectedFile) {
      photoUrl = URL.createObjectURL(selectedFile); // Instant local preview representation
    }

    const res = await submitComplaint({
      ...formData,
      photo_proof_url: photoUrl,
    });

    if (res.success) {
      setMessage({
        text: 'Aspirasi / pengaduan Anda berhasil dikirim ke Pemerintah Desa. Petugas akan segera memverifikasi laporan Anda.',
        type: 'success',
      });
      // Add optimistic item
      const newItem: PublicComplaint = {
        id: Math.random().toString(),
        citizen_name: formData.citizen_name,
        citizen_nik: formData.citizen_nik || null,
        citizen_phone: formData.citizen_phone || null,
        citizen_email: formData.citizen_email || null,
        title: formData.title,
        description: formData.description,
        photo_proof_url: photoUrl || null,
        status: 'menunggu',
        official_response: null,
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setComplaints([newItem, ...complaints]);
      setFormData({
        citizen_name: '',
        citizen_nik: '',
        citizen_phone: '',
        citizen_email: '',
        title: '',
        description: '',
      });
      setSelectedFile(null);
    } else {
      setMessage({
        text: res.error || 'Terjadi kendala saat mengirimkan laporan.',
        type: 'error',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* 1. Complaint Submission Form */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 sticky top-28">
          <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Form Pengaduan & Aspirasi</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Sampaikan Suara Anda
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-6">
            Identitas NIK dienkripsi dan hanya dapat dilihat oleh Tim Administrator Desa.
          </p>

          {message && (
            <div
              className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm font-semibold flex items-start space-x-3 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Pelapor *
              </label>
              <input
                type="text"
                required
                value={formData.citizen_name}
                onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor NIK KTP
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.citizen_nik}
                  onChange={(e) => setFormData({ ...formData, citizen_nik: e.target.value })}
                  placeholder="16 Digit NIK"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.citizen_phone}
                  onChange={(e) => setFormData({ ...formData, citizen_phone: e.target.value })}
                  placeholder="0812xxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Laporan / Pengaduan *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Lampu Jalan Padam di RT 03"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Isi Lengkap Laporan & Lokasi Kejadian *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan secara rinci permasalahan yang terjadi..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unggah Bukti Foto (Otomatis Di-compress WebP)
              </label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-50/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">
                    {selectedFile
                      ? `Foto dipilih: ${selectedFile.name}`
                      : 'Pilih foto lampiran bukti'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Maks 5MB • Otomatis WebP
                  </span>
                </div>
              </div>
              {isCompressing && (
                <p className="text-[10px] text-primary font-bold mt-1 animate-pulse">
                  Mengompresi gambar ke WebP...
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover disabled:bg-slate-300 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirimkan...' : 'Kirim Laporan Sekarang'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* 2. Public Live Complaints & Follow-up Tracker */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between pb-2">
          <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">
            Status Tindak Lanjut Pengaduan Warga
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {complaints.length} Laporan Tercatat
          </span>
        </div>

        <div className="space-y-4">
          {complaints.map((item) => {
            const statusBadge =
              item.status === 'selesai'
                ? { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Selesai Ditindaklanjuti', icon: CheckCircle2 }
                : item.status === 'diproses'
                ? { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Sedang Diproses', icon: Clock }
                : { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Menunggu Verifikasi', icon: AlertTriangle };

            const StatusIcon = statusBadge.icon;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">
                      Oleh: <strong className="text-slate-700">{item.citizen_name}</strong> •{' '}
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <h4 className="font-bold text-slate-800 text-lg leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <span
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{statusBadge.label}</span>
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>

                {item.photo_proof_url && (
                  <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <Image
                      src={item.photo_proof_url}
                      alt="Bukti Pengaduan"
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </div>
                )}

                {/* Tanggapan Resmi Pemerintah Desa */}
                {item.official_response && (
                  <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-xs font-extrabold text-primary">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Tanggapan Resmi Pemerintah Desa Khepong Jaya:</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {item.official_response}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
