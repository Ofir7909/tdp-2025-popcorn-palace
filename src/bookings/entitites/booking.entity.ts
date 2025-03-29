import { Showtime } from 'src/showtimes/entities/showtime.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['showtimeId', 'seatNumber'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  showtimeId: number;

  @ManyToOne(() => Showtime, { onDelete: 'CASCADE' })
  showtime: Showtime;

  @Column()
  seatNumber: number;

  @Column({ type: 'uuid' })
  userId: string;

  constructor(booking: Partial<Booking>) {
    Object.assign(this, booking);
  }
}
