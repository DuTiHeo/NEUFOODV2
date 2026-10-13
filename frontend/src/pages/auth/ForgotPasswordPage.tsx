import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#f0fdf4]">
      <section className="w-full max-w-[480px] p-8 rounded-2xl bg-white shadow-xl flex flex-col gap-6 border border-emerald-100">
        <div className="flex flex-col items-center text-center gap-2">
          <Link to="/" className="flex items-center gap-3 mb-2">
            <img src="/logo.png?v=3" alt="NEUFood" className="w-12 h-12 rounded-full object-contain shadow-sm" />
            <span className="text-xl font-extrabold text-emerald-700">NEUFood</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Khôi phục mật khẩu</h1>
          <p className="text-sm text-gray-500">
            Nhập email tài khoản NEU của bạn để nhận liên kết khôi phục.
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-sm text-center">
            Đã gửi hướng dẫn khôi phục tới <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn.
            <div className="mt-4">
              <Link to="/dang-nhap" className="font-semibold text-emerald-700 hover:underline">
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 tracking-wider">ĐỊA CHỈ EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sinhvien@neu.edu.vn"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md mt-2"
            >
              Gửi yêu cầu khôi phục
            </button>
          </form>
        )}

        <div className="text-center text-sm text-gray-600">
          Nhớ mật khẩu?{' '}
          <Link to="/dang-nhap" className="font-semibold text-emerald-600 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </section>
    </main>
  );
}
