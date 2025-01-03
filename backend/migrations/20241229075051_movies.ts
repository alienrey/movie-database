// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('movies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')).notNullable()
    table.text('title').notNullable()
    table.integer('year').notNullable()
    table.text('poster').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('movies')
}
