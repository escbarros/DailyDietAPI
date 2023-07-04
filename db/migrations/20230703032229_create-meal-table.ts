import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meal", (table) => {
    // name, description, datetime, isInDiet
    table.uuid("id").primary();
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.dateTime("created_at").defaultTo(knex.fn.now).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meal");
}
