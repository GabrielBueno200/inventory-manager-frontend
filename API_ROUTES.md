# API Routes — Inventory Manager

Este documento descreve todos os contratos de API necessários para substituir os mocks do frontend por uma integração real. Os contratos foram derivados diretamente dos stores Zustand, hooks de formulário e schemas Zod do projeto.

---

## Convenções

- Base URL configurável via variável de ambiente (`VITE_API_BASE_URL`).
- Todas as requisições e respostas usam `Content-Type: application/json`.
- Datas no formato ISO 8601 (`2026-04-02T09:00:00.000Z`).
- IDs são strings opacas (o cliente não assume formato).
- Erros de validação retornam `400` com body `{ "errors": { "campo": "mensagem" } }`.
- Recurso não encontrado retorna `404` com body `{ "message": "..." }`.

---

## Accounts

### Listar contas

```
GET /accounts
```

**Response `200`**
```json
[
  { "id": "acc-1", "name": "Loja Principal Shopee" },
  { "id": "acc-2", "name": "Loja Secundária Shopee" }
]
```

---

### Criar conta

```
POST /accounts
```

**Request body**
```json
{ "name": "Loja Principal Shopee" }
```

| Campo  | Tipo     | Regras                      |
|--------|----------|-----------------------------|
| `name` | `string` | obrigatório, máx. 100 chars |

**Response `201`**
```json
{ "id": "acc-3", "name": "Loja Principal Shopee" }
```

---

### Atualizar conta

```
PATCH /accounts/:id
```

**Route params**
| Param | Tipo     |
|-------|----------|
| `id`  | `string` |

**Request body**
```json
{ "name": "Novo nome" }
```

| Campo  | Tipo     | Regras                      |
|--------|----------|-----------------------------|
| `name` | `string` | obrigatório, máx. 100 chars |

**Response `200`**
```json
{ "id": "acc-3", "name": "Novo nome" }
```

---

### Remover conta

```
DELETE /accounts/:id
```

**Route params**
| Param | Tipo     |
|-------|----------|
| `id`  | `string` |

**Response `204`** (sem body)

---

## Products

### Listar produtos

```
GET /products?search=&state=&page=1&pageSize=10
```

**Query params**
| Param      | Tipo     | Obrigatório | Valores possíveis                              | Default |
|------------|----------|-------------|------------------------------------------------|---------|
| `search`   | `string` | não         | texto livre (busca por nome, case-insensitive) | `""`    |
| `state`    | `string` | não         | `all` \| `normal` \| `medium` \| `low` \| `negative` | `all` |
| `page`     | `number` | não         | inteiro ≥ 1                                    | `1`     |
| `pageSize` | `number` | não         | inteiro ≥ 1                                    | `10`    |

Classificação de estado de estoque usa os thresholds ativos dos parâmetros:
- `normal`: `quantity >= thresholds.normal`
- `medium`: `thresholds.medium <= quantity < thresholds.normal`
- `low`: `0 <= quantity < thresholds.medium`
- `negative`: `quantity < 0`

**Response `200`**
```json
{
  "data": [
    {
      "id": "prod-1",
      "name": "Moldeira de clareamento dental",
      "description": "Moldeira termoformada para clareamento dental...",
      "imageUrl": null,
      "quantity": 40,
      "accountIds": ["acc-1", "acc-2", "acc-3"],
      "lastEntryAt": "2026-04-02T09:00:00.000Z",
      "lastExitAt": "2026-04-01T14:30:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalPages": 2,
  "total": 12
}
```

---

### Obter produto

```
GET /products/:id
```

**Route params**
| Param | Tipo     |
|-------|----------|
| `id`  | `string` |

**Response `200`**
```json
{
  "id": "prod-1",
  "name": "Moldeira de clareamento dental",
  "description": "Moldeira termoformada para clareamento dental...",
  "imageUrl": null,
  "quantity": 40,
  "accountIds": ["acc-1", "acc-2", "acc-3"],
  "lastEntryAt": "2026-04-02T09:00:00.000Z",
  "lastExitAt": "2026-04-01T14:30:00.000Z"
}
```

---

### Criar produto

```
POST /products
```

**Request body**
```json
{
  "name": "Moldeira de clareamento dental",
  "description": "Moldeira termoformada para clareamento dental...",
  "accountIds": ["acc-1", "acc-2"]
}
```

| Campo        | Tipo       | Regras                                  |
|--------------|------------|-----------------------------------------|
| `name`       | `string`   | obrigatório, máx. 100 chars             |
| `description`| `string`   | opcional, máx. 500 chars                |
| `accountIds` | `string[]` | obrigatório, ao menos 1 id de conta     |

> O campo `quantity` não é recebido — o servidor sempre inicializa como `0`. A quantidade é controlada exclusivamente por movimentações.

**Response `201`**
```json
{
  "id": "prod-13",
  "name": "Moldeira de clareamento dental",
  "description": "Moldeira termoformada para clareamento dental...",
  "imageUrl": null,
  "quantity": 0,
  "accountIds": ["acc-1", "acc-2"],
  "lastEntryAt": null,
  "lastExitAt": null
}
```

---

### Atualizar produto

```
PATCH /products/:id
```

**Route params**
| Param | Tipo     |
|-------|----------|
| `id`  | `string` |

**Request body**
```json
{
  "name": "Novo nome",
  "description": "Nova descrição",
  "accountIds": ["acc-1"]
}
```

| Campo         | Tipo       | Regras                              |
|---------------|------------|-------------------------------------|
| `name`        | `string`   | obrigatório, máx. 100 chars         |
| `description` | `string`   | opcional, máx. 500 chars            |
| `accountIds`  | `string[]` | obrigatório, ao menos 1 id de conta |

> Este endpoint **não** altera `quantity`, `lastEntryAt` nem `lastExitAt` — esses campos são atualizados apenas via movimentações.

**Response `200`** — produto atualizado (mesmo shape do GET)

---

### Remover produto

```
DELETE /products/:id
```

**Route params**
| Param | Tipo     |
|-------|----------|
| `id`  | `string` |

**Response `204`** (sem body)

---

## Movements

Entrada e baixa são endpoints separados pois possuem contratos diferentes. O servidor deve executar cada operação de forma **atômica**: criar o registro de `Movement` + ajustar `quantity` do produto + atualizar `lastEntryAt` ou `lastExitAt`.

### Registrar entrada (entry)

```
POST /products/:productId/entries
```

**Route params**
| Param       | Tipo     |
|-------------|----------|
| `productId` | `string` |

**Request body**
```json
{
  "quantity": 50,
  "notes": "Reposição de estoque — NF #4821"
}
```

| Campo      | Tipo     | Regras                           |
|------------|----------|----------------------------------|
| `quantity` | `number` | obrigatório, inteiro ≥ 1         |
| `notes`    | `string` | opcional, máx. 200 chars         |

> O servidor define `accountId = "manual"` e `type = "entry"` internamente.
> Após criar o movimento, o servidor incrementa `products.quantity += quantity` e seta `lastEntryAt = now()`.

**Response `201`**
```json
{
  "id": "mov-18",
  "productId": "prod-1",
  "accountId": "manual",
  "type": "entry",
  "quantity": 50,
  "notes": "Reposição de estoque — NF #4821",
  "createdAt": "2026-04-03T10:00:00.000Z",
  "previousBalance": 40,
  "resultingBalance": 90
}
```

---

### Registrar baixa (exit)

```
POST /products/:productId/exits
```

**Route params**
| Param       | Tipo     |
|-------------|----------|
| `productId` | `string` |

**Request body**
```json
{
  "accountId": "acc-1",
  "quantity": 10,
  "notes": "Venda Shopee pedido #999"
}
```

| Campo       | Tipo     | Regras                           |
|-------------|----------|----------------------------------|
| `accountId` | `string` | obrigatório, id de conta válido  |
| `quantity`  | `number` | obrigatório, inteiro ≥ 1         |
| `notes`     | `string` | opcional, máx. 200 chars         |

> O servidor define `type = "exit"` internamente.
> Após criar o movimento, o servidor decrementa `products.quantity -= quantity` e seta `lastExitAt = now()`.
> Quantidades negativas são **válidas** (estoque reserva) — o servidor não deve rejeitar baixas que ultrapassem o estoque disponível.

**Response `201`**
```json
{
  "id": "mov-19",
  "productId": "prod-1",
  "accountId": "acc-1",
  "type": "exit",
  "quantity": 10,
  "notes": "Venda Shopee pedido #999",
  "createdAt": "2026-04-03T10:05:00.000Z",
  "previousBalance": 90,
  "resultingBalance": 80
}
```

---

### Listar movimentações de um produto

```
GET /products/:productId/movements?from=&to=&type=&accountId=&sortBy=createdAt&sortOrder=desc&page=1&pageSize=10
```

**Route params**
| Param       | Tipo     |
|-------------|----------|
| `productId` | `string` |

**Query params — Filtros**
| Param       | Tipo     | Obrigatório | Valores possíveis                       | Default |
|-------------|----------|-------------|-----------------------------------------|---------|
| `from`      | `string` | não         | data `YYYY-MM-DD` (inclusiva, 00:00:00) | —       |
| `to`        | `string` | não         | data `YYYY-MM-DD` (inclusiva, 23:59:59) | —       |
| `type`      | `string` | não         | `entry` \| `exit`                       | —       |
| `accountId` | `string` | não         | id de conta                             | —       |

**Query params — Ordenação**
| Param       | Tipo     | Obrigatório | Valores possíveis                  | Default      |
|-------------|----------|-------------|------------------------------------|--------------|
| `sortBy`    | `string` | não         | `createdAt` \| `type` \| `quantity`| `createdAt`  |
| `sortOrder` | `string` | não         | `asc` \| `desc`                    | `desc`       |

**Query params — Paginação**
| Param      | Tipo     | Obrigatório | Valores possíveis | Default |
|------------|----------|-------------|-------------------|---------|
| `page`     | `number` | não         | inteiro ≥ 1       | `1`     |
| `pageSize` | `number` | não         | inteiro ≥ 1       | `10`    |

**Response `200`**
```json
{
  "data": [
    {
      "id": "mov-17",
      "productId": "prod-1",
      "accountId": "acc-2",
      "type": "entry",
      "quantity": 24,
      "notes": "Entrada complementar — NF #5110",
      "createdAt": "2026-04-02T09:00:00.000Z",
      "previousBalance": 16,
      "resultingBalance": 40
    },
    {
      "id": "mov-16",
      "productId": "prod-1",
      "accountId": "acc-1",
      "type": "exit",
      "quantity": 14,
      "notes": null,
      "createdAt": "2026-04-01T14:30:00.000Z",
      "previousBalance": 30,
      "resultingBalance": 16
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 12,
  "totalPages": 2
}
```

---

## Stock Parameters

Os parâmetros de estoque são **3 registros fixos** — não há criação nem remoção. Os IDs são enums conhecidos pelo cliente.

| ID             | Nome           | Significado                                        |
|----------------|----------------|----------------------------------------------------|
| `param-normal` | Estoque Normal | Threshold acima do qual o estoque é classificado como Normal |
| `param-medium` | Estoque Médio  | Threshold acima do qual o estoque é classificado como Médio  |
| `param-low`    | Estoque Baixo  | Threshold mínimo (geralmente 0); abaixo = Negativo |

### Listar parâmetros

```
GET /parameters
```

**Response `200`**
```json
[
  { "id": "param-normal", "name": "Estoque Normal", "value": 20, "color": "#16a34a" },
  { "id": "param-medium", "name": "Estoque Médio",  "value": 10, "color": "#d97706" },
  { "id": "param-low",    "name": "Estoque Baixo",  "value": 0,  "color": "#dc2626" }
]
```

---

### Atualizar parâmetro

```
PATCH /parameters/:id
```

**Route params**
| Param | Tipo     | Valores possíveis                              |
|-------|----------|------------------------------------------------|
| `id`  | `string` | `param-normal` \| `param-medium` \| `param-low` |

**Request body** (todos os campos opcionais individualmente)
```json
{
  "value": 15,
  "color": "#d97706"
}
```

| Campo   | Tipo     | Regras                                     |
|---------|----------|--------------------------------------------|
| `value` | `number` | opcional, inteiro ≥ 0                      |
| `color` | `string` | opcional, hex 6 dígitos (`#rrggbb`)        |

**Response `200`**
```json
{ "id": "param-normal", "name": "Estoque Normal", "value": 15, "color": "#d97706" }
```

---

## Lógica client-side (sem rota própria)

As seguintes funcionalidades são calculadas no cliente e **não requerem endpoints dedicados**:

| Funcionalidade | Como funciona |
|---|---|
| **Saldo anterior e saldo atual por movimentação** | Retornados pelo servidor como `previousBalance` e `resultingBalance` em todas as respostas de movimentação. O servidor registra esses valores no momento da operação, garantindo precisão histórica independente de alterações posteriores no estoque. |
| **Preview de baixa** | Calculado localmente: `resultingQty = product.quantity - formQuantity`, sem chamada à API |
| **Classificação de estoque** (`normal` / `médio` / `baixo` / `negativo`) | Derivada no cliente com base nos valores de `GET /parameters` |
