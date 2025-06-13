import { Field, ObjectType } from "type-graphql";

@ObjectType("Trusted")
export class TrustedGQL {
  @Field()
  name: string;
  @Field()
  username: string;
  @Field()
  userId: number;
  @Field()
  email: string;
}
