import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSourcingRequest } from "./sourcing.api";
import { sourcingKeys } from "./sourcing.queries";
import type { CreateSourcingRequestInput } from "./sourcing.types";

export function useCreateSourcingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSourcingRequestInput) =>
      createSourcingRequest(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sourcingKeys.lists(),
      });
    },
  });
}
