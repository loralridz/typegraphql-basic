import { Resolver,Mutation, Arg, Ctx} from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { myContext } from "src/types/myContext";
 
@Resolver()
export class loginResolver {

    //mutation
    //in order to pass user as a type
    @Mutation( () => User, {nullable:true} )
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx:myContext
 
    ): Promise<User | null>{

        const user =  await User.findOne({ where: {email}});

        if(!user){
            return null;
        }
        const valid = await bcrypt.compare(password,user.password);
        if(!valid){
            return null;
        }
        //assuming its not undefined
        ctx.req.session!.userId = user.id;
 
        return user;
    }
 
}

