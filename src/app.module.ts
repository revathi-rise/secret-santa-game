import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecretSantaModule } from './secret-santa/secret-santa.module';

@Module({
  imports: [SecretSantaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
