import { Max } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType("PaginationArgs")
export class PaginationArgs {
  @Max(20)
  @Field({ defaultValue: 10, nullable: true })
  pageSize: number;
  @Field({ defaultValue: 1, nullable: true })
  page: number;
}

export function withPagination<
  T extends {
    limit: (x: number) => {
      offset: (x: number) => unknown;
    };
  },
>(qb: T, { page, pageSize }: PaginationArgs) {
  return qb.limit(pageSize).offset((page - 1) * pageSize) as Omit<
    T,
    "limit" | "offset"
  >;
}
