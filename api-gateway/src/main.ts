import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as momentTimezone from 'moment-timezone';
import { AllExecptionsFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor())
  app.useGlobalFilters(new AllExecptionsFilter());

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Pualo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen(3030);
}
bootstrap();
