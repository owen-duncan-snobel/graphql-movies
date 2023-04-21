import { readFileSync } from 'fs'
import path from 'path'


const resolvePath = (directorName: string, filePath: string) => path.resolve(directorName, filePath)

export const readGraphQLTypeDef = (directoryName: string, filePath: string) => {
  return readFileSync(resolvePath(directoryName, filePath), { encoding: 'utf-8'})
}
