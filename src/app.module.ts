import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecretSantaModule } from './secret-santa/secret-santa.module';
import { UploadModule } from './upload/upload.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [EmployeesModule, UploadModule, SecretSantaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
