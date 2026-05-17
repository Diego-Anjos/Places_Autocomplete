# Places Autocomplete

Componente de autocompletar de endereços construído com **React**, **TypeScript** e **Vite**, consumindo a API gratuita do [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/).

---

## Como funciona na prática

### 1. O usuário digita no campo de endereço

Ao digitar, o valor do input é atualizado em tempo real. Porém, **nenhuma requisição é feita ainda** — o hook `useDebounce` segura o valor e reinicia um timer de **500ms** a cada tecla pressionada.

```
Usuário digita "Avenida Pau..."
→ timer reinicia
→ timer reinicia
→ timer reinicia
→ 500ms sem digitar → valor é liberado para a busca
```

### 2. O debounce libera a busca

Após 500ms sem digitação, o valor debouncado chega ao hook `useNominatim`. Ele só inicia a requisição se o texto tiver **pelo menos 3 caracteres**.

### 3. A requisição é feita à API do Nominatim

O hook monta a URL com os parâmetros e faz um `fetch`:

```
GET https://nominatim.openstreetmap.org/search?format=json&q=Avenida+Paulista&limit=7
```

Durante a requisição, o estado `isLoading` fica `true` e um **spinner** é exibido no input.

### 4. O AbortController evita conflitos

Se o usuário continuar digitando enquanto uma requisição está em andamento, a requisição anterior é **cancelada automaticamente** via `AbortController`. Isso garante que apenas o resultado da busca mais recente seja exibido, sem dados desatualizados aparecendo.

### 5. O dropdown exibe as sugestões

A API retorna uma lista de endereços. O componente exibe até **7 sugestões** em um dropdown animado abaixo do input, cada uma com ícone de localização e o endereço completo (`display_name`).

Se nenhum endereço for encontrado, é exibida a mensagem: `"Nenhum endereço encontrado."`

### 6. O usuário seleciona um endereço

Ao clicar (ou pressionar `Enter`) em uma sugestão:
- O input é preenchido com o endereço completo
- O dropdown fecha
- O callback `onSelect` é chamado com o objeto completo, incluindo **latitude** e **longitude**

```ts
onSelect={(result) => {
  console.log(result.display_name) // "Avenida Paulista, São Paulo..."
  console.log(result.lat)          // "-23.5614696"
  console.log(result.lon)          // "-46.6558549"
}}
```

---

## Navegação por teclado

| Tecla      | Ação                              |
|------------|-----------------------------------|
| `↓`        | Navega para a próxima sugestão    |
| `↑`        | Navega para a sugestão anterior   |
| `Enter`    | Seleciona a sugestão destacada    |
| `Escape`   | Fecha o dropdown                  |

---

## Estrutura do projeto

```
src/
├── hooks/
│   ├── useDebounce.ts       # Atrasa o valor por 500ms
│   └── useNominatim.ts      # Gerencia a chamada à API
├── components/
│   └── AddressAutocomplete/
│       ├── AddressAutocomplete.tsx        # Componente visual
│       ├── AddressAutocomplete.module.css # Estilos
│       └── index.ts                       # Exportação
├── App.tsx
└── main.tsx
```

---

## Como rodar localmente

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

---

## Tecnologias utilizadas

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Nominatim API](https://nominatim.org/release-docs/latest/api/Search/) — gratuita, sem chave de API
