import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Search, Eye, CheckCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Payments() {
  const { user } = useAuth();
  const { data: payments } = trpc.payments.list.useQuery();
  const { data: employees } = trpc.employees.list.useQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments?.filter(payment => {
    const emp = employees?.find(e => e.id === payment.employeeId);
    const name = emp ? `${emp.firstName} ${emp.lastName}` : "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const getEmployeeName = (employeeId: number) => {
    const emp = employees?.find(e => e.id === employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : "Unknown";
  };

  const totalGross = filteredPayments.reduce((sum, p) => sum + p.grossAmount, 0);
  const totalTaxes = filteredPayments.reduce((sum, p) => 
    sum + (p.federalTax ?? 0) + (p.stateTax ?? 0) + (p.localTax ?? 0), 0);
  const totalNet = filteredPayments.reduce((sum, p) => sum + p.netAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Payment History</h1>
          <p className="text-slate-600">Track all employee payments and commissions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Gross</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalGross)}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Taxes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalTaxes)}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Net</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalNet)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>{filteredPayments.length} payments</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Employee</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Gross</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Taxes</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Net</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Method</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {getEmployeeName(payment.employeeId)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-slate-900">
                          {formatCurrency(payment.grossAmount)}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">
                          {formatCurrency((payment.federalTax ?? 0) + (payment.stateTax ?? 0) + (payment.localTax ?? 0))}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-emerald-600">
                          {formatCurrency(payment.netAmount)}
                        </td>
                        <td className="py-3 px-4 text-slate-600 capitalize">
                          {payment.paymentMethod.replace("_", " ")}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.paymentStatus === "processed" ? "bg-emerald-100 text-emerald-800" :
                            payment.paymentStatus === "pending" ? "bg-amber-100 text-amber-800" :
                            payment.paymentStatus === "failed" ? "bg-red-100 text-red-800" :
                            "bg-slate-100 text-slate-800"
                          }`}>
                            {payment.paymentStatus === "processed" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/payments/${payment.id}`} asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">No payments found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
