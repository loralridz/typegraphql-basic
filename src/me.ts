import { myContext } from "./types/myContext";
import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "./entity/User";

//this resolver checks curent session and return current user
@Resolver()
export class meResolver{
    //query returns user or null//passing myContext which has userid
    @Query( () => User,{nullable:true})
    async me(@Ctx() ctx: myContext): Promise<User | undefined>{
        if(!ctx.req.session!.userId){
            return undefined;
        }
        
    return User.findOne(ctx.req.session!.userId);

    }
}