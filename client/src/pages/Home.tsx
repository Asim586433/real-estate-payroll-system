import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { BarChart3, Users, TrendingUp, Lock, Zap, Shield } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Welcome to Real Estate Payroll System
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Manage commissions, track payments, and calculate taxes with elegance
            </p>
            <Link href="/dashboard" asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Manage Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Keep track of your sales team with detailed profiles and commission rates
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Track Commissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Record sales transactions and automatically calculate commissions
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Create comprehensive payroll reports with tax calculations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100">
                    <Zap className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Automated Calculations</h3>
                  <p className="text-slate-600">Commission and tax calculations happen automatically</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Secure & Reliable</h3>
                  <p className="text-slate-600">Enterprise-grade security for your payroll data</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                    <Lock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Role-Based Access</h3>
                  <p className="text-slate-600">Control who can view and modify payroll information</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-100">
                    <BarChart3 className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Detailed Reports</h3>
                  <p className="text-slate-600">Export comprehensive payroll and tax reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl mb-6">
            <span className="text-2xl font-bold text-white">RE</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6">
            Real Estate Payroll System
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Elegant commission tracking, automated tax calculations, and comprehensive payroll management for real estate professionals
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
              Get Started
            </Button>
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Employee Management</h3>
            <p className="text-slate-400">
              Manage employee profiles, commission rates, and employment status all in one place
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Commission Tracking</h3>
            <p className="text-slate-400">
              Record sales transactions and automatically calculate commissions based on configurable rates
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Payroll Reports</h3>
            <p className="text-slate-400">
              Generate comprehensive reports with commission breakdowns and tax withholdings
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Zap className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">Automated Calculations</h4>
                <p className="text-slate-400">Tax and commission calculations happen automatically</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">Secure & Reliable</h4>
                <p className="text-slate-400">Enterprise-grade security for your data</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Lock className="w-6 h-6 text-purple-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">Role-Based Access</h4>
                <p className="text-slate-400">Control who can view and modify information</p>
              </div>
            </div>
            <div className="flex gap-4">
              <BarChart3 className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">Detailed Reports</h4>
                <p className="text-slate-400">Export comprehensive payroll and tax reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-6">Ready to simplify your payroll management?</p>
          <a href={getLoginUrl()}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
              Login to Get Started
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
