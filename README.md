# Places Autocomplete

<p align="center">
  <strong>Conheça novos locais e se localize facilmente pelo nosso mapa interativo.<br/>Descubra endereços exatos em tempo real.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/OpenStreetMap-Nominatim-7EBC6F?style=flat-square&logo=openstreetmap&logoColor=white" alt="Nominatim" />
  <img src="https://img.shields.io/badge/Dark%20Mode-Glassmorphism-8B5CF6?style=flat-square" alt="Dark Mode" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
</p>

---

## ✨ Funcionalidades

| Recurso | Descrição |
|:--------|:----------|
| 🌙 **Dark Mode + Glassmorphism** | Interface moderna com fundo slate/azul escuro, acentos em violeta e card com blur e bordas sutis |
| ⚡ **Busca em tempo real** | Autocomplete de endereços com **debounce de 500ms** e mínimo de 3 caracteres |
| 🗺️ **Mapa interativo** | Integração com **Leaflet** — ao selecionar um endereço, o mapa **voa** (`flyTo`) até as coordenadas |
| ⌨️ **Navegação por teclado** | Setas ↑/↓, `Enter` e `Escape` no dropdown de sugestões |
| 🛡️ **Requisições otimizadas** | `AbortController` cancela buscas obsoletas e evita race conditions |

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **[Vite 8](https://vite.dev/)** — bundler e servidor de desenvolvimento
- **[React 19](https://react.dev/)** — UI reativa e componentizada
- **[TypeScript](https://www.typescriptlang.org/)** — tipagem estática de ponta a ponta

### Geocodificação
- **[Nominatim](https://nominatim.org/)** / **[OpenStreetMap](https://www.openstreetmap.org/)** — API gratuita de busca de endereços (sem chave)

### Mapas
- **[Leaflet](https://leafletjs.com/)** + **[React-Leaflet](https://react-leaflet.js.org/)** — mapa interativo, marcadores e animação `flyTo`

---

## ⚙️ Como Funciona *(Under the Hood)*

O fluxo é simples, mas bem pensado para performance e UX:

```text
[Input] → useDebounce (500ms) → useNominatim → Nominatim API
                                      ↓
                              onSelect(lat, lon)
                                      ↓
                         MapUpdater → map.flyTo() + Marker
```

### 1. Digitação otimizada
O valor do input **não dispara fetch a cada tecla**. O hook `useDebounce` aguarda **500ms** sem digitação. Só então o valor chega ao `useNominatim`, e apenas se houver **≥ 3 caracteres**.

### 2. Chamada à API Nominatim
O hook monta a requisição:

```http
GET https://nominatim.openstreetmap.org/search?format=json&q=...&limit=7&addressdetails=1
```

Se o usuário continuar digitando, o **`AbortController`** cancela a requisição anterior — o dropdown mostra só o resultado da busca mais recente.

### 3. Atualização do mapa
Ao selecionar uma sugestão, o `App` guarda o `NominatimResult` no estado. O subcomponente `MapUpdater` usa `useMap()` do React-Leaflet e executa:

```ts
map.flyTo([lat, lon], 16, { duration: 1.25 })
```

Um **Marker** (e Popup) é renderizado nas coordenadas retornadas.

### Estrutura do código

```text
src/
├── components/
│   └── AddressAutocomplete/     # Combobox acessível + dropdown
├── hooks/
│   ├── useDebounce.ts           # Delay de 500ms
│   └── useNominatim.ts          # Fetch + AbortController
├── App.tsx                      # Layout, estado e mapa Leaflet
└── main.tsx                     # Entry point
```

---

## 💻 Como Instalar e Rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (LTS recomendado)
- npm (incluso no Node)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/Diego-Anjos/Places_Autocomplete.git

# 2. Entre na pasta do projeto
cd Places_Autocomplete

# 3. Instale as dependências
npm install

# 4. Suba o servidor de desenvolvimento
npm run dev
```

Abra no navegador:

👉 **[http://localhost:5173](http://localhost:5173)**

> A porta padrão do Vite é **5173**. Se estiver ocupada, o terminal mostrará a próxima disponível.

### Scripts úteis

| Comando | Descrição |
|:--------|:----------|
| `npm run dev` | Ambiente de desenvolvimento (HMR) |
| `npm run build` | Build de produção (`tsc` + Vite) |
| `npm run preview` | Preview do build local |
| `npm run lint` | ESLint no projeto |

---

## 👨‍💻 Autor

Desenvolvido com ☕ e atenção aos detalhes por **Diego Anjos**.

<p align="left">
  <a href="https://github.com/Diego-Anjos">
    <img src="https://img.shields.io/badge/GitHub-Diego--Anjos-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Diego Anjos" />
  </a>
</p>

---

<p align="center">
  <sub>Places Autocomplete · React · TypeScript · Vite · Leaflet · Nominatim</sub>
</p>
