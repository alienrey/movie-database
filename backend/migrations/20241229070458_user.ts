import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')).notNullable()
    table.string('email').unique().notNullable()
    table.string('name').notNullable()
    table.string('password').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
}
