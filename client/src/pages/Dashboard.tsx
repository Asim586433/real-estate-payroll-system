import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { DollarSign, Users, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: payments } = trpc.payments.list.useQuery();
  const { data: employees } = trpc.employees.list.useQuery();
  const { data: transactions } = trpc.transactions.list.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Real Estate Payroll System</h1>
          <p className="text-lg text-slate-600 mb-8">Manage commissions and payments with elegance</p>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalActiveEmployees = employees?.filter(e => e.employmentStatus === "active").length || 0;
  const pendingPayments = payments?.filter(p => p.paymentStatus === "pending").length || 0;
  const totalGrossAmount = payments?.reduce((sum, p) => sum + p.grossAmount, 0) || 0;
  const recentTransactions = transactions?.slice(-5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back, {user?.name || "User"}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Payouts */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Total Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalGrossAmount)}
              </div>
              <p className="text-xs text-slate-500 mt-1">All time</p>
            </CardContent>
          </Card>

          {/* Active Employees */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Active Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalActiveEmployees}</div>
              <p className="text-xs text-slate-500 mt-1">On payroll</p>
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{pendingPayments}</div>
              <p className="text-xs text-slate-500 mt-1">Awaiting processing</p>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Recent Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{recentTransactions.length}</div>
              <p className="text-xs text-slate-500 mt-1">Last 5 transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Payments */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest payment activity</CardDescription>
              </CardHeader>
              <CardContent>
                {payments && payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.slice(-5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="font-medium text-slate-900">Payment #{payment.id}</p>
                          <p className="text-sm text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{formatCurrency(payment.netAmount)}</p>
                          <p className={`text-xs font-medium ${
                            payment.paymentStatus === "processed" ? "text-emerald-600" : 
                            payment.paymentStatus === "pending" ? "text-amber-600" : 
                            "text-red-600"
                          }`}>
                            {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No payments yet</p>
                )}
                <Link href="/payments" asChild>
                  <Button variant="outline" className="w-full mt-4">
                    View All Payments <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {user?.role === "admin" && (
                  <>
                    <Link href="/employees/new" asChild>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Add Employee
                      </Button>
                    </Link>
                    <Link href="/transactions/new" asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Record Sale
                      </Button>
                    </Link>
                    <Link href="/settings" asChild>
                      <Button variant="outline" className="w-full">
                        Settings
                      </Button>
                    </Link>
                  </>
                )}
                <Link href="/employees" asChild>
                  <Button variant="outline" className="w-full">
                    View Employees
                  </Button>
                </Link>
                <Link href="/transactions" asChild>
                  <Button variant="outline" className="w-full">
                    View Transactions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
