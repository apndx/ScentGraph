import * as fs from 'fs'

export function getFixtureFilePath(filename: string): string {
  return `${__dirname}/../../fixtures/${filename}`
}

export function loadFixtureFile<T>(filename: string): T {
  const filePath = getFixtureFilePath(filename)
  const json = fs.readFileSync(filePath)
  // @ts-ignore
  return JSON.parse(json) as T
}
