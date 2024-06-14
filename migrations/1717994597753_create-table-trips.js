/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('trips', {
    id: 'id',
    start_location: { type: 'varchar(255)', notNull: true },
    end_location: { type: 'varchar(255)', notNull: true },
    price: { type: 'numeric(10, 2)', notNull: true },
    created_at: {
      type: 'timestamp with time zone',
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      default: pgm.func('current_timestamp'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropTable('trips');
};
