import { Field, ID, ObjectType, Root } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
 
//to expose types to user use fields field is only shown in playground
 
@ObjectType()
@Entity()
export class User extends BaseEntity{
 
    @Field( () => ID)
    @PrimaryGeneratedColumn()
    id: number;
 
    @Field()
    @Column()
    firstname: string;
 
    @Field()
    @Column()
    lastname: string;

    @Field()
    name(@Root() parent:User):string {
        return `${parent.firstname} ${parent.lastname}`;
    };
 
    @Field()
    @Column("text",{unique:true})
    email: string;
 
    @Column()
    password: string;
 
}
