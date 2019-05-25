import { Global, Module } from '@nestjs/common';
import { MapperService } from './mapper.service';

@Global()
@Module({
  providers: [MapperService],
  exports: [MapperService],
})
export class MapperModule {}
