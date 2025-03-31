import { DecimalColumnTransformer } from 'src/common/transformers';
import { Movie } from 'src/movies/entities/movie.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { transformer: new DecimalColumnTransformer() })
  price: number;

  @Column({ nullable: false })
  movieId: number;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column()
  theater: string;

  @Column({ type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ type: 'timestamp with time zone' })
  endTime: Date;

  constructor(movie: Partial<Showtime>) {
    Object.assign(this, movie);
  }
}
