# CTM Studio

Gerenciador de temas CSS com resolução inteligente de variáveis. Ferramenta desenvolvida para designers e desenvolvedores que trabalham com design systems e precisam manter consistência em suas variáveis CSS.

## Índice

- [Sobre](#sobre)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Exemplos Práticos](#exemplos-práticos)

## Sobre

O CTM Studio resolve um problema comum no desenvolvimento front-end: gerenciar e buscar variáveis CSS em múltiplos temas. A aplicação oferece uma interface visual para cadastrar temas, buscar variáveis específicas e visualizar toda a cadeia de resolução quando uma variável referencia outra.

**Diferenciais:**

Busca em tempo real que encontra variáveis em todos os temas cadastrados, mostrando inclusive a cadeia completa de resolução quando há referências entre variáveis (ex: `var(--primary)` → `var(--blue-500)` → `#3b82f6`).

Sistema de importação flexível que aceita tanto JSON estruturado quanto CSS puro, facilitando a migração de projetos existentes.

Detecção automática de problemas como referências circulares e valores duplicados, ajudando a manter a qualidade do código.


## Principais Funcionalidades

### Gestão de Temas

Crie temas personalizados com variáveis CSS específicas para cada projeto. A edição é simples e permite adicionar, remover ou modificar variáveis a qualquer momento. Temas podem ser excluídos com segurança através de confirmação.

### Busca de Variáveis

O sistema de busca funciona em tempo real, mostrando como cada variável é definida em todos os temas cadastrados. Quando uma variável referencia outra usando `var()`, a cadeia completa de resolução é exibida visualmente.

Exemplo de resolução:
```
Entrada: --bg
Tema Escuro: var(--neutral-900) → #171717
Tema Claro:  var(--gray-50) → #f9fafb
```

### Importação de Temas

Importe temas existentes de duas formas:

**JSON estruturado:**
```json
{
  "nome": "Meu Tema",
  "variaveis": {
    "--color-primary": "#3b82f6",
    "--bg": "var(--neutral-900)"
  }
}
```

**CSS puro:**
```css
--color-primary: #3b82f6;
--bg: var(--neutral-900);
--text: #ffffff;
```

O parser é inteligente e remove automaticamente seletores CSS como `:root`, mantendo apenas as variáveis válidas.

### Detecção de Problemas

A aplicação identifica automaticamente:

**Referências Circulares:**
```
--a: var(--b)
--b: var(--c)
--c: var(--a)
↓
Resultado: [Referência circular detectada]
```

**Valores Duplicados:**
Quando uma variável tem múltiplos valores separados por `|`, cada um é exibido separadamente com seu índice.

### Internacionalização

Interface disponível em português, inglês e espanhol. A troca de idioma é instantânea e persiste entre sessões. Toda a aplicação, incluindo mensagens de erro e validações, é traduzida.

### Temas Visuais

Alterne entre modo claro e escuro conforme sua preferência. A escolha é salva automaticamente e aplicada em todas as sessões futuras.

## Tecnologias

**Frontend Framework**
- Next.js 16.0 com App Router
- React 19.2
- TypeScript para type safety

**Estilização e UI**
- Tailwind CSS 4.1
- Radix UI para componentes acessíveis
- shadcn/ui para componentes reutilizáveis
- Lucide React para ícones
- next-themes para gestão de temas

**Formulários**
- React Hook Form para performance
- Zod para validação de schemas

**Utilitários**
- Sonner para notificações toast
- class-variance-authority para variantes de componentes

## Instalação

### Pré-requisitos
- Node.js 18 ou superior
- pnpm (recomendado) ou npm

### Passos

**1. Clone o repositório**
```bash
git clone https://github.com/Alexbbianchi/ctm-studio.git
cd ctm-studio
```

**2. Instale as dependências**
```bash
pnpm install
```
ou
```bash
npm install
```

**3. Execute em desenvolvimento**
```bash
pnpm dev
```
ou
```bash
npm run dev
```

**4. Acesse a aplicação**
```
http://localhost:3000
```

### Build para produção
```bash
pnpm build
pnpm start
```

## Como Usar

### Criar um Tema

**Modo Manual**

1. Clique em "Novo Tema"
2. Digite o nome (ex: "Dark Theme")
3. Adicione variáveis:
   - Nome: `--color-primary`
   - Valor: `#3b82f6`
4. Clique em "Salvar"

**Importar JSON**

Cole um JSON no seguinte formato:
```json
{
  "nome": "Meu Tema",
  "variaveis": {
    "--color-primary": "#ff8000",
    "--bg": "#000000",
    "--text": "var(--white)"
  }
}
```

**Importar CSS**

Cole CSS puro:
```css
--color-primary: #ff8000;
--bg: #000000;
--text: var(--white);
```

### Buscar Variável

Digite na barra de busca o nome da variável (com ou sem `--`):
```
--color-primary
```

Veja o valor em todos os temas com a cadeia de resolução completa:
```
Tema Escuro → var(--blue-500) → #3b82f6
Tema Claro  → var(--blue-600) → #2563eb
```

### Editar ou Excluir Tema

- **Editar**: Clique no botão "Editar" no card do tema
- **Excluir**: Clique em "Excluir" e confirme a ação

```bash
git clone https://github.com/Alexbbianchi/ctm-studio.git
cd ctm-studio
```

2. **Instale as dependências**
```bash
pnpm install
# ou
npm install
```

3. **Execute em desenvolvimento**
```bash
pnpm dev
# ou
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:3000
```

### Build para produção
```bash
pnpm build
pnpm start
```

---

## 🚀 Como Usar

### 1️⃣ Criar um Tema

<details>
<summary><b>Modo Manual</b></summary>

1. Clique em **"Novo Tema"**
2. Digite o nome (ex: "Dark Theme")
3. Adicione variáveis:
   - Nome: `--color-primary`
   - Valor: `#3b82f6`
4. Clique em "Salvar"

</details>

<details>
<summary><b>Importar JSON</b></summary>

```json
{
  "nome": "Meu Tema",
  "variaveis": {
    "--color-primary": "#ff8000",
    "--bg": "#000000",
    "--text": "var(--white)"
  }
}
```

</details>

<details>
<summary><b>Importar CSS</b></summary>

```css
--color-primary: #ff8000;
--bg: #000000;
--text: var(--white);
```

</details>

### 2️⃣ Buscar Variável

**Busca Exata** (sem asterisco):
```
--color-primary
color-primary
```
Retorna apenas a variável `--color-primary` em todos os temas.

**Busca Parcial** (com asterisco `*` no início):
```
*color
*--color
```
Retorna todas as variáveis que contenham "color":
- `--color-primary`
- `--color-secondary`
- `--background-color`
- `--text-color`

Veja o valor em **todos os temas** + **cadeia de resolução completa**:
```
Tema Escuro → var(--blue-500) → #3b82f6
Tema Claro  → var(--blue-600) → #2563eb
```

### 3️⃣ Exportar para Tailwind CSS

Exporte seus temas para o formato Tailwind CSS:

1. Clique em **"Exportar para Tailwind"**
2. Configure o mapeamento de variáveis:
   ```json
   {
     "--color-primary": "--primary",
     "--background": "--bg",
     "--text": "--foreground"
   }
   ```
3. Selecione os temas que deseja exportar
4. Escolha o tema padrão (`:root`)
5. Defina o nome do arquivo
6. Clique em **"Exportar CSS"**

**Resultado:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: 59 130 246;
    --bg: 255 255 255;
    --foreground: 0 0 0;
  }

  .dark {
    --primary: 147 197 253;
    --bg: 23 23 23;
    --foreground: 255 255 255;
  }
}
```

**Mapeamentos Salvos:**
- Salve mapeamentos frequentes para reutilização
- Carregue mapeamento padrão com um clique

### 4️⃣ Editar/Excluir

- ✏️ **Editar**: Clique no botão "Editar" no card do tema
- 🗑️ **Excluir**: Clique em "Excluir" e confirme


## Estrutura do Projeto

```
ctm-studio/
├── app/
│   ├── globals.css          # Estilos globais e variáveis CSS
│   ├── layout.tsx           # Layout principal com providers
│   ├── loading.tsx          # Estado de carregamento
│   └── page.tsx             # Página principal da aplicação
│
├── components/
│   ├── ui/                  # Componentes base do shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── settings-menu.tsx    # Menu de configurações (idioma/tema)
│   ├── theme-modal.tsx      # Modal de criação/edição de temas
│   ├── theme-provider.tsx   # Provider do next-themes
│   └── variable-resolution.tsx  # Componente de resolução de variáveis
│
├── hooks/
│   ├── use-debounce.ts      # Hook para debounce na busca
│   ├── use-locale.tsx       # Hook de internacionalização
│   └── use-theme.tsx        # Hook de tema visual (dark/light)
│
├── lib/
│   ├── i18n.ts              # Sistema de traduções (pt, en, es)
│   └── utils.ts             # Funções utilitárias
│
└── public/                  # Assets estáticos
```



## Exemplos Práticos

### Design System Completo

```json
{
  "nome": "Design System 2024",
  "variaveis": {
    "--color-primary": "#3b82f6",
    "--color-secondary": "#10b981",
    "--color-danger": "#ef4444",
    "--spacing-xs": "4px",
    "--spacing-sm": "8px",
    "--spacing-md": "16px",
    "--font-primary": "'Inter', sans-serif",
    "--font-size-base": "16px",
    "--shadow-sm": "0 1px 2px rgba(0,0,0,0.05)",
    "--shadow-md": "0 4px 6px rgba(0,0,0,0.1)",
    "--bg-primary": "var(--color-primary)",
    "--text-primary": "var(--color-primary)"
  }
}
```

### Tema com Referências

```json
{
  "nome": "Theme with References",
  "variaveis": {
    "--white": "#ffffff",
    "--black": "#000000",
    "--gray-900": "#171717",
    "--bg": "var(--gray-900)",
    "--text": "var(--white)",
    "--link": "var(--color-primary)",
    "--color-primary": "#3b82f6"
  }
}
```

### Detecção de Referência Circular

```json
{
  "nome": "Circular Test",
  "variaveis": {
    "--a": "var(--b)",
    "--b": "var(--c)",
    "--c": "var(--a)"
  }
}
```

Output esperado:
```
var(--b) → var(--c) → [Referência circular: --a]
```

### Sistema de Busca

**Busca Exata:**
```
Input: --color-primary
Result: Somente a variável --color-primary em todos os temas
```

**Busca Parcial:**
```
Input: *color
Result: Todas as variáveis contendo "color":
  - --color-primary
  - --color-secondary
  - --background-color
  - --text-color
```

## Adicionar Novo Idioma

Edite `lib/i18n.ts`:

```typescript
export type Locale = 'pt' | 'en' | 'es' | 'fr'

export const translations = {
  // ... idiomas existentes
  fr: {
    title: 'Gestionnaire de Thèmes CSS',
    subtitle: 'Enregistrez et gérez vos thèmes CSS facilement',
    // ... restante das traduções
  }
}
```

## Contribuindo

Contribuições são bem-vindas. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Autor

Alex Bianchi
- GitHub: [@Alexbbianchi](https://github.com/Alexbbianchi)

## Agradecimentos

- shadcn/ui pela biblioteca de componentes
- Radix UI pelos primitivos acessíveis
- Vercel pelo hosting

---

Feito com Next.js e TypeScript


```json
{
  "nome": "Design System 2024",
  "variaveis": {
    // Colors
    "--color-primary": "#3b82f6",
    "--color-secondary": "#10b981",
    "--color-danger": "#ef4444",
    
    // Spacing
    "--spacing-xs": "4px",
    "--spacing-sm": "8px",
    "--spacing-md": "16px",
    
    // Typography
    "--font-primary": "'Inter', sans-serif",
    "--font-size-base": "16px",
    
    // Shadows
    "--shadow-sm": "0 1px 2px rgba(0,0,0,0.05)",
    "--shadow-md": "0 4px 6px rgba(0,0,0,0.1)",
    
    // Referencias
    "--bg-primary": "var(--color-primary)",
    "--text-primary": "var(--color-primary)"
  }
}

---

## English

**CTM Studio** is a modern web application for managing CSS themes visually and intuitively. Perfect for designers, developers, and teams working with design systems who need to organize, search, and maintain consistency in CSS variables.

### Key Features

- Instant search: Find any CSS variable across all themes
- Smart resolution: Track var() references and detect circular dependencies
- Multilingual: Support for Portuguese, English, and Spanish
- Dark/Light mode: Perfect theme switching
- Import/Export: Import themes via JSON or pure CSS
- LocalStorage: Automatic persistence without backend

### Quick Start

```bash
git clone https://github.com/Alexbbianchi/ctm-studio.git
cd ctm-studio
pnpm install
pnpm dev
```

Access: `http://localhost:3000`

---

## Español

**CTM Studio** es una aplicación web moderna para gestionar temas CSS de forma visual e intuitiva. Ideal para diseñadores, desarrolladores y equipos que trabajan con design systems y necesitan organizar, buscar y mantener consistencia en variables CSS.

### Características Principales

- Búsqueda instantánea: Encuentre cualquier variable CSS en todos los temas
- Resolución inteligente: Rastree referencias var() y detecte dependencias circulares
- Multilingüe: Soporte para Portugués, Inglés y Español
- Dark/Light mode: Alternancia perfecta entre temas
- Import/Export: Importe temas vía JSON o CSS puro
- LocalStorage: Persistencia automática sin backend

### Inicio Rápido

```bash
git clone https://github.com/Alexbbianchi/ctm-studio.git
cd ctm-studio
pnpm install
pnpm dev
```

Acceder: `http://localhost:3000`

---

Para dúvidas ou sugestões, abra uma [issue](https://github.com/Alexbbianchi/ctm-studio/issues)
