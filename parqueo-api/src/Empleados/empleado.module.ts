import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadoController } from './empleado.controller.js';
import { EmpleadoService } from './empleado.service.js';

@Module({
  imports: [TypeOrmModule], // <-- Asegúrate de incluirlo aquí
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
})
export class EmpleadoModule {}