import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminSourcingResponse,
  updateAdminSourcingRequestStatus,
  updateAdminSourcingResponseStatus,
} from "./admin-sourcing.api";

import { adminSourcingKeys } from "./admin-sourcing.keys";

import type {
  CreateAdminSourcingResponseInput,
  AdminSourcingRequestStatus,
  AdminSourcingResponseStatus,
} from "./admin-sourcing.types";

// ============================================================
// REQUEST STATUS
// ============================================================

export function useUpdateAdminSourcingRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: AdminSourcingRequestStatus;
    }) =>
      updateAdminSourcingRequestStatus(id, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminSourcingKeys.detail(
          variables.id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: adminSourcingKeys.lists(),
      });
    },
  });
}

// ============================================================
// CREATE SOURCING RESPONSE
// ============================================================

export function useCreateAdminSourcingResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      input,
    }: {
      requestId: string;
      input: CreateAdminSourcingResponseInput;
    }) =>
      createAdminSourcingResponse(
        requestId,
        input,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminSourcingKeys.detail(
          variables.requestId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: adminSourcingKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

// ============================================================
// RESPONSE STATUS
// ============================================================

export function useUpdateAdminSourcingResponseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      responseId,
      requestId,
      status,
    }: {
      responseId: string;
      requestId: string;
      status: AdminSourcingResponseStatus;
    }) =>
      updateAdminSourcingResponseStatus(
        responseId,
        status,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminSourcingKeys.detail(
          variables.requestId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: adminSourcingKeys.lists(),
      });
    },
  });
}
