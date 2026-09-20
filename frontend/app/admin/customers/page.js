'use client';

import React, { useState, useEffect } from 'react';
import { fetchAdminCustomers } from '@/services/adminService';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Users, UserCheck } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      setIsLoading(true);
      const res = await fetchAdminCustomers();
      setCustomers(res);
      setIsLoading(false);
    }
    loadCustomers();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Customer Account Management</h1>
          <p className="text-xs text-secondary font-mono mt-0.5">
            Registered customer accounts, permissions, and status inspection
          </p>
        </div>
      </div>

      <Card elevated>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex flex-col gap-3 py-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-secondary">
              No registered customer accounts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border text-secondary uppercase">
                    <th className="pb-3">CUSTOMER NAME</th>
                    <th className="pb-3">EMAIL ADDRESS</th>
                    <th className="pb-3">ROLE</th>
                    <th className="pb-3">ACCOUNT STATUS</th>
                    <th className="pb-3 text-right">JOINED DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {customers.map((cust) => (
                    <tr key={cust._id} className="hover:bg-elevated/40 transition-colors">
                      <td className="py-3 font-semibold text-primary">{cust.name}</td>
                      <td className="py-3 text-cyan">{cust.email}</td>
                      <td className="py-3 uppercase">{cust.role}</td>
                      <td className="py-3">
                        <Badge variant={cust.isActive !== false ? 'success' : 'error'} size="sm" dot>
                          {cust.isActive !== false ? 'ACTIVE' : 'DISABLED'}
                        </Badge>
                      </td>
                      <td className="py-3 text-right text-secondary">
                        {new Date(cust.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
