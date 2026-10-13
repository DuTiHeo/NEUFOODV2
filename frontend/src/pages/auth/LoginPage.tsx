import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      login(data.access_token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng nhập không thành công, vui lòng kiểm tra lại');
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Đăng nhập vào NEUFood</h1>
          <p className="text-sm text-gray-500">Tiếp tục đặt món và theo dõi đơn hàng tại giảng đường</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

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

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 tracking-wider">MẬT KHẨU</label>
              <Link to="/quen-mat-khau" className="text-xs font-medium text-emerald-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="flex flex-col gap-3 text-center text-sm text-gray-600">
          <div>
            Chưa có tài khoản?{' '}
            <Link to="/dang-ky" className="font-semibold text-emerald-600 hover:underline">
              Đăng ký ngay
            </Link>
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-center gap-4 text-xs text-gray-500">
            <a href="/DANGNHAP.html" className="hover:text-gray-800 underline">
              Giao diện đăng nhập tĩnh
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
