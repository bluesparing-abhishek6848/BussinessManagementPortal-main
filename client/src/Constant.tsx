import dayjs from "dayjs";
import {
  LayoutDashboard,
  UserCog,
  Target,
  Users,
  SquareKanban,
  BadgeIndianRupee,
  Split,
  Currency,
} from "lucide-react";
import type {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "material-react-table";
type BuildFilterEndpointParams = {
  baseUrl: string;
  pagination: MRT_PaginationState;
  sorting: MRT_SortingState;
  columnFilters?: MRT_ColumnFiltersState;
  userRole?: string;
};

type BuildSearchEndpointParams = {
  baseUrl: string;
  pagination: MRT_PaginationState;
  sorting: MRT_SortingState;
  q: string;
};

export const formatDate = (d: string) => {
  return dayjs(d).format(DAYJS_DISPLAY_FORMAT_TABLES);
};
export const imageUrl = import.meta.env.VITE_API_IMAGE_URL;


export const makeSeoUrl = (p?: string) => {
  const frontendDomain = import.meta.env.VITE_API_FRONT_END_DOMAIN;
  if (p) {
    return `${frontendDomain}${p}`
  } else {
    return frontendDomain
  }

}
export const AdminSidebar = [
  {
    name: "Dashboard",
    link: "admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "Employees",
    link: "admin/employees",
    icon: <UserCog />,
  },
  {
    name: "Advance",
    link: "admin/advance",
    icon: <Currency />,
  },
  {
    name: "Orders",
    link: "admin/orders",
    icon: <Split />,
  },

  {
    name: "Finance",
    link: "admin/finance",
    icon: <SquareKanban />,
  },
];

export const CollectionManagerSidebar = [
  {
    name: "Dashboard",
    link: "collection-manager/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "Today Collection",
    link: "collection-manager/today-collection",
    icon: <Target />,
  },
];

export const AccountantSidebar = [
  {
    name: "Dashboard",
    link: "account-manager/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "Loan Summary",
    link: "account-manager/loan-summary",
    icon: <Currency />,
  },
  {
    name: "Branch",
    link: "account-manager/branch",
    icon: <Split />,
  },
  {
    name: "Finance",
    link: "account-manager/finance",
    icon: <SquareKanban />,
  },
];

export const BranchManagerSidebar = [
  {
    name: "Dashboard",
    link: "branch-manager/dashboard",
    icon: <LayoutDashboard />,
  },

  {
    name: "Customers",
    link: "branch-manager/customers",
    icon: <Users />,
  },
  {
    name: "Collection Manager",
    link: "branch-manager/users",
    icon: <UserCog />,
  },
  {
    name: "Today's Collection",
    link: "branch-manager/today-collection",
    icon: <Target />,
  },

  {
    name: "Distribute Loans",
    link: "branch-manager/loan",
    icon: <BadgeIndianRupee />,
  },
];

export const mapUserRoute = (role: string) => {
  switch (role) {
    case "branchManager":
      return "branch-manager";
    case "admin":
      return "admin";
    case "accountManager":
      return "account-manager";
    case "collectionManager":
      return "collection-manager";
    default:
      return "unauthorized";
  }
};

export function objectToFormData<T extends Record<string, any>>(
  data: T
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof FileList) {
      if (value.length > 0) {
        formData.append(key, value[0]);
      }
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return formData;
}
export const DAYJS_DISPLAY_FORMAT_TABLES = "MMM DD, YYYY";

export const buildGetFilterEndpoint = ({
  baseUrl,
  pagination,
  sorting,
  columnFilters,
  userRole,
}: BuildFilterEndpointParams): string => {
  const limit = pagination.pageSize ?? 10;
  const page = (pagination.pageIndex ?? 0) + 1;

  const sortBy = sorting[0]?.id ?? "createdAt";
  const order = sorting[0]?.desc ? "asc" : "desc";

  const [urlPath, queryString] = baseUrl.split("?");
  const params = new URLSearchParams(queryString || "");

  
  params.set("limit", limit.toString());
  params.set("page", page.toString());
  params.set("sortBy", sortBy);
  params.set("order", order);

  if (userRole) {
    params.set("role", userRole);
  }

  if (columnFilters) {
    columnFilters.forEach((ele) => {
      const key = ele.id;
      const val = ele.value as string;
      if (val) {
        params.set(key, val);
      }
    });
  }

  return `${urlPath}?${params.toString()}`;
};

export const buildSearchEndpoint = ({
  baseUrl,
  pagination,
  sorting,
  q,
}: BuildSearchEndpointParams): string => {
  const limit = pagination.pageSize ?? 10;
  const page = (pagination.pageIndex ?? 0) + 1;

  const sortBy = sorting[0]?.id ?? "createdAt";
  const order = sorting[0]?.desc ? "desc" : "asc";

  const [urlPath, queryString] = baseUrl.split("?");
  const params = new URLSearchParams(queryString || "");

  params.set("limit", limit.toString());
  params.set("page", page.toString());
  params.set("sortBy", sortBy);
  params.set("order", order);

  if (q) {
    params.set("q", q);
  }

  return `${urlPath}?${params.toString()}`;
};


