import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'HTTP error reason phrase',
  })
  error!: string;

  @ApiProperty({
    description: 'Error detail string or array of validation constraint failures',
    oneOf: [
      { type: 'string', example: 'Product 99999 not found' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['minPrice must be less than or equal to maxPrice'],
      },
    ],
  })
  message!: string | string[];

  @ApiProperty({
    example: '/products/abc',
    description: 'Request path that resulted in this error',
  })
  path!: string;

  @ApiProperty({
    example: '2026-10-03T16:30:00.000Z',
    description: 'Timestamp when the error occurred in ISO 8601 format',
  })
  timestamp!: string;
}
