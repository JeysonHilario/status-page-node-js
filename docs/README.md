# STATUS HILINK PAGE

## 1. Objetivo do Projeto
- Fornecer aos clientes informações em tempo real sobre o status operacional dos links principais do provedor de internet HiLink.

## 2. Requisitos Funcionais

### Página de Status:

- Exibir status dos links principais (Operacional, Degradado, Inoperante).
- Mostrar métricas relevantes como latência, perda de pacotes e uptime.
- Atualização em tempo real ou em intervalos configuráveis.
- Integração com API do Zabbix:  
- Consultar informações de hosts, triggers e problemas relevantes.
- Coletar e filtrar os dados diretamente do Zabbix.
- Notificações e Logs:
- Gerar logs de consulta à API do Zabbix para auditoria.
- Exibir notificações de manutenção programada.
- Interface do Usuário:
- Design responsivo e intuitivo, acessível em desktop e mobile.

## 4. Estrutura do Projeto

### Frontend:

- Página principal (Status Geral).
- Página detalhada para cada link (métricas detalhadas).
- Componente de tabela ou cards para exibição de links.

### Backend:

- Rotas para acessar o Zabbix (ex: /api/links-status).
- Middleware para autenticação e tratamento de erros.
- Cache para evitar consultas excessivas à API do Zabbix.

#### Integração com Zabbix:

- Autenticação via API key.
- Métodos principais:
- host.get: Identificar dispositivos relevantes.
- trigger.get: Obter alarmes e status de links.
- item.get: Coletar métricas como latência e jitter.

# Fluxo de Dados

- Backend consulta a API do Zabbix periodicamente ou sob demanda.
- Processa os dados e envia ao frontend.
- Frontend exibe status atualizado.
- Logs e histórico (se necessário) são armazenados no banco.

## Configurar o ambiente de desenvolvimento:
* Criar projeto Node.js e inicializar o servidor Express.
* Testar a conexão com a API do Zabbix.
* Criar estrutura inicial de rotas e métodos para integração com o Zabbix.
* Desenvolver o frontend básico para exibição do status.
* Testar integração end-to-end com dados reqais.
