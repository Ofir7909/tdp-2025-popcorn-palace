import { DecimalColumnTransformer } from 'src/common/transformers';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  genre: string;

  @Column()
  duration: number;

  @Column('decimal', { transformer: new DecimalColumnTransformer() })
  rating: number;

  @Column()
  releaseYear: number;

  constructor(movie: Partial<Movie>) {
    Object.assign(this, movie);
  }
}
