<div>

<a  href="https://angular.io/">

<img  style="display: inline-block"  src="https://angular.io/assets/images/logos/angular/angular.svg"  width="128"  height="128">

</a>

<a  href="http://typeorm.io/">

<img  style="display: inline-block"  src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png"  width="292"  height="128">

</a>

<br>

</div>

[![Electron Logo](https://electronjs.org/images/electron-logo.svg)](https://electronjs.org)

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]

# Começo rápido
  
``` bash

git clone https://github.com/erikhenriq/drudicar_autocenter_electron.git

npm install
  
npm start

```

# Introdução

Este projeto é uma ferramenta para geração de orçamentos e ordens de serviço com foco em centro automotivo.

Atualmente é executado com:

- Angular v8.0.3;

- Electron v5.0.4;

- Electron Builder v20.44.1;

- Angular Material v8.0.1;

- TypeORM v0.2.18;

 - SQLite v4.0.9;

  Podemos desenvolver:

- Executando em ambiente de desenvolvimento local com Hot Reload;
  
- Simulando em ambiente de produção;

## Começando
  
Clone este repositório localmente:

``` bash

git clone https://github.com/erikhenriq/drudicar_autocenter_electron.git

```

Instale as dependências com:

``` bash

npm install

```

Se você deseja gerar componentes Angular com angular-cli, **NECESSÁRIO** instalar `@ angular / cli` no contexto global npm.

Por favor, siga a [documentação do angular-cli](https://github.com/angular/angular-cli) se você instalou uma versão anterior do `angular-cli`.

``` bash

npm install -g @angular/cli

```
  
## Para o desenvolvimento
  
- **Em um terminal** -> npm start

O código do aplicativo é gerenciado por `main.ts`.O aplicativo é executado com um aplicativo Angular ([http: // localhost: 4200](http:%20//%20localhost:%204200)) e uma janela do Electron que pode editar dados no banco de dados.
  
O componente Angular contém um exemplo de importação de lib nativa Electron, TypeORM e NodeJS.

Se você precisar adicionar dependências adicionais, você deve colocá-las em `extra-webpack.config.js`.

Você pode desativar as "Ferramentas de desenvolvimento" comentando `win.webContents.openDevTools();` no `main.ts`.

## Comandos incluídos

| Comando                    | Descrição                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `npm run build`            | cria o build. Os arquivos gerados ficam no diretório/dist .                          |
| `npm run build:prod`       | cria o build com Angular *aot*. Os arquivos gerados ficam no diretório/dist.         |
| `npm run electron:local`   | cria o build e inicia o electron                                                     |
| `npm run electron:linux`   | cria o build e cria um arquivo executável para linux OS                              |
| `npm run electron:windows` | Em um Windows OS, cria o build e cria um arquivo executável para Windows 32/64 bit   |
| `npm run electron:mac`     | Em um MacOS , cria o build e cria um arquivo `.app` que pode ser executado em um Mac |

**A aplicação é otimizada. Somente o diretório /dist e dependências Node são incluídas no executável.**

## Problemas conhecidos
  

1. **Browser mode.** Você não pode usar o TypeORM no navegador, não é possível. Se você precisar executar o aplicativo no navegador e não precisar do TypeORM, pode ser usado [angular-electron](https://github.com/maximegris/angular-electron) para isso.
  
2. **Windows Build.** Você não pode criar build para `windows` se o caminho para a pasta do projeto contiver espaços ou não letras latinas.

[github-watch-badge]: https://img.shields.io/github/watchers/erikhenriq/drudicar_autocenter_electron.svg?style=social
[github-watch]: https://github.com/erikhenriq/drudicar_autocenter_electron/watchers
[github-star-badge]: https://img.shields.io/github/stars/erikhenriq/drudicar_autocenter_electron.svg?style=social
[github-star]: https://github.com/erikhenriq/drudicar_autocenter_electron/stargazers