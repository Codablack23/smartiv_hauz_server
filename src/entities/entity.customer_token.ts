import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from './entity.customer';
import { DateTime } from 'luxon';

@Entity({ name: 'customer_tokens' })
export class CustomerTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // will be used as the token

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.tokens, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  customer: CustomerEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  generateExpiration() {
    if (!this.expires_at) {
      this.expires_at = DateTime.now().plus({ days: 7 }).toJSDate();
    }
  }
}
