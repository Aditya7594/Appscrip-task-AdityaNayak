import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthController = moduleRef.get<HealthController>(HealthController);
  });

  it('should return health status with uptime and timestamp', () => {
    const result = healthController.check();
    expect(result.status).toBe('ok');
    expect(typeof result.uptime).toBe('number');
    expect(typeof result.timestamp).toBe('string');
    expect(new Date(result.timestamp).getTime()).not.toBeNaN();
  });
});
