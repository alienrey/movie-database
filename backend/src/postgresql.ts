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
  const ca = fs.readFileSync('./config/ap-southeast-1-bundle.pem').toString()
  config = {
    client: "pg",
    connection: {
      connectionString: process.env.DB_CONNECTION_STRING,
      ssl: {
        ca: fs.readFileSync('./config/ap-southeast-1-bundle.pem').toString()
      }
    },
    pool: {
      min: 14,
      max: 22,
    },
  };
  const db = knex(config!)

  app.set('postgresqlClient', db)
}
