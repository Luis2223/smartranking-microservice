import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias/categorias.controller';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresController } from './jogadores/jogadores.controller';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ProxyClientProvider } from './providers/proxy-client.provider';

@Module({
  imports: [CategoriasModule],
  controllers: [CategoriasController],
  providers: [ProxyClientProvider],
})
export class AppModule {}
