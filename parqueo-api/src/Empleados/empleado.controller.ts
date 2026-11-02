import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../Auth//guards/jwt-auth.guard.js'; // O la ruta correcta hacia donde guardaste el guard // Ajusta la ruta relativa según dónde hayas creado el archivo
import { EmpleadoService } from './empleado.service.js';

@Controller('empleados')
@UseGuards(JwtAuthGuard)
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Get()
  consultar() {
    return this.empleadoService.consultar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.empleadoService.buscar(+id);
  }

  @Post()
  agregar(@Body() body: any) {
    return this.empleadoService.agregar(body);
  }

  @Put(':id')
  editar(@Param('id') id: string, @Body() body: any) {
    return this.empleadoService.editar(+id, body);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.empleadoService.eliminar(+id);
  }
}