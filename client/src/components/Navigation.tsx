import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { getLoginUrl } from "@/const";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" asChild>
            <a className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:text-slate-700 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                RE
              </div>
              <span>Payroll</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" asChild>
                  <a className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Dashboard</a>
                </Link>
                <Link href="/employees" asChild>
                  <a className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Employees</a>
                </Link>
                <Link href="/transactions" asChild>
                  <a className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Transactions</a>
                </Link>
                <Link href="/payments" asChild>
                  <a className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Payments</a>
                </Link>
              </>
            ) : null}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{user?.name}</p>
                  <p className="text-slate-500 text-xs">{user?.role}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Login
                </Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" asChild>
                  <a className="block py-2 text-slate-600 hover:text-slate-900 font-medium">Dashboard</a>
                </Link>
                <Link href="/employees" asChild>
                  <a className="block py-2 text-slate-600 hover:text-slate-900 font-medium">Employees</a>
                </Link>
                <Link href="/transactions" asChild>
                  <a className="block py-2 text-slate-600 hover:text-slate-900 font-medium">Transactions</a>
                </Link>
                <Link href="/payments" asChild>
                  <a className="block py-2 text-slate-600 hover:text-slate-900 font-medium">Payments</a>
                </Link>
                <div className="py-3 border-t border-slate-200 mt-3">
                  <p className="font-medium text-slate-900 mb-2">{user?.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="w-full gap-2 justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Login
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
