import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('trips')
export class Trip {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  startLocation: string;

  @Column({ type: 'varchar', length: 255 })
  endLocation: string;

  @Column({ type: 'integer' })
  numberOfPeople: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
