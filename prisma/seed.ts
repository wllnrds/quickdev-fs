import { PrismaClient } from "@prisma/client";
import { fa, faker } from '@faker-js/faker';
import BCrypt from 'bcrypt'

const USERS = 100;
const POSTS = 20;
const MAX_COMMENTS = 10;

const prisma = new PrismaClient();

async function main(){
    await createUsers();
    await createPosts();
}

async function createPosts(){

    for(let counter = 0; counter <= POSTS; counter ++){
        const post = newPost()
        try {
            await prisma.post.create({ data: post })
        } catch (error) {
            console.log("falhou aqui", post.user_id, error )
        }
        
    }

    console.log("Posts gerados")
}

function newPost() {
    const comments = { data: randomComments() }
    const reactions = { data: randomReactions() }

    return {
        title: faker.lorem.sentence({ max : 5, min : 3 }),
        text: faker.lorem.paragraphs({ max : 5, min : 3 }, '<br/>\n'),
        user_id: faker.number.int({ min: 1, max: USERS }),
        visit: {
            create: {
                counter: faker.number.int({ min: 0, max: 1000 }),
            }
        },
        published_at: faker.date.recent({ days: 30 }),
        comments: { createMany: comments },
        reactions: { createMany: reactions }
    }
}

function randomReactions(){
    const list : any[] = []

    const START = 1;
    const END = USERS

    for( let counter = START ; counter <= END; counter ++){
        const item = { user_id: counter, verb : faker.helpers.arrayElement(['LIKE','DISLIKE','EMPTY']) }
        list.push( item)
    }

    return list.filter( i => i.verb !== 'EMPTY')
}

function randomComments(){
    const list : any[] = []

    const manyComments = faker.number.int(MAX_COMMENTS)

    for( let counter = 0 ; counter < manyComments ; counter ++){
        list.push({ 
            user_id: faker.number.int({ min: 1, max: USERS }),
            description : faker.lorem.paragraph()
        })
    }
    return list
}

async function createUsers(){
    const list = []

    for(let i=1;i<=USERS;i++){
        list.push( newUser( i ) )
    }

    await prisma.user.createMany({ data: list })
}

function newUser( order : number ) {
    return {
        email: `user${ order }@mail.co`,
        name: faker.person.fullName(),
        password: BCrypt.hashSync( "1234", 10)
    }
}

main().then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });