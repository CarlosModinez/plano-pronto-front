# Plano de Aula Gerador - Frontend

Este é o frontend para o gerador de planos de aula.

## Tecnologias

- React
- TypeScript
- Vite
- Axios
- React Router DOM

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse `http://localhost:5173`

## Configuração

A URL da API pode ser configurada no arquivo `.env` (crie se não existir) com a variável `VITE_API_URL`. O padrão é `http://localhost:3000`.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
