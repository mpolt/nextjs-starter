import {
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

export const usersTableFeatures = tableFeatures({
  rowSortingFeature,
});

export type UsersTableFeatures = typeof usersTableFeatures;
