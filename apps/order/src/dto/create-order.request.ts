import {
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  sku: string;

  @IsString()
  address: string;
  
  @IsPositive()
  price: number;

  @IsPhoneNumber()
  phoneNumber: string;
}
