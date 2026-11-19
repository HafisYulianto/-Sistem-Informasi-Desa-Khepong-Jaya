'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Clock, AlertTriangle, Send, MessageSquare } from 'lucide-react';
import { updateComplaintStatus } from '@/lib/actions/mutations';
import { PublicComplaint } from '@/lib/types/database';

interface ComplaintManagerProps {
  initialComplaints: PublicComplaint[];
}

export default function ComplaintManager({ initialComplaints }: ComplaintManagerProps) {
  const [complaints, setComplaints] = useState<PublicComplaint[]>(initialComplaints);
  const [selectedItem, setSelectedItem] = useState<PublicComplaint | null>(null);
  const [status, setStatus] = useState<'menunggu' | 'diproses' | 'selesai'>('diproses');
  const [officialResponse, setOfficialResponse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const startResponse = (item: PublicComplaint) => {
    setSelectedItem(item);
    setStatus(item.status);
    setOfficialResponse(item.official_response || '');
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    setIsUpdating(true);
    setStatusMsg(null);

    const res = await updateComplaintStatus(selectedItem.id, status, officialResponse);
    if (res.success) {
      setStatusMsg('Status pengaduan dan tanggapan resmi berhasil diperbarui dan live di web!');
      const idx = complaints.findIndex((c) => c.id === selectedItem.id);
      if (idx >= 0) {
        const copy = [...complaints];
        copy[idx] = {
          ...selectedItem,
          status,
          official_response: officialResponse,
        };
        setComplaints(copy);
      }
      setSelectedItem(null);
    } else {
      setStatusMsg(`Gagal: ${res.error}`);
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Manajemen Aspirasi & Pengaduan Warga
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Tinjau laporan warga desa, verifikasi bukti foto, ubah status proses, dan tuliskan tanggapan resmi pemerintah desa.
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Response Drawer / Section */}
      {selectedItem && (
        <div className="bg-white rounded-3xl border border-slate-300 shadow-xl p-6 sm:p-8 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h2 className="text-lg font-black text-slate-800">
              Tanggapi Laporan: {selectedItem.title}
            </h2>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Tutup
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
            <p><strong>Pelapor:</strong> {selectedItem.citizen_name} (NIK: {selectedItem.citizen_nik || '-'}, WA: {selectedItem.citizen_phone || '-'})</p>
            <p><strong>Uraian:</strong> {selectedItem.description}</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Status Penanganan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full sm:w-64 px-4 py-2 rounded-xl border border-slate-200 font-bold"
              >
                <option value="menunggu">Menunggu Verifikasi</option>
                <option value="diproses">Sedang Diproses Tim Teknis</option>
                <option value="selesai">Selesai Ditindaklanjuti</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggapan Resmi Pemerintah Desa *</label>
              <textarea
                rows={4}
                value={officialResponse}
                onChange={(e) => setOfficialResponse(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                placeholder="Tuliskan tindakan yang telah diambil atau jadwal pelaksanaan perbaikan..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md"
            >
              {isUpdating ? 'Memproses...' : 'Kirim Tanggapan Resmi'}
            </button>
            <button
              onClick={() => setSelectedItem(null)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.map((item) => {
          const badge =
            item.status === 'selesai'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : item.status === 'diproses'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50 text-amber-700 border-amber-200';

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase border ${badge} mb-1.5`}>
                    Status: {item.status}
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Oleh: {item.citizen_name} • WA: {item.citizen_phone || '-'} • NIK: {item.citizen_nik || '-'}
                  </p>
                </div>

                <button
                  onClick={() => startResponse(item)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Tanggapi Laporan</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                {item.description}
              </p>

              {item.official_response && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                  <strong>Tanggapan Resmi Saat Ini:</strong> {item.official_response}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
