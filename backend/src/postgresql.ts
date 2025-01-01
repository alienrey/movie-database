// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'
import fs from 'fs'

declare module './declarations' {
  interface Configuration {
    postgresqlClient: Knex
  }
}

export const postgresql = (app: Application) => {
  let config: any = app.get('postgresql')
  const ca = process.env.DB_CA ? Buffer.from(process.env.DB_CA, 'utf-8') : undefined
  config = {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: ca ? { ca } : false,
    },
  }
  const db = knex(config!)
  app.set('postgresqlClient', db)
}
