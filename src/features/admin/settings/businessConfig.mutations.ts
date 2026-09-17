import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
updateBusinessConfig,
} from "./businessConfig.api";
import {
businessConfigKeys,
} from "./businessConfig.queries";
import type { BusinessConfig } from "./businessConfig.types";

export function useUpdateBusinessConfig() {
const queryClient = useQueryClient();

return useMutation({
mutationFn: ({
key,
value,
}: {
key: keyof BusinessConfig;
value: unknown;
}) => updateBusinessConfig(key, value),


onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: businessConfigKeys.all,
  });
},

});
}
