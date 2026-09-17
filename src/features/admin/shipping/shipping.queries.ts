import { useQuery } from "@tanstack/react-query";
import {
  getShippingConfiguration,
  getShippingConfigurations,
  getShippingRule,
  getShippingRules,
} from "./shipping.api";

export const shippingKeys = {
  all: ["admin-shipping"] as const,

  configurations: () => [...shippingKeys.all, "configurations"] as const,

  configuration: (id: string) =>
    [...shippingKeys.configurations(), id] as const,

  rules: (configurationId?: string) =>
    [...shippingKeys.all, "rules", configurationId ?? "all"] as const,

  rule: (id: string) => [...shippingKeys.all, "rule", id] as const,
};

export function useShippingConfigurations() {
  return useQuery({
    queryKey: shippingKeys.configurations(),
    queryFn: getShippingConfigurations,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useShippingConfiguration(id?: string) {
  return useQuery({
    queryKey: shippingKeys.configuration(id ?? ""),
    queryFn: () => getShippingConfiguration(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useShippingRules(configurationId?: string) {
  return useQuery({
    queryKey: shippingKeys.rules(configurationId),
    queryFn: () => getShippingRules(configurationId),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useShippingRule(id?: string) {
  return useQuery({
    queryKey: shippingKeys.rule(id ?? ""),
    queryFn: () => getShippingRule(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
