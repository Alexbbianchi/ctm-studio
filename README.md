# 🎨 CTM Studio - CSS Theme Manager

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

**Gerenciador profissional de temas CSS com resolução inteligente de variáveis**

[🇧🇷 Português](#português) • [🇺🇸 English](#english) • [🇪🇸 Español](#español)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Features Principais](#-features-principais)
- [Stack Tecnológica](#-stack-tecnológica)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades Detalhadas](#-funcionalidades-detalhadas)
- [Exemplos](#-exemplos)

---

## 🎯 Sobre o Projeto

**CTM Studio** é uma aplicação web moderna para gerenciar temas CSS de forma visual e intuitiva. Ideal para designers, desenvolvedores e equipes que trabalham com design systems e precisam organizar, buscar e manter consistência em variáveis CSS.

### 💡 Por que usar?

- 🔍 **Busca Instantânea**: Encontre qualquer variável CSS em todos os temas
- 🔗 **Resolução Inteligente**: Rastreie referências `var()` e detecte dependências circulares
- 🌐 **Multilíngue**: Suporte para Português, Inglês e Espanhol
- 🌓 **Dark/Light Mode**: Alternância perfeita entre temas claro e escuro
- 📦 **Import/Export**: Importe temas via JSON ou CSS puro
- 💾 **LocalStorage**: Persistência automática sem necessidade de backend

---

## ✨ Features Principais

### 🎨 Gestão de Temas
- ➕ Criar temas com variáveis CSS personalizadas
- ✏️ Editar temas existentes
- 🗑️ Excluir temas com confirmação
- 📤 Importar temas via JSON ou CSS
- 👁️ Preview visual de cores

### 🔍 Busca Avançada
```
--color-primary → #3b82f6
--bg → var(--neutral-900) → #171717
```
- Busca em tempo real com debounce
- Resolução completa de cadeia de variáveis
- Detecção de valores duplicados
- Identificação de referências circulares

### 🌐 Internacionalização
- 🇧🇷 Português (pt)
- 🇺🇸 English (en)
- 🇪🇸 Español (es)

### 🎭 Temas Visuais
- 🌙 Dark Mode
- ☀️ Light Mode
- 🔄 Alternância persistente

---

## 🛠️ Stack Tecnológica

### Core
- **[Next.js 16.0](https://nextjs.org/)** - Framework React com App Router
- **[React 19.2](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Type Safety

### UI & Styling
- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis headless
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes reutilizáveis
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gestão de temas

### Formulários & Validação
- **[React Hook Form](https://react-hook-form.com/)** - Gestão de formulários performática
- **[Zod](https://zod.dev/)** - Schema validation

### Outros
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[class-variance-authority](https://cva.style/)** - Variantes de componentes

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm

### Passo a passo

1. **Clone o repositório**
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

Digite na barra de busca:
```
--color-primary
```

Veja o valor em **todos os temas** + **cadeia de resolução completa**:
```
Tema Escuro → var(--blue-500) → #3b82f6
Tema Claro  → var(--blue-600) → #2563eb
```

### 3️⃣ Editar/Excluir

- ✏️ **Editar**: Clique no botão "Editar" no card do tema
- 🗑️ **Excluir**: Clique em "Excluir" e confirme

---

## 📁 Estrutura do Projeto

```
ctm-studio/
├── app/
│   ├── globals.css          # Estilos globais + CSS variables
│   ├── layout.tsx           # Layout root com providers
│   ├── loading.tsx          # Loading state
│   └── page.tsx             # ⭐ Página principal
│
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── settings-menu.tsx    # Menu de configurações (idioma/tema)
│   ├── theme-modal.tsx      # Modal de criação/edição
│   ├── theme-provider.tsx   # Provider next-themes
│   └── variable-resolution.tsx  # Componente de resolução
│
├── hooks/
│   ├── use-debounce.ts      # Hook de debounce para busca
│   ├── use-locale.tsx       # Hook de internacionalização
│   └── use-theme.tsx        # Hook de tema (dark/light)
│
├── lib/
│   ├── i18n.ts              # Traduções (pt, en, es)
│   └── utils.ts             # Utilitários (cn, etc)
│
└── public/                  # Assets estáticos
```

---

## 🔧 Funcionalidades Detalhadas

### 🔍 Sistema de Busca

**Normalização Automática**
```typescript
// Usuário digita: "color-primary"
// Sistema busca: "--color-primary"
```

**Resolução de Variáveis**
```typescript
// Entrada
--bg: var(--neutral-900)
--neutral-900: #171717

// Saída visual
var(--neutral-900) → #171717
```

**Valores Duplicados**
```typescript
// Entrada
--shadow: 0px 2px 4px rgba(0,0,0,0.1) | 0px 4px 8px rgba(0,0,0,0.2)

// Saída
Tema (1): 0px 2px 4px rgba(0,0,0,0.1)
Tema (2): 0px 4px 8px rgba(0,0,0,0.2)
```

### 📦 Sistema de Import

**Suporte JSON**
```json
{
  "nome": "Play7 Theme",
  "variaveis": {
    "--color-primary": "#ff8000",
    "--color-secondary": "var(--color-primary)"
  }
}
```

**Suporte CSS**
```css
:root {
  --color-primary: #ff8000;
  --color-secondary: var(--color-primary);
}
```

**Parser Inteligente**
- Detecta formato automaticamente
- Remove `:root` e seletores
- Valida nomes de variáveis (deve começar com `--`)
- Remove duplicatas

### 💾 Persistência

**LocalStorage Structure**
```json
{
  "css-themes": [
    {
      "nome": "Tema Claro",
      "variaveis": { ... }
    }
  ],
  "locale": "pt",
  "theme": "dark"
}
```

---

## 🎨 Exemplos

### Design System Completo

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
```

### Tema com Referências Cruzadas

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

### Detecção de Circular Reference

```json
{
  "nome": "Circular Test",
  "variaveis": {
    "--a": "var(--b)",
    "--b": "var(--c)",
    "--c": "var(--a)"  // ⚠️ Circular!
  }
}
```

**Output:**
```
var(--b) → var(--c) → [Referência circular: --a]
```

---

## 🌐 Internacionalização

**Trocar idioma:**
1. Clique no ícone ⚙️ (Settings)
2. Selecione o idioma desejado
3. Interface atualiza instantaneamente

**Idiomas suportados:**
- 🇧🇷 Português (Padrão)
- 🇺🇸 English
- 🇪🇸 Español

**Adicionar novo idioma:**

Edite `lib/i18n.ts`:
```typescript
export type Locale = 'pt' | 'en' | 'es' | 'fr' // Adicione 'fr'

export const translations = {
  // ...
  fr: {
    title: 'Gestionnaire de Thèmes CSS',
    // ... outras traduções
  }
}
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. 🐛 Reportar bugs
2. 💡 Sugerir features
3. 🔧 Enviar pull requests

### Desenvolvimento Local

```bash
# Fork o projeto
# Clone seu fork
git clone https://github.com/seu-usuario/ctm-studio.git

# Crie uma branch
git checkout -b feature/nova-feature

# Faça suas alterações e commit
git commit -m "feat: adiciona nova feature"

# Push e abra um PR
git push origin feature/nova-feature
```

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Alex Bianchi**

- GitHub: [@Alexbbianchi](https://github.com/Alexbbianchi)
- LinkedIn: [Alex Bianchi](https://linkedin.com/in/alex-bianchi)

---

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) pela biblioteca de componentes
- [Radix UI](https://www.radix-ui.com/) pelos primitivos acessíveis
- [Vercel](https://vercel.com) pelo hosting e ferramentas

---

<div align="center">

**Feito com ❤️ e Next.js**

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>

---

# English

## 🎯 About

**CTM Studio** is a modern web application for managing CSS themes visually and intuitively. Perfect for designers, developers, and teams working with design systems who need to organize, search, and maintain consistency in CSS variables.

## ✨ Key Features

- 🔍 **Instant Search**: Find any CSS variable across all themes
- 🔗 **Smart Resolution**: Track `var()` references and detect circular dependencies
- 🌐 **Multilingual**: Support for Portuguese, English, and Spanish
- 🌓 **Dark/Light Mode**: Perfect theme switching
- 📦 **Import/Export**: Import themes via JSON or pure CSS
- 💾 **LocalStorage**: Automatic persistence without backend

## 🚀 Quick Start

```bash
git clone https://github.com/Alexbbianchi/ctm-studio.git
cd ctm-studio
pnpm install
pnpm dev
```

Access: `http://localhost:3000`

---

# Español

## 🎯 Acerca de

**CTM Studio** es una aplicación web moderna para gestionar temas CSS de forma visual e intuitiva. Ideal para diseñadores, desarrolladores y equipos que trabajan con design systems y necesitan organizar, buscar y mantener consistencia en variables CSS.

## ✨ Características Principales

- 🔍 **Búsqueda Instantánea**: Encuentre cualquier variable CSS en todos los temas
- 🔗 **Resolución Inteligente**: Rastree referencias `var()` y detecte dependencias circulares
- 🌐 **Multilingüe**: Soporte para Portugués, Inglés y Español
- 🌓 **Dark/Light Mode**: Alternancia perfecta entre temas
- 📦 **Import/Export**: Importe temas vía JSON o CSS puro
- 💾 **LocalStorage**: Persistencia automática sin backend

## 🚀 Inicio Rápido

```bash
git clone https://github.com/Alexbbianchi/ctm-studio.git
cd ctm-studio
pnpm install
pnpm dev
```

Acceder: `http://localhost:3000`

---

<div align="center">

### 📞 Contato / Contact / Contacto

Para dúvidas ou sugestões, abra uma [issue](https://github.com/Alexbbianchi/ctm-studio/issues)

</div>
