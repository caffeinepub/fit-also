import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Principal } from "@icp-sdk/core/principal";
import React from "react";
import { ApprovalStatus } from "../backend";
import { useLanguage } from "../hooks/useLanguage";
import { useListApprovals, useSetApproval } from "../hooks/useQueries";
import { LuxuryButton } from "./LuxuryButton";
import { LuxuryCard } from "./LuxuryCard";

export function TailorManagementTable() {
  const { t } = useLanguage();
  const { data: approvals = [], isLoading } = useListApprovals();
  const setApproval = useSetApproval();

  const handleApproval = async (
    principal: Principal,
    status: ApprovalStatus,
  ) => {
    await setApproval.mutateAsync({ user: principal, status });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    );
  }

  return (
    <LuxuryCard>
      {approvals.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No approval requests yet.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Principal</TableHead>
              <TableHead>{t("orders.status")}</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval) => (
              <TableRow key={approval.principal.toString()}>
                <TableCell className="font-mono text-xs max-w-[200px] truncate">
                  {approval.principal.toString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      approval.status === ApprovalStatus.approved
                        ? "default"
                        : approval.status === ApprovalStatus.rejected
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {approval.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {approval.status !== ApprovalStatus.approved && (
                      <LuxuryButton
                        variant="primary"
                        size="sm"
                        loading={setApproval.isPending}
                        onClick={() =>
                          handleApproval(
                            approval.principal,
                            ApprovalStatus.approved,
                          )
                        }
                      >
                        {t("admin.approve")}
                      </LuxuryButton>
                    )}
                    {approval.status !== ApprovalStatus.rejected && (
                      <LuxuryButton
                        variant="secondary"
                        size="sm"
                        loading={setApproval.isPending}
                        onClick={() =>
                          handleApproval(
                            approval.principal,
                            ApprovalStatus.rejected,
                          )
                        }
                      >
                        {t("admin.reject")}
                      </LuxuryButton>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </LuxuryCard>
  );
}
