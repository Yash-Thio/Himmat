import { Field, ObjectType } from "type-graphql";

@ObjectType("User")
export class UserGQL {
  @Field()
  id: number;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  phone?: string;
  @Field({ nullable: true })
  isOnboarded?: boolean;
  @Field()
  emailVerified: boolean;
  @Field({ nullable: true })
  dob?: string;
  @Field({ nullable: true })
  username?: string;
}
