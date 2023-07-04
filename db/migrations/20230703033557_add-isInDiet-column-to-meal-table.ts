import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("meal", (table) => {
    table.boolean("isInDiet").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("meal", (table) => {
    table.dropColumn("isInDiet");
  });
}
