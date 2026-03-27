# Agent Coding Guidelines for 跨~界云空间 (ksj-space)

## Project Overview

Vue 2.x + Vuex + Element UI enterprise application for Chinese road bridge construction management.
This is a multi-purpose platform with file management, workflow, BIM models, chat, and more.

## Build/Lint/Test Commands

```bash
# Development
npm run serve                    # Start Vue dev server (port varies by config)

# Production builds
npm run prod                     # Production build
npm run stage                    # Staging build

# Code quality
npm run lint                     # ESLint check (.js, .vue files in src/)

# Electron (if needed)
npm run electron:build           # Build Electron app
npm run electron:serve          # Run Electron in dev mode

# Linting specific file
npx eslint --ext .js,.vue src/components/Button/toolBoxButton.vue
```

## Code Style Guidelines

### EditorConfig (.editorconfig)
- **Charset:** utf-8
- **Indentation:** tabs (2 spaces)
- **Line endings:** CRLF (Windows)
- **Max line length:** 400 characters
- **Final newline:** yes
- **Trim trailing whitespace:** yes

### ESLint Configuration
- Uses `babel-eslint` parser
- jQuery globals available (`$`, `jQuery`)
- Browser globals available
- Vue plugin enabled
- No semicolons
- `generator-star-spacing` off
- `no-debugger` is error in production, off in development
- `indent` is off (enforces EditorConfig)

### JavaScript Conventions

**Imports:**
```javascript
// Use @ alias for src directory
import request from "@/utils/request";
import postApi from "@/api/document/indexApi.js";

// Third-party imports first, then local
import Vue from "vue";
import { Message } from "element-ui";
import local from "@/utils/auth";
```

**Naming Conventions:**
```javascript
// Variables/functions: camelCase
const tableHeaderStyle = {};
function startLoading(text) {}

// Constants: UPPER_SNAKE_CASE
const commonRouteName = ["blueprint", "StandardInfo"];

// Vuex mutations: UPPER_SNAKE_CASE
SET_TOKEN: (state, token) => { state.token = token; }

// Vuex actions: camelCase
AdminLogin({ commit }, user) {}

// Component names in templates: kebab-case
<el-button @click="handleLogin">Submit</el-button>
<ksj-table :data="tableData" />

// Vue file names: PascalCase for components, kebab-case for views
ksjTable.vue, toolBoxButton.vue, Login.vue
```

**Vue Component Structure:**
```vue
<template>
  <!-- HTML here -->
</template>

<script>
import ksjTableStore from "./ksjTableStore";
import _ from 'lodash';

export default {
  name: "ksjTable",  // PascalCase component name
  components: { ksjTableBody, ksjTableColumnSet },
  props: {
    tableData: { type: Array, default: () => [] },
    height: { type: Number | String, default: "300" },
  },
  data() {
    return { store: null, columns: [] };
  },
  computed: {
    tableId() { return "tableId-" + tableIdSeed++; }
  },
  watch: { /* watchers */ },
  created() { /* lifecycle */ },
  mounted() { /* lifecycle */ },
  methods: {
    handleEvent() {},  // handle prefix for event handlers
    _privateMethod() {},  // underscore prefix for internal methods
  },
  directives: { /* custom directives */ },
};
</script>

<style lang="scss">  /* or <style> for regular CSS */
.ksjTable { /* scoped styles */ }
</style>
```

**API Pattern:**
```javascript
// src/api/*.js - Export default object with methods
export default {
  adminLogin(data) {
    return request({ method: "post", url: "/api/Home/phoneLogin", data });
  },
  getPermissions() {
    return request({ method: "get", url: "/api/Menu/GetLoginUserMenuList" });
  },
};

// Usage in components/actions
const res = await userApi.adminLogin(formData);
if (res.code === 1) { /* success */ }
```

**Vuex Store Pattern:**
```javascript
// Store structure: modules/* for feature modules
// mutations: UPPER_SNAKE_CASE
// actions: async functions returning Promises
actions: {
  AdminLogin({ commit }, user) {
    return new Promise(async (resolve, reject) => {
      const response = await userApi.adminLogin(user);
      if (response.code === 1) {
        commit("SET_TOKEN", response.data.token);
        resolve(response);
      }
    });
  },
}
```

**Error Handling:**
```javascript
// API errors handled in request.js interceptor
// Components use try/catch with async/await
async handleLogin() {
  try {
    const res = await this.$store.dispatch("AdminLogin", formData);
    if (res.code === 1) { /* handle success */ }
  } catch (error) {
    console.log("err" + error);
  }
}

// Promise rejection with empty catch for optional failures
this.$store.dispatch("FedLogOut").catch(() => {});
```

### CSS/SCSS Conventions

**Variables (src/styles/variables.scss):**
```scss
$menuText: #bfcbd9;
$menuActiveText: #409EFF;
$sideBarWidth: 280px;
```

**Usage:**
```vue
<style lang="scss">
.ksj-table-column {
  &:hover { background: #e4e7ed; }  // SCSS nesting
}
</style>
```

**Global utility classes from flex-base.scss:**
```vue
<div class="flex column ai-center jc-between">
<!-- flex, column, ai-center (align-items), jc-between (justify-content) -->
```

### HTML/Template Conventions

```vue
<!-- Event handlers on DOM elements -->
<el-button @click="handleLogin">Login</el-button>
<el-input @keyup.enter.native="keyLogin" />

<!-- Two-way binding -->
<el-input v-model="loginForm.phone" />

<!-- Conditional rendering -->
<div v-if="showCondition">...</div>
<div v-show="showCondition">...</div>

<!-- List rendering with keys -->
<template v-for="(item, index) in columns">
  <el-tag :key="index">...</el-tag>
</template>
```

## Directory Structure

```
src/
├── api/           # API modules (user.js, order.js, etc.)
├── assets/        # Static assets (images, icons)
├── components/    # Reusable Vue components
│   ├── Button/
│   ├── Table/
│   └── Pagination/
├── layout/        # Layout components (navbar, sidebar)
├── libs/          # Third-party library wrappers
├── router/        # Vue Router configuration
├── store/         # Vuex store
│   ├── modules/   # Feature modules (user.js, app.js, etc.)
│   └── getters.js
├── styles/        # Global SCSS styles
├── utils/         # Utility functions
└── views/         # Page components
    ├── login/
    ├── project/
    └── SystemSetting/
```

## Important Patterns

**Path Aliases:**
- `@` → `src/`
- Use `@/components/...`, `@/api/...`, `@/utils/...`

**Vue Global Properties:**
- `this.$dd` - DingTalk API
- `this.$echarts` - ECharts instance
- `this.$store` - Vuex store
- `this.$router` - Vue Router
- `this.$t()` - i18n translations
- `this.$success()` - Success message (custom extension)

**Custom Extensions (src/utils/extenssions):**
- Additional Vue prototype methods and filters

## i18n

- Location: `static/locales/`
- Use `this.$t('key')` or `$t('key')` in templates
- Keys follow pattern: `category.subsection.key`

## Environment Configuration

```javascript
process.env.BASE_API      // API base URL
process.env.GisIframeOrigin  // GIS iframe origin
process.env.isRead        // Read-only mode flag
```

## Common Dependencies

- **UI:** Element UI 2.x
- **State:** Vuex 3.x
- **Routing:** Vue Router 3.x
- **HTTP:** Axios
- **Charts:** ECharts 5.x
- **BPMN:** bpmn-js
- **Excel:** exceljs, xlsx
- **Encryption:** crypto-js
- **Maps:** @amap/amap-jsapi-loader
