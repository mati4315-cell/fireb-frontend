<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

const authStore = useAuthStore()
const themeStore = useThemeStore()
</script>

<template>
  <div class="app-container">
    <header class="main-header">
      <div class="nav-content">
        <RouterLink to="/" class="logo">
          <span class="logo-text">Cdelu<span class="accent">AR</span></span>
        </RouterLink>
        
        <nav class="main-nav">
          <RouterLink to="/" class="nav-link">Explorar</RouterLink>
          
          <template v-if="!authStore.isAuthenticated">
            <RouterLink to="/login" class="nav-link login-btn">Iniciar Sesión</RouterLink>
          </template>
          
          <div v-else class="user-menu">
            <div class="user-info">
              <img 
                v-if="authStore.userProfile?.profilePictureUrl" 
                :src="authStore.userProfile.profilePictureUrl" 
                class="avatar"
              />
              <div v-else class="avatar-placeholder">
                {{ authStore.userProfile?.nombre?.charAt(0) || 'U' }}
              </div>
              <span class="user-name">{{ authStore.userProfile?.nombre || 'Mi Perfil' }}</span>
              <span v-if="authStore.userProfile?.rol === 'admin'" class="badge admin">Admin</span>
            </div>
            <button @click="authStore.logout" class="logout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>

          <button @click="themeStore.toggleTheme" class="theme-toggle" aria-label="Cambiar tema">
            <span v-if="themeStore.isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
        </nav>
      </div>
    </header>

    <main class="content-wrapper">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--bg);
}

.main-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-h);
  letter-spacing: -0.5px;
}

.accent {
  color: var(--accent);
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--accent);
}

.login-btn {
  background: var(--accent);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 99px;
  transition: opacity 0.2s;
}

.login-btn:hover {
  color: white;
  opacity: 0.9;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.4rem;
  padding-left: 1rem;
  background: var(--accent-bg);
  border-radius: 99px;
  border: 1px solid var(--accent-border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar, .avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.theme-toggle {
  background: var(--social-bg);
  border: 1px solid var(--border);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s;
  color: var(--text-h);
}

.theme-toggle:hover {
  transform: translateY(-2px);
  background: var(--border);
}

.avatar-placeholder {
  font-size: 0.8rem;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-h);
}

.badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge.admin {
  background: #ff4d4d;
  color: white;
}

.logout-btn {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(0,0,0,0.05);
  color: #ff4d4d;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
