Projeto Integrador: Equivalência de Estágio Backend

API desenvolvida para a gestão e automação do processo de equivalência de estágio para a Instituição de Ensino Superior FATEC. O sistema permite o gerenciamento completo desde a submissão de documentos pelo aluno até a aprovação final por orientadores, junto da gestão realizada por administradores.

🎨 Interface Visual (UI/UX)

O design da interface foi planejado para priorizar a usabilidade e a clareza no fluxo de solicitações. Você pode explorar o protótipo completo através do link abaixo:

    https://www.figma.com/design/jojPPmbp5e1uAdYcMuK8ms/Fatec?node-id=0-1&t=6ECgk4cMjcZrMZsx-1

🚀 Tecnologias

Este projeto utiliza uma stack moderna e escalável:

    Runtime: Node.js

    Linguagem: TypeScript

    Framework Web: Express

    Bancos de Dados: * MySQL (Sequelize): Dados transacionais (Usuários, Solicitações, Cursos).
                     * MongoDB (Mongoose): Logs de auditoria e histórico de ações.

    Infraestrutura: Docker & Docker Compose

    Segurança: JWT (JSON Web Tokens) & Bcrypt

    Upload de Arquivos: Multer

    Envio de E-mail: Nodemailer & Etheral

    Swagger: Documentação e Teste de Rotas e API's respectivas

🏗️ Arquitetura

O projeto foi construído seguindo os princípios da Clean Architecture, garantindo que as regras de negócio sejam independentes de ferramentas externas, frameworks ou bancos de dados.

    Domain: Contém as entidades/regras de negócio e interfaces de repositórios (contratos).

    Services: Casos de uso que processam a lógica da aplicação.

    Infrastructure: Implementações técnicas de persistência, autenticação e provedores de e-mail.

    Main: Camada de composição onde as instâncias são criadas via Factories (Injeção de Dependência).

🛠️ Persistência Híbrida

Uma característica técnica marcante deste projeto é o uso de dois bancos de dados para propósitos diferentes:

    MySQL: Gerencia a consistência relacional necessária para o fluxo de aprovação das solicitações.

    MongoDB: Armazena logs de auditoria movimentação (ActionLogs) reaizada em uma solicitação, permitindo o acompnhamento do mesmo por meio de um histórico, sem que impacte no Banco de Dados Relacional.

🏁 Como Executar

O projeto está totalmente "dockerizado", o que facilita a execução do ambiente de desenvolvimento.

    Clone o repositório:
    Bash

    git clone https://github.com/GustaGevigi/Internship-Equivalency.git

    Configure as variáveis de ambiente:
    Crie um arquivo .env na raiz (baseado no .env.example).

    Suba os containers:
    Bash

    docker compose up -d

A API estará disponível em http://localhost:3000/api-docs.

🔐 Segurança e Roles

O acesso é controlado por permissões granulares:

    Student: Cria e visualiza suas próprias solicitações.

    Advisor: Analisa e adiciona observações às solicitações dos seus cursos vinculados.

    Admin: Gestão total de usuários, cursos e configurações do sistema.
