import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, Search, Eye } from "lucide-react";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils";

export default function Transactions() {
  const { user } = useAuth();
  const { data: transactions } = trpc.transactions.list.useQuery();
  const { data: employees } = trpc.employees.list.useQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions?.filter(trans => 
    trans.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trans.propertyCity?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getEmployeeName = (employeeId: number) => {
    const emp = employees?.find(e => e.id === employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : "Unknown";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Sales Transactions</h1>
            <p className="text-slate-600">Track all property sales and commissions</p>
          </div>
          {user?.role === "admin" && (
            <Link href="/transactions/new" asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Record Sale
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by property address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>Transaction Records</CardTitle>
            <CardDescription>{filteredTransactions.length} transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Property</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Agent</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Sale Amount</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Commission</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((trans) => (
                      <tr key={trans.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-900">{trans.propertyAddress}</p>
                          <p className="text-sm text-slate-500">{trans.propertyCity}, {trans.propertyState}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{getEmployeeName(trans.employeeId)}</td>
                        <td className="py-3 px-4 text-right font-medium text-slate-900">
                          {formatCurrency(trans.saleAmount)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <p className="font-medium text-slate-900">{formatCurrency(trans.commissionAmount)}</p>
                          <p className="text-sm text-slate-500">{formatPercentage(trans.commissionRate)}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{formatDate(trans.transactionDate)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trans.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                            trans.status === "pending" ? "bg-amber-100 text-amber-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {trans.status.charAt(0).toUpperCase() + trans.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/transactions/${trans.id}`} asChild>
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
                <p className="text-slate-500 mb-4">No transactions found</p>
                {user?.role === "admin" && (
                  <Link href="/transactions/new" asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Record First Sale
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
