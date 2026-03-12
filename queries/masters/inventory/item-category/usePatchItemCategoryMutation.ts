import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type ItemCategoryPatchRequest = {
  isActive: boolean;
};

export function usePatchItemCategoryMutation(itemCategoryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemCategoryPatchRequest) =>
      api.patch(
        `${inventoryEndpoints.patchItemCategory}/${itemCategoryId}`,
        data,
        {
          params: { id: itemCategoryId },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [inventoryEndpoints.getItemCategory],
      });
      queryClient.invalidateQueries({
        queryKey: [inventoryEndpoints.getItemCategory, itemCategoryId],
      });
    },
  });
}
