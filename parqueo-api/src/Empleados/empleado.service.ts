import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class EmpleadoService {
  constructor(private dataSource: DataSource) {}

  async consultar() {
    const result = await this.dataSource.query('SELECT sp_empleado_consultar() AS resultado');
    return result[0].resultado;
  }

  async buscar(id: number) {
    const result = await this.dataSource.query('SELECT sp_empleado_buscar($1) AS resultado', [id]);
    return result[0].resultado;
  }

  async agregar(body: any) {
    const {
      codigoSede,
      nombres,
      apellidos,
      dpi,
      puesto,
      telefono,
      correo,
      fechaContratacion,
      salario,
      genero,
    } = body;

    const result = await this.dataSource.query(
      'SELECT sp_empleado_agregar($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) AS resultado',
      [
        codigoSede,
        nombres,
        apellidos,
        dpi,
        puesto,
        telefono,
        correo,
        fechaContratacion,
        salario,
        genero,
      ],
    );
    return result[0].resultado;
  }

  async editar(id: number, body: any) {
    const {
      codigoSede,
      nombres,
      apellidos,
      dpi,
      puesto,
      telefono,
      correo,
      fechaContratacion,
      salario,
      genero,
    } = body;

    const result = await this.dataSource.query(
      'SELECT sp_empleado_editar($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) AS resultado',
      [
        id,
        codigoSede,
        nombres,
        apellidos,
        dpi,
        puesto,
        telefono,
        correo,
        fechaContratacion,
        salario,
        genero,
      ],
    );
    return result[0].resultado;
  }

  async eliminar(id: number) {
    const result = await this.dataSource.query('SELECT sp_empleado_eliminar($1) AS resultado', [id]);
    return result[0].resultado;
  }
}