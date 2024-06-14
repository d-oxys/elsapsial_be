/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('order_trips', {
    id: 'id',
    user_id: { type: 'integer', references: '"users"', onDelete: 'CASCADE' },
    trip_id: { type: 'integer', references: '"trips"', onDelete: 'CASCADE' },
    status: { type: 'varchar(255)', notNull: true },
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
  pgm.dropTable('order_trips');
};
