import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { inventoryEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const updateItemCategorySchema = z.object({
  categoryCode: z.string().trim().min(1, { message: "Category Code is required" }),
  categoryName: z.string().trim().min(1, { message: "Category Name is required" }),
  description: z.string().trim(),
});

export function useUpdateItemCategoryMutation(itemCategoryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: z.infer<typeof updateItemCategorySchema>) =>
      api.put<{
        itemCategoryId: string;
        categoryCode: string;
        categoryName: string;
        description: string;
      }>(
        `${inventoryEndpoints.updateItemCategory}/${itemCategoryId}`,
        { ...data },
        { params: { id: itemCategoryId } },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [inventoryEndpoints.getItemCategory] });
    },
  });
}
