import { useQuery } from "@tanstack/react-query";
import { getMyAddresses } from "./address.api";

export const addressKeys = {
  all: ["addresses"] as const,

  mine: () => [...addressKeys.all, "mine"] as const,
};

export const useMyAddresses = () => {
  return useQuery({
    queryKey: addressKeys.mine(),
    queryFn: getMyAddresses,
  });
};
