# Desafio NodeJS/MongoDB

Olá! Eu sou Lucas Eduardo. Aceitei um desafio para uma entrevista, mas acabei pegando dengue e não pude entregá-lo a tempo.

Esse é um projeto de uma api de geolocalização onde trabalho minhas habilidades com MongoDB, NodeJS e TypeScript
o projeto está bem simples, apenas fiz com que cumprisse os objetivos

Estou utilizado a api do Openstreetmap para buscar coordenadas e endereços. Utilizo mongoose como ORM.

Pode ser cadastrado um usuário, com um endereço OU com coordenadas, para cada usuário podem existir N regiões

As regiões são Geojson, geralmente vao formar polígonos, elas são nesse formato

```json
[
    [
        [-43.1234, -22.9876],
        [-43.4567, -22.7654],
        [-43.5678, -22.5432],
        [-43.1234, -22.9876]
    ]
]
```

Para fechar um polígono as primeiras coordenadas tem que ser iguais as ultimas coordenadas
porém não tem validação para isso, vc é livre pra enfiar o que quiser de coordenada ai

---

## Ferramentas Utilizadas

-   **IDE:** VSCode
-   **Teste de Requisições:** Postman
-   **Ambiente:** Windows WSL, Mongodb e TypeScript
-   **Combustível:** Café

---

## Desenvolvimento e Construção

Para iniciar o desenvolvimento, siga as etapas abaixo:

clone o repositório
instale e inicie o mongoDB em seu computador

seguindo a documentação: https://www.mongodb.com/docs/manual/installation/

caso seja necessário trocar a url de conexão do banco, troque no [database.ts](src/database.ts)

dica: caso vc esteja usando windows com wsl (meu caso) e vc queira usar o mongocompass
siga a dica abaixo para conectar no banco de dados que esta rodando no wsl

```bash
# rode o seguinte comando
sudo nano /etc/mongod.conf

# Encontre a linha que começa com bindIp e altere o valor para 0.0.0.0 isso vai permitir conexões de qualquer IP.
# feche e salve o arquivo
# ctrl + O > enter > ctrl + X


# reinicie o serviço
sudo service mongod restart

# após isso, rode o comando
ip addr show eth0 | grep inet | awk '{ print $2; }' | sed 's/\/.*$//'

# ele vai retornar um ip, tu vai usar esse ip para conectar ao banco

```

Após pegar o IP a tua url para conectar no banco vai ficar como algo assim, mude o ip para o que vc pegou

```bash
mongodb://192.168.x.x:27017/
```

```bash
# Instale as dependências
npm install

# Se houver problemas com a instalação de pacotes
npm install --legacy-peer-deps

# Para rodar o projeto
npm run dev

# Para executar os testes
npm run test

# Para realizar a verificação de código (lint)
npm run lint
npm run lint:fix

# Para formatar o código com o prettier
npm run format
npm run format:check
```

# Endpoints da API

### 1. `GET /`

-   Retorna um OK.

#### Parâmetros de consulta:

-   Nenhum.

#### Exemplo de resposta:

```json
OK
```

### 2. `GET /users`

-   Retorna uma lista com todos os usuários cadastrados

#### Parâmetros de consulta:

-   Nenhum.

#### Exemplo de resposta:

```json
{
    "rows": [
        {
            "_id": "65ce8c53f93eaa573b93aaed",
            "name": "teste bonitoh",
            "email": "teste@teste",
            "address": "Rua das Palmeiras, Loteamento Jardim das Flores, Bairro do Sol, Chapecó, Região Geográfica Imediata de Chapecó, Região Geográfica Intermediária de Chapecó, Santa Catarina, Região Sul, 89812-572, Brasil",
            "coordinates": [-27.1212833, -52.5931066],
            "regions": [
                "65ce8c70f93eaa573b93aaf0",
                "65ce8d918eb0646051af4737",
                "65cf54ffb3d1e73eb1c9a7dc"
            ],
            "createdAt": "2024-02-15T22:12:35.340Z",
            "updatedAt": "2024-02-16T12:28:47.668Z",
            "__v": 3
        }
    ],
    "total": 1
}
```

### 3. `GET /users/:id`

-   Retorna um usuário

#### Parâmetros de consulta:

-   Id do usuário na URL

#### Exemplo de resposta:

```json
{
    "_id": "65ce8c53f93eaa573b93aaed",
    "name": "teste bonitoh",
    "email": "teste@teste",
    "address": "Rua Eça de Queirós, Loteamento Jardim Imperial, Esplanada, Chapecó, Região Geográfica Imediata de Chapecó, Região Geográfica Intermediária de Chapecó, Santa Catarina, Região Sul, 89812-572, Brasil",
    "coordinates": [-27.1212833, -52.5931066],
    "regions": [
        "65ce8c70f93eaa573b93aaf0",
        "65ce8d918eb0646051af4737",
        "65cf54ffb3d1e73eb1c9a7dc"
    ],
    "createdAt": "2024-02-15T22:12:35.340Z",
    "updatedAt": "2024-02-16T12:28:47.668Z",
    "__v": 3
}
```

### 4. `POST /users`

-   Adiciona um usuário, deve ser informado "address" OU "coordinates"

#### Parâmetros de consulta:

-   Body

    ```json
    {
        "name": "testeNovo",
        "email": "teste@teste",
        "address": "Rua Eça de Queirós, Loteamento Jardim Imperial, Esplanada, Chapecó",
        "coordinates": null
    }
    ```

#### Exemplo de resposta:

```json
{
    "_id": "65ce8c53f93eaa573b93aaed",
    "name": "teste bonitoh",
    "email": "teste@teste",
    "address": "Rua Eça de Queirós, Loteamento Jardim Imperial, Esplanada, Chapecó, Região Geográfica Imediata de Chapecó, Região Geográfica Intermediária de Chapecó, Santa Catarina, Região Sul, 89812-572, Brasil",
    "coordinates": [-27.1212833, -52.5931066],
    "regions": [
        "65ce8c70f93eaa573b93aaf0",
        "65ce8d918eb0646051af4737",
        "65cf54ffb3d1e73eb1c9a7dc"
    ],
    "createdAt": "2024-02-15T22:12:35.340Z",
    "updatedAt": "2024-02-16T12:28:47.668Z",
    "__v": 3
}
```

### 5. `PUT /users/:id`

-   Atualiza um usuário, deve ser informado "address" OU "coordinates", ID do usuário na URL

#### Parâmetros de consulta:

-   Id do usuário na url

-   Body

    ```json
    {
        "name": "testeNovo",
        "email": "teste@teste",
        "address": "Rua Eça de Queirós, Loteamento Jardim Imperial, Esplanada, Chapecó",
        "coordinates": null
    }
    ```

#### Exemplo de resposta:

```json
{
    "message": "User updated"
}
```

### 6. `DELETE /users/:id`

-   Deleta um usuário

#### Parâmetros de consulta:

-   Id do usuário na url

#### Exemplo de resposta:

```json
{
    "message": "User deleted"
}
```

### 7. `GET /regions`

-   Lista todas as regiões

#### Parâmetros de consulta:

-   Nenhum

#### Exemplo de resposta:

```json
{
    "rows": [
        {
            "_id": "65ce83afe2846b0445d26daf",
            "name": "Nome da Região show de bola",
            "coordinates": [
                [
                    [-43.1234, -22.9876],
                    [-43.4567, -22.7654],
                    [-43.5678, -22.5432],
                    [-43.1234, -22.9876]
                ]
            ],
            "user": "65ce6ae9c470f4f65e82acbf",
            "type": "Polygon",
            "createdAt": "2024-02-15T21:35:43.980Z",
            "updatedAt": "2024-02-15T22:03:08.812Z",
            "__v": 0
        },
        {
            "_id": "65cf54ffb3d1e73eb1c9a7dc",
            "name": "Nome da Região para outro guri meu cupinxa",
            "coordinates": [
                [
                    [-43.1234, -22.9876],
                    [-43.4567, -22.7654],
                    [-43.5678, -22.5432],
                    [-43.1234, -22.9876]
                ]
            ],
            "user": "65ce8c53f93eaa573b93aaed",
            "type": "Polygon",
            "createdAt": "2024-02-16T12:28:47.660Z",
            "updatedAt": "2024-02-16T12:28:47.660Z",
            "__v": 0
        }
    ],
    "total": 2
}
```

### 8. `GET /regions/:id`

-   Lista um todas as região

#### Parâmetros de consulta:

-   Id na url

#### Exemplo de resposta:

```json
{
    "_id": "65cf54ffb3d1e73eb1c9a7dc",
    "name": "Nome da Região para outro guri meu cupinxa",
    "coordinates": [
        [
            [-43.1234, -22.9876],
            [-43.4567, -22.7654],
            [-43.5678, -22.5432],
            [-43.1234, -22.9876]
        ]
    ],
    "user": "65ce8c53f93eaa573b93aaed",
    "type": "Polygon",
    "createdAt": "2024-02-16T12:28:47.660Z",
    "updatedAt": "2024-02-16T12:28:47.660Z",
    "__v": 0
}
```

### 9. `POST /regions`

-   Adiciona uma região

#### Parâmetros de consulta:

-   Body

    ```json
    {
        "name": "Nome da Região para outro guri meu cupinxa",
        "coordinates": [
            [
                [-43.1234, -22.9876],
                [-43.4567, -22.7654],
                [-43.5678, -22.5432],
                [-43.1234, -22.9876]
            ]
        ],
        "userId": "65ce8c53f93eaa573b93aaed"
    }
    ```

#### Exemplo de resposta:

```json
{
    "_id": "65cf54ffb3d1e73eb1c9a7dc",
    "name": "Nome da Região para outro guri meu cupinxa",
    "coordinates": [
        [
            [-43.1234, -22.9876],
            [-43.4567, -22.7654],
            [-43.5678, -22.5432],
            [-43.1234, -22.9876]
        ]
    ],
    "user": "65ce8c53f93eaa573b93aaed",
    "type": "Polygon",
    "createdAt": "2024-02-16T12:28:47.660Z",
    "updatedAt": "2024-02-16T12:28:47.660Z",
    "__v": 0
}
```

### 10. `PUT /regions/:id`

-   Edita uma região

#### Parâmetros de consulta:

-   id na url

-   Body

    ```json
    {
        "name": "Nome da Região para outro guri meu cupinxa",
        "coordinates": [
            [
                [-43.1234, -22.9876],
                [-43.4567, -22.7654],
                [-43.5678, -22.5432],
                [-43.1234, -22.9876]
            ]
        ],
        "userId": "65ce8c53f93eaa573b93aaed"
    }
    ```

#### Exemplo de resposta:

```json
{
    "message": "Region updated"
}
```

### 11. `DELETE /regions/:id`

-   Exclui uma região

#### Parâmetros de consulta:

-   id na url

#### Exemplo de resposta:

```json
{
    "message": "Region deleted"
}
```
