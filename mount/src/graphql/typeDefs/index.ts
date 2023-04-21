import { readGraphQLTypeDef } from "../utils";

const userTypeDefs = readGraphQLTypeDef(__dirname,'./user.schema.graphql');
const movieTypeDefs = readGraphQLTypeDef(__dirname,'./movie.schema.graphql');
const directorTypeDefs = readGraphQLTypeDef(__dirname,'./director.schema.graphql');

const typeDefs = `
  ${userTypeDefs}
  ${movieTypeDefs}
  ${directorTypeDefs}
`
export default typeDefs
